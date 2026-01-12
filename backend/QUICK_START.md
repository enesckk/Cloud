# Quick Start - View Database Tables

## Step 1: Start PostgreSQL

### Option A: Using Docker (Recommended)
```bash
cd backend
docker-compose up -d postgres
```

### Option B: Local PostgreSQL
Make sure PostgreSQL is running on your system.

---

## Step 2: Install VS Code Extension

1. Open VS Code
2. Press `Ctrl+Shift+X`
3. Search: **"PostgreSQL"** by Chris Kolkman
4. Click **Install**

---

## Step 3: Connect to Database

1. Press `Ctrl+Shift+P`
2. Type: **"PostgreSQL: Add Connection"**
3. Enter:
   - **Host:** `localhost`
   - **Port:** `5432`
   - **Database:** `cloudguide_db`
   - **Username:** `cloudguide_user`
   - **Password:** `cloudguide_pass`

---

## Step 4: View Tables

1. Look for **PostgreSQL** icon in left sidebar
2. Expand **"CloudGuide Database"**
3. Expand **"public"** schema
4. See tables: **users** and **analyses**

---

## Step 5: View Table Data

1. Right-click on **users** table
2. Select **"Show Table"** or **"Query Table"**
3. See all records!

---

## Alternative: SQL Query

Press `Ctrl+Shift+P` → **"PostgreSQL: New Query"**

Then run:
```sql
-- List all tables
\dt

-- View users
SELECT * FROM users;

-- View analyses
SELECT * FROM analyses;
```

---

## That's it! 🎉

You can now:
- ✅ View table structures
- ✅ Browse data
- ✅ Run SQL queries
- ✅ Edit data (if needed)
