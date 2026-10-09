# 🚀 Complete Hostinger VPS Deployment Guide
### Exam Duty Management System (NestJS + React/Vite + Microsoft SQL Server)

This guide provides step-by-step instructions for deploying your **Exam Duty Management System** on a **Hostinger VPS (Ubuntu 22.04 LTS)** with:
- **Microsoft SQL Server 2022** running on Linux
- **Node.js 20 & PM2** managing the NestJS backend
- **Nginx** acting as high-performance web server & reverse proxy
- **Free Let's Encrypt SSL (HTTPS)** via Certbot

---

## 🏗️ Architecture Overview

```text
[ Client Browser ]
        │ (HTTPS : 443 / HTTP : 80)
        ▼
   [ Nginx Web Server on Hostinger VPS ]
   ├── / (root)    ──► Serves compiled React Vite frontend (/var/www/exam-duty/frontend/dist)
   └── /api        ──► Reverse proxies to NestJS Backend (http://127.0.0.1:5000)
                              │
                              ▼
               [ Microsoft SQL Server 2022 (mssql-server) ]
                              │
                    Port 1433 (ExamDutyDB2)
```

---

## 📋 Prerequisites
1. **Hostinger VPS** running **Ubuntu 22.04 LTS** (or 20.04/24.04).
2. Your VPS **Public IP address** and `root` login credentials (from Hostinger hPanel -> VPS -> SSH Access).
3. *(Optional but recommended)* Your domain name pointing to the VPS IP via DNS:
   - `A Record`: `@` points to `<YOUR_VPS_IP>`
   - `A Record`: `www` points to `<YOUR_VPS_IP>`

---

## Step 1: Prepare & Upload Code to VPS

### Option A: Using the Zip Creator (Easiest)
1. On your Windows machine, run `CREATE_ZIP.bat` located in the root project folder.
2. It generates `Exam_Duty_Management_System.zip` on your Desktop (approx ~2-5 MB, without `node_modules`).
3. Open PowerShell or Command Prompt on Windows and copy it to your VPS using `scp`:
   ```bash
   scp "C:\Users\CHANDANA\Desktop\Exam_Duty_Management_System.zip" root@<YOUR_VPS_IP>:/tmp/
   ```
   *(Or drag-and-drop using FileZilla / WinSCP connected via SFTP).*

### Option B: Using Git
If your repository is on GitHub or GitLab:
1. Log into your VPS via SSH (see Step 2).
2. Clone the repo directly:
   ```bash
   git clone <YOUR_GIT_REPO_URL> /var/www/exam-duty
   ```

---

## Step 2: Connect to Hostinger VPS via SSH

Open PowerShell, Terminal, or PuTTY:
```bash
ssh root@<YOUR_VPS_IP>
```
Enter your VPS root password when prompted.

---

## Step 3: Extract Code to Web Directory

If you uploaded the ZIP in Step 1:
```bash
# Ensure unzip is installed
apt update && apt install -y unzip

# Create web root
mkdir -p /var/www/exam-duty

# Extract into /var/www/exam-duty
unzip -o /tmp/Exam_Duty_Management_System.zip -d /tmp/exam_extracted
cp -r /tmp/exam_extracted/ExamDutyManagement/* /var/www/exam-duty/
rm -rf /tmp/exam_extracted /tmp/Exam_Duty_Management_System.zip

# Verify contents
ls -la /var/www/exam-duty
```

---

## Step 4: Run the Automated VPS Setup Script

We have provided `deploy/setup-vps.sh` which automatically installs Node.js 20, PM2, Nginx, Certbot, and Microsoft SQL Server 2022:

```bash
chmod +x /var/www/exam-duty/deploy/setup-vps.sh
/var/www/exam-duty/deploy/setup-vps.sh
```

### When Prompted for Microsoft SQL Server Configuration:
1. **Choose an edition**: Type `2` (Express edition - free).
2. **Accept EULA**: Type `Yes`.
3. **Set the SQL Server administrator (SA) password**:
   - Enter a strong password (e.g., `ExamDuty@2026!Db`).
   - *Keep note of this password! You will need it in Step 5 and Step 6.*

---

## Step 5: Initialize the MSSQL Database

