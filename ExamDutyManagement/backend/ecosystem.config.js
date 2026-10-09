module.exports = {
  apps: [
    {
      name: 'exam-duty-backend',
      script: 'dist/main.js',
      cwd: __dirname,
      instances: 1, // You can change to 'max' for cluster mode if multiple CPU cores
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '500M',
      env: {
        NODE_ENV: 'production',
        PORT: 5000,
      },
      error_file: './logs/pm2-err.log',
      out_file: './logs/pm2-out.log',
      log_file: './logs/pm2-combined.log',
      time: true,
    },
  ],
};
