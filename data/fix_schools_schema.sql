-- Add missing enrichment columns to the schools table
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='school_type') THEN
        ALTER TABLE schools ADD COLUMN school_type TEXT CHECK (school_type IN ('PUBLIC', 'PRIVATE'));
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='region') THEN
        ALTER TABLE schools ADD COLUMN region TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='uic') THEN
        ALTER TABLE schools ADD COLUMN uic TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='schools' AND column_name='knec_code') THEN
        ALTER TABLE schools ADD COLUMN knec_code TEXT;
    END IF;

    -- Add the unique constraint required for ON CONFLICT (school_name, county)
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name='schools' AND constraint_type='UNIQUE' 
        AND constraint_name='schools_school_name_county_key'
    ) THEN
        -- Try to add it, but handle case where it might already exist under a different name
        BEGIN
            ALTER TABLE schools ADD CONSTRAINT schools_school_name_county_key UNIQUE (school_name, county);
        EXCEPTION WHEN others THEN
            RAISE NOTICE 'Could not add unique constraint, it might already exist with a different name.';
        END;
    END IF;

    -- Update Cluster Check Constraint to include 'PR'
    ALTER TABLE schools DROP CONSTRAINT IF EXISTS schools_cluster_check;
    ALTER TABLE schools ADD CONSTRAINT schools_cluster_check CHECK (cluster IN ('C1', 'C2', 'C3', 'C4', 'PR'));

    -- Ensure other constraints are up to date
    ALTER TABLE schools DROP CONSTRAINT IF EXISTS schools_sex_check;
    ALTER TABLE schools ADD CONSTRAINT schools_sex_check CHECK (sex IN ('BOYS', 'GIRLS', 'MIXED'));

    ALTER TABLE schools DROP CONSTRAINT IF EXISTS schools_accommodation_check;
    ALTER TABLE schools ADD CONSTRAINT schools_accommodation_check CHECK (accommodation IN ('DAY', 'BOARDING', 'HYBRID', 'DAY & BOARDING'));

    ALTER TABLE schools DROP CONSTRAINT IF EXISTS schools_category_check;
    ALTER TABLE schools ADD CONSTRAINT schools_category_check CHECK (category IN ('REGULAR', 'SNE', 'INTEGRATED'));

END $$;
