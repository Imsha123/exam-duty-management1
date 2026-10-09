#!/bin/bash
# ==============================================================================
# Hostinger VPS Initial Server Setup Script
# Target OS: Ubuntu 20.04 / 22.04 / 24.04 LTS
# Installs: Node.js 20, PM2, Nginx, Microsoft SQL Server 2022, Certbot
# ==============================================================================

set -e

echo "============================================================"
echo " Starting Hostinger VPS Setup for Exam Duty Management System"
echo "============================================================"

# Ensure script is run as root
if [ "$EUID" -ne 0 ]; then
  echo "[-] Please run this script as root (use sudo or root user)."
  exit 1
fi

# 1. Update Ubuntu packages
echo "[1/7] Updating system packages..."
apt-get update -y && apt-get upgrade -y
apt-get install -y curl wget gnupg2 software-properties-common apt-transport-https ca-certificates git ufw unzip

# 2. Install Node.js 20 LTS & PM2
echo "[2/7] Installing Node.js 20 LTS and PM2..."
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs
npm install -g npm@latest pm2
echo "Node version: $(node -v)"
echo "NPM version: $(npm -v)"
echo "PM2 version: $(pm2 -v)"

# 3. Install Nginx
echo "[3/7] Installing Nginx..."
apt-get install -y nginx
systemctl enable nginx
systemctl start nginx

# 4. Install Microsoft SQL Server 2022 on Ubuntu
echo "[4/7] Installing Microsoft SQL Server 2022..."
# Import Microsoft public GPG key
wget -qO- https://packages.microsoft.com/keys/microsoft.asc | gpg --dearmor -o /etc/apt/trusted.gpg.d/microsoft.gpg

# Detect Ubuntu version codename (focal / jammy / noble)
UBUNTU_CODENAME=$(lsb_release -cs)
if [ "$UBUNTU_CODENAME" = "noble" ]; then
  # Noble (24.04) fallback to jammy repo if noble repo not yet published for mssql-server
  REPO_CODENAME="jammy"
else
  REPO_CODENAME="$UBUNTU_CODENAME"
fi

# Add MS SQL Server repo
curl -fsSL "https://packages.microsoft.com/config/ubuntu/22.04/mssql-server-2022.list" -o /etc/apt/sources.list.d/mssql-server-2022.list
# Add MS SQL Tools repo
curl -fsSL "https://packages.microsoft.com/config/ubuntu/22.04/prod.list" -o /etc/apt/sources.list.d/msprod.list

apt-get update -y
apt-get install -y mssql-server

echo "============================================================"
echo " Configuring Microsoft SQL Server..."
echo " You will now be prompted to choose an edition (Express: 2) "
echo " and set your 'SA' master password."
echo "============================================================"
/opt/mssql/bin/mssql-conf setup

# Install sqlcmd and unixODBC
ACCEPT_EULA=Y apt-get install -y mssql-tools18 unixodbc-dev
echo 'export PATH="$PATH:/opt/mssql-tools18/bin"' >> ~/.bashrc
export PATH="$PATH:/opt/mssql-tools18/bin"

systemctl enable mssql-server
systemctl status mssql-server --no-pager

# 5. Create Web Root Directory
echo "[5/7] Preparing application directories..."
mkdir -p /var/www/exam-duty/backend
mkdir -p /var/www/exam-duty/frontend
mkdir -p /var/www/exam-duty/backend/uploads/attendance
chown -R www-data:www-data /var/www/exam-duty
chmod -R 755 /var/www/exam-duty

# 6. Install Certbot (Let's Encrypt SSL)
echo "[6/7] Installing Certbot for HTTPS..."
apt-get install -y certbot python3-certbot-nginx

# 7. Configure Firewall (UFW)
echo "[7/7] Configuring UFW Firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
# Keep MSSQL 1433 local-only (safer); if remote access is needed: ufw allow 1433/tcp
ufw --force enable

echo "============================================================"
echo "✔ VPS Setup Finished Successfully!"
echo "Next steps:"
echo "1. Run database initialization script with sqlcmd:"
echo "   /opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -C -i /var/www/exam-duty/04_all_in_one_run_me.sql"
echo "2. Deploy backend & frontend using deploy.sh"
echo "============================================================"
