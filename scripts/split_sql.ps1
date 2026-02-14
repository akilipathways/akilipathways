param (
    [string]$InputFile = "data/school_combinations_seed.sql",
    [int]$LinesPerFile = 1000,
    [string]$OutputDir = "data/seed_chunks"
)

if (!(Test-Path $InputFile)) {
    Write-Error "Input file not found: $InputFile"
    return
}

if (!(Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir | Out-Null
}
else {
    Remove-Item -Path "$OutputDir\*" -Include "*.sql" -Force
}

$reader = [System.IO.File]::OpenText($InputFile)
$count = 0
$fileNum = 1
$writer = [System.IO.File]::CreateText("$OutputDir\chunk_$fileNum.sql")

Write-Host "Splitting $InputFile into chunks of $LinesPerFile lines..."

while ($null -ne ($line = $reader.ReadLine())) {
    $writer.WriteLine($line)
    $count++
    
    if ($count -ge $LinesPerFile) {
        $writer.Close()
        Write-Host "Created chunk_$fileNum.sql"
        $fileNum++
        $count = 0
        $writer = [System.IO.File]::CreateText("$OutputDir\chunk_$fileNum.sql")
    }
}

$writer.Close()
$reader.Close()

Write-Host "Successfully split into $fileNum chunks in $OutputDir"
