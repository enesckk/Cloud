-- Quick SQL Queries to View Database Tables
-- Run these in VS Code PostgreSQL extension or any PostgreSQL client

-- ============================================================
-- 1. LIST ALL TABLES
-- ============================================================
SELECT 
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Alternative (PostgreSQL specific):
\dt

-- ============================================================
-- 2. VIEW USERS TABLE STRUCTURE
-- ============================================================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users'
ORDER BY ordinal_position;

-- Alternative (PostgreSQL specific):
\d users

-- ============================================================
-- 3. VIEW ANALYSES TABLE STRUCTURE
-- ============================================================
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'analyses'
ORDER BY ordinal_position;

-- Alternative (PostgreSQL specific):
\d analyses

-- ============================================================
-- 4. VIEW FOREIGN KEYS
-- ============================================================
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
WHERE tc.constraint_type = 'FOREIGN KEY'
    AND tc.table_schema = 'public';

-- ============================================================
-- 5. VIEW INDEXES
-- ============================================================
SELECT
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- ============================================================
-- 6. COUNT RECORDS
-- ============================================================
SELECT 
    'users' as table_name, 
    COUNT(*) as record_count 
FROM users
UNION ALL
SELECT 
    'analyses', 
    COUNT(*) 
FROM analyses;

-- ============================================================
-- 7. VIEW ALL USERS (without password)
-- ============================================================
SELECT 
    id,
    email,
    name,
    title,
    created_at,
    updated_at
FROM users
ORDER BY created_at DESC;

-- ============================================================
-- 8. VIEW ALL ANALYSES (with formatted JSON)
-- ============================================================
SELECT 
    id,
    user_id,
    title,
    jsonb_pretty(config) as config,
    jsonb_pretty(estimates) as estimates,
    jsonb_pretty(trends) as trends,
    created_at,
    updated_at
FROM analyses
ORDER BY created_at DESC;

-- ============================================================
-- 9. VIEW ANALYSES WITH USER INFO (JOIN)
-- ============================================================
SELECT 
    a.id,
    a.title,
    u.email as user_email,
    u.name as user_name,
    a.created_at
FROM analyses a
JOIN users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- ============================================================
-- 10. CHECK TABLE SIZES
-- ============================================================
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