Run the all-in-one database initialization script to create `ExamDutyDB2`, tables, and initial master records:

```bash
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P 'YourStrong@Password123!' -C -i /var/www/exam-duty/database_queries/04_all_in_one_run_me.sql
```

*(Replace `'YourStrong@Password123!'` with the `SA` password you set in Step 4).*

You will see:
```text
>>> Database [ExamDutyDB2] created.
>>> Table [employees] created.
>>> Master data insertion completed successfully.
```

---

## Step 6: Configure Environment Variables

### 1. Backend `.env`
Create or edit `/var/www/exam-duty/backend/.env`:
```bash
nano /var/www/exam-duty/backend/.env
```
Paste and update:
```env
NODE_ENV=production
PORT=5000

# Microsoft SQL Server settings
DB_HOST=127.0.0.1
DB_PORT=1433
DB_NAME=ExamDutyDB2
DB_USER=sa
DB_PASSWORD=YourStrong@Password123!
DB_ENCRYPT=false
DB_TRUST_SERVER_CERTIFICATE=true
DB_SYNCHRONIZE=false

# Allowed Origins (Replace with your actual domain name or VPS IP)
CORS_ORIGINS=https://yourdomain.com,http://<YOUR_VPS_IP>
```
Press `Ctrl + O`, `Enter` to save, and `Ctrl + X` to exit.

### 2. Frontend `.env`
Create or edit `/var/www/exam-duty/frontend/.env`:
```bash
nano /var/www/exam-duty/frontend/.env
```
Paste:
```env
# Relative API URL - Nginx automatically proxies /api to backend port 5000
VITE_API_URL=/api
```
Save and exit (`Ctrl + O`, `Enter`, `Ctrl + X`).

---

## Step 7: Deploy the Application

Run the automated deployment script:
```bash
chmod +x /var/www/exam-duty/deploy/deploy.sh
/var/www/exam-duty/deploy/deploy.sh
```

This script automatically:
1. Installs backend dependencies and compiles TypeScript to `dist/`.
2. Starts the backend service with **PM2** (`exam-duty-backend`).
3. Installs frontend dependencies and builds the optimized production React bundle to `dist/`.
4. Copies and activates the Nginx configuration.
5. Reloads Nginx.

---

## Step 8: Configure Domain & Enable HTTPS (SSL)

### 1. Update Nginx Domain Name
Edit the Nginx configuration:
```bash
nano /etc/nginx/sites-available/exam-duty
```
Change line 3:
```nginx
server_name yourdomain.com www.yourdomain.com;
```
to your actual domain name (or your VPS IP if not using a custom domain).

Test and reload Nginx:
```bash
nginx -t
systemctl reload nginx
```

### 2. Issue Free SSL Certificate (Let's Encrypt)
Run Certbot:
```bash
certbot --nginx -d yourdomain.com -d www.yourdomain.com
```
Follow the interactive prompts:
- Enter your email address.
- Agree to the Terms of Service.
- Certbot will automatically install the SSL certificates and configure HTTPS redirects!

---

## 🛠️ Helpful Management Commands

### Backend PM2 Management
| Command | Description |
|---|---|
| `pm2 status` | Check status of backend process |
| `pm2 logs exam-duty-backend` | View live backend logs |
| `pm2 restart exam-duty-backend` | Restart backend service |
| `pm2 stop exam-duty-backend` | Stop backend service |

### Nginx Management
| Command | Description |
|---|---|
| `nginx -t` | Test Nginx configuration for errors |
| `systemctl reload nginx` | Reload Nginx configuration without downtime |
| `systemctl restart nginx` | Restart Nginx service |
| `cat /var/log/nginx/error.log` | View Nginx error logs |

### Microsoft SQL Server Management
| Command | Description |
|---|---|
| `systemctl status mssql-server` | Check MSSQL status |
| `systemctl restart mssql-server` | Restart MSSQL server |
| `/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C` | Open interactive SQL terminal |

---

## 🔄 How to Deploy Future Updates

Whenever you make changes to your code in the future:
1. Upload the updated files (or git pull).
2. Simply run:
   ```bash
   /var/www/exam-duty/deploy/deploy.sh
   ```
Your VPS will automatically build both backend and frontend and restart PM2 without downtime!
