-- Add 'features' column to providers table if it doesn't exist
-- Run this SQL in your PostgreSQL client or VS Code SQL Tools extension

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'providers' 
        AND column_name = 'features'
    ) THEN
        ALTER TABLE providers ADD COLUMN features JSON;
        RAISE NOTICE 'Added features column to providers table';
    ELSE
        RAISE NOTICE 'Features column already exists in providers table';
    END IF;
END $$;
