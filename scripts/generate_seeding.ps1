# scripts/generate_seeding.ps1
# This script parses the raw ministry CSV files and generates SQL seeding statements.

$inputDir = "data/raw_ministry"
$outputFile = "data/school_combinations_seed.sql"
$masterFile = "$inputDir/senior_schools_v2.csv"
$combinationsFile = "$inputDir/subject_combinations_v2.csv"
$mappingFile = "$inputDir/combined_data.csv"

$schoolsMetadata = @{} # Name|County -> Metadata Object
$seenSchools = @{} # Name|County -> Boolean

# Normalization Helper
function Get-SchoolKey {
    param($name, $county)
    if (!$name) { return "|$county".ToUpper().Trim() }
    
    # Noise words to strip for fuzzy matching (sorted by length DESC to prevent partial matches)
    $noise = @("SECONDARY", "BOARDING", "SCHOOL", "GIRLS", "MIXED", "SCHL", "BOYS", "DAY", "SEC", "SCH")
    
    $cleanName = $name.ToUpper()
    # Remove punctuation
    $charsToRemove = @(".", "'", "[", "]", "{", "}", "(", ")", "/", "-")
    foreach ($c in $charsToRemove) { $cleanName = $cleanName.Replace($c, " ") }
    
    # Strip noise words with word boundaries (spaces)
    foreach ($word in $noise) {
        $cleanName = $cleanName.Replace(" $word ", " ").Replace(" $word", " ").Replace("$word ", " ")
    }
    
    # Remove all spaces and final cleanup
    $cleanName = $cleanName.Replace(" ", "").Trim()
    $cleanCounty = if ($county) { $county.ToUpper().Trim() } else { "" }
    return "$cleanName|$cleanCounty"
}

$sqlOutput = @("-- AKILI PATHWAYS - ENRICHED SCHOOL DATA SEED", "-- Generated on $(Get-Date)", "")

# 1. Load Master Schools Metadata
if (Test-Path $masterFile) {
    Write-Host "Loading master school metadata from $masterFile..."
    $masterData = Import-Csv $masterFile
    foreach ($row in $masterData) {
        $name = $row."SCHOOL NAME".Trim()
        $county = $row.COUNTY.Trim()
        $key = Get-SchoolKey $name $county
        
        $typeRaw = $row.TYPE.Trim().ToUpper()
        $type = if ($typeRaw -like "*PRIVATE*") { "PRIVATE" } else { "PUBLIC" }
        
        $schoolsMetadata[$key] = @{
            UIC        = $row.UIC.Trim()
            KNEC       = $row.KNEC.Trim()
            SubCounty  = $row."SUB COUNTY".Trim()
            Region     = $row.REGION.Trim()
            SchoolType = $type
            FullName   = $name
        }
    }
}

# 2. Generate Subject Combination Definitions
if (Test-Path $combinationsFile) {
    Write-Host "Generating combination definitions from $combinationsFile..."
    $comboData = Import-Csv $combinationsFile
    $sqlOutput += "-- SUBJECT COMBINATION DEFINITIONS"
    foreach ($row in $comboData) {
        $track = if ($row.Track) { $row.Track.Trim() } else { "" }
        $subjectsRaw = if ($row."Subject Combination") { $row."Subject Combination".Trim() } else { "" }
        $code = if ($row.Code) { $row.Code.Trim() } else { "" }
        
        if ([string]::IsNullOrWhiteSpace($code) -or [string]::IsNullOrWhiteSpace($subjectsRaw)) { continue }

        # Split subjects correctly
        $subjects = $subjectsRaw.Split(',') | ForEach-Object { $_.Trim() }
        
        $trackCode = "PURE_SCI"
        if ($track -like "*HUMANITIES*") { $trackCode = "HUMANITIES" }
        elseif ($track -like "*LANGUAGES*") { $trackCode = "LANGUAGES" }
        elseif ($track -like "*ARTS*") { $trackCode = "ARTS" }
        elseif ($track -like "*SPORTS*") { $trackCode = "SPORTS" }
        elseif ($track -like "*APPLIED*") { $trackCode = "APPLIED_SCI" }
        elseif ($track -like "*TECHNICAL*") { $trackCode = "TECH_STU" }

        $subjectsArray = "ARRAY['" + ($subjects -join "','").Replace("'", "''") + "']"
        
        $sqlOutput += "INSERT INTO subject_combinations (track_id, code, subjects) " +
        "SELECT id, '$code', $subjectsArray " +
        "FROM tracks WHERE code = '$trackCode' " +
        "ON CONFLICT (code) DO UPDATE SET subjects = EXCLUDED.subjects;"
    }
    $sqlOutput += ""
}

