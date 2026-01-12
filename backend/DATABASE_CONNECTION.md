# Database Connection Guide for VS Code

## VS Code Extensions for PostgreSQL

### Option 1: PostgreSQL (by Chris Kolkman) - Recommended
**Extension ID:** `ckolkman.vscode-postgres`

**Installation:**
1. Open VS Code
2. Press `Ctrl+Shift+X` (or `Cmd+Shift+X` on Mac)
3. Search for "PostgreSQL"
4. Install "PostgreSQL" by Chris Kolkman

**Connection Setup:**
1. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
2. Type "PostgreSQL: Add Connection"
3. Enter connection details:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `cloudguide_db`
   - **Username:** `cloudguide_user`
   - **Password:** `cloudguide_pass`
   - **Connection Name:** `CloudGuide Database`

**Usage:**
- View tables in the sidebar (PostgreSQL Explorer)
- Right-click on tables to see options
- Run SQL queries directly in VS Code
- View table data and structure

---

### Option 2: SQLTools + SQLTools PostgreSQL Driver
**Extension ID:** `mtxr.sqltools-driver-pg`

**Installation:**
1. Install "SQLTools" extension (`mtxr.sqltools`)
2. Install "SQLTools PostgreSQL/Redshift" driver (`mtxr.sqltools-driver-pg`)

**Connection Setup:**
1. Open SQLTools sidebar
2. Click "Add New Connection"
3. Select "PostgreSQL"
4. Enter connection details:
   - **Name:** `CloudGuide Database`
   - **Server:** `localhost`
   - **Port:** `5432`
   - **Database:** `cloudguide_db`
   - **Username:** `cloudguide_user`
   - **Password:** `cloudguide_pass`

---

### Option 3: Database Client JDBC
**Extension ID:** `cweijan.vscode-database-client2`

**Installation:**
1. Install "Database Client" extension
2. Click "New Connection" in sidebar
3. Select "PostgreSQL"
4. Enter connection details

---

## Quick Connection String

For any PostgreSQL client:
```
Host: localhost
Port: 5432
Database: cloudguide_db
Username: cloudguide_user
Password: cloudguide_pass
```

**Connection URL:**
```
postgresql://cloudguide_user:cloudguide_pass@localhost:5432/cloudguide_db
```

---

## Docker Connection (if using Docker)

If PostgreSQL is running in Docker:
- **Host:** `localhost` (or Docker container IP)
- **Port:** `5432` (mapped port)
- Other settings remain the same

---

## Useful SQL Queries

### List all tables
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### View users table structure
```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users';
```

### View analyses table structure
```sql
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'analyses';
```

### Count records
```sql
SELECT 
    'users' as table_name, 
    COUNT(*) as count 
FROM users
UNION ALL
SELECT 
    'analyses', 
    COUNT(*) 
FROM analyses;
```

### View all users
```sql
SELECT id, email, name, title, created_at 
FROM users;
```

### View all analyses
```sql
SELECT 
    id, 
    user_id, 
    title, 
    created_at,
    jsonb_pretty(config) as config,
    jsonb_pretty(estimates) as estimates
FROM analyses;
```

---

## Troubleshooting

### Connection Refused
- Make sure PostgreSQL is running
- Check if port 5432 is accessible
- Verify Docker container is running (if using Docker)

### Authentication Failed
- Verify username and password
- Check PostgreSQL user permissions

### Database Not Found
- Create database: `CREATE DATABASE cloudguide_db;`
- Or run migration script: `python -m backend.database.migrations.init_db`
