# Deploy on Hostinger Business (Node.js web apps + MySQL)

Two Node.js web apps + one MySQL database, all inside the Business plan.

| Part     | Where                | Subdomain              |
|----------|----------------------|------------------------|
| Database | hPanel -> Databases  | -                      |
| Backend  | Node.js web app      | api.yourdomain.com     |
| Frontend | Node.js web app / static | exam.yourdomain.com |

## 1. Database
1. hPanel -> Databases -> Management -> create a MySQL database + user. Note name, user, password.
2. Open phpMyAdmin for it -> Import -> `database_queries/mysql/mysql_schema.sql`.

## 2. Backend (api.yourdomain.com)
- Source: GitHub repo, branch main
- Root directory: `ExamDutyManagement/backend`
- Build command: `npm install && npm run build`
- Start command: `npm run start:prod`
- Environment variables: copy from `backend/.env.production.example` and fill in real values.
  `CORS_ORIGINS` must be your frontend URL exactly.
- Test: open https://api.yourdomain.com/api/health  -> {"status":"ok", ... "database":"connected"}

## 3. Frontend (exam.yourdomain.com)
- Root directory: `ExamDutyManagement/frontend`
- Build command: `npm install && npm run build`
- Output directory: `dist`
- Environment variable (needed at BUILD time): `VITE_API_URL=https://api.yourdomain.com/api`

## 4. Login
Resource ID `17655`, mobile `9876543210` (created automatically by the backend on first start).
Change/remove this default account after your first login.

## Notes
- Attendance uploads are stored in `backend/uploads`. Hostinger may wipe this folder on redeploy,
  so uploaded files can be lost on updates.
- `ecosystem.config.js`, `deploy/` and `HOSTINGER_VPS_DEPLOYMENT_GUIDE.md` are for the old VPS/MSSQL
  setup and are not used here.