# 3. Process Mapping Data (combined_data.csv)
if (Test-Path $mappingFile) {
    Write-Host "Processing school-to-combination mappings from $mappingFile..."
    $lines = Get-Content $mappingFile
    $currentCode = $null
    
    foreach ($line in $lines) {
        if ([string]::IsNullOrWhiteSpace($line)) { continue }
        
        # Detect Code Block Header
        if ($line -match "CODE: ([A-Z0-9 ]+)") {
            $currentCode = $matches[1].Trim()
            Write-Host "Switching to combination: $currentCode"
            continue
        }
        
        # Skip CSV Header
        if ($line -match "SCHOOL NAME,COUNTY") { continue }
        
        if ($currentCode) {
            # Basic CSV Split (handles quoted commas minimally)
            $fields = $line.Split(',')
            if ($fields.Count -lt 2 -or [string]::IsNullOrWhiteSpace($fields[0])) { continue }
            
            $rawName = $fields[0].Trim().Replace('"', '')
            $rawCounty = $fields[1].Trim().Replace('"', '')
            
            # Additional fields if present in mapping
            $sex = if ($fields.Count -gt 2) { $fields[2].Trim().ToUpper() } else { "MIXED" }
            $accommodation = if ($fields.Count -gt 3) { $fields[3].Trim().ToUpper() } else { "DAY" }
            $cluster = if ($fields.Count -gt 4) { $fields[4].Trim().ToUpper() } else { "C4" }
            $category = if ($fields.Count -gt 5) { $fields[5].Trim().ToUpper() } else { "REGULAR" }
            
            # Normalization
            if ($category -like "*INTE*") { $category = "INTEGRATED" }
            elseif ($category -like "*SNE*" -or $category -like "*SPECIAL*") { $category = "SNE" }
            else { $category = "REGULAR" }
            
            if ($accommodation -like "*BOARDING*") { $accommodation = "BOARDING" }
            elseif ($accommodation -like "*DAY*") { $accommodation = "DAY" }
            elseif ($accommodation -like "*HYBRID*") { $accommodation = "HYBRID" }
            else { $accommodation = "DAY" }
            
            if ($sex -eq "BOY") { $sex = "BOYS" }
            elseif ($sex -eq "GIRL") { $sex = "GIRLS" }
            if ($sex -ne "BOYS" -and $sex -ne "GIRLS") { $sex = "MIXED" }
            
            if ($cluster -notmatch "C[1-4]|PR") { $cluster = "C4" }
            
            $key = Get-SchoolKey $rawName $rawCounty
            $meta = $schoolsMetadata[$key]
            
            # Use metadata if available, otherwise defaults
            $uic = if ($meta) { $meta.UIC } else { "" }
            $knec = if ($meta) { $meta.KNEC } else { "" }
            $subCountyRaw = if ($meta) { $meta.SubCounty } else { "" }
            $regionRaw = if ($meta) { $meta.Region } else { "" }
            $type = if ($meta) { $meta.SchoolType } else { "PUBLIC" }
            
            # Handle NULLs for SQL
            $uicVal = if ([string]::IsNullOrEmpty($uic)) { "NULL" } else { "'$uic'" }
            $knecVal = if ([string]::IsNullOrEmpty($knec)) { "NULL" } else { "'$knec'" }
            $scVal = if ([string]::IsNullOrEmpty($subCountyRaw)) { "NULL" } else { "'$($subCountyRaw.Replace("'", "''"))'" }
            $regionVal = if ([string]::IsNullOrEmpty($regionRaw)) { "NULL" } else { "'$($regionRaw.Replace("'", "''"))'" }
            
            $finalName = $rawName.Replace("'", "''")
            $finalCounty = $rawCounty.Replace("'", "''")

            # 3a. Insert/Update School Metadata
            if (!$seenSchools.ContainsKey($key)) {
                $seenSchools[$key] = $true
                $sqlOutput += "INSERT INTO schools (school_name, county, sub_county, region, school_type, sex, accommodation, cluster, category, uic, knec_code) " +
                "VALUES ('$finalName', '$finalCounty', $scVal, $regionVal, '$type', '$sex', '$accommodation', '$cluster', '$category', $uicVal, $knecVal) " +
                "ON CONFLICT (school_name, county) DO UPDATE SET " +
                "sub_county = EXCLUDED.sub_county, region = EXCLUDED.region, school_type = EXCLUDED.school_type, " +
                "uic = EXCLUDED.uic, knec_code = EXCLUDED.knec_code;"
            }
            
            # 3b. Map to Subject Combination
            $sqlOutput += "INSERT INTO school_subject_combinations (school_id, combination_id) " +
            "SELECT s.id, c.id " +
            "FROM schools s, subject_combinations c " +
            "WHERE s.school_name = '$finalName' AND s.county = '$finalCounty' " +
            "AND c.code = '$currentCode' " +
            "ON CONFLICT (school_id, combination_id) DO NOTHING;"
        }
    }
}

$sqlOutput | Out-File -FilePath $outputFile -Encoding utf8
Write-Host "Generated $outputFile with $($sqlOutput.Count) lines."

