// https://pm2.io/doc/en/runtime/reference/ecosystem-file/#deploy-options
// https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/
module.exports = {
  apps: [
    {
      name: 'phapp',
      script: 'npm',
      args: 'run start',
      log_date_format: 'HH:mm:ss.SSS YYYY-MM-DD',
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
  deploy: {
    production: {
      key: '~/.ssh/phkey',
      user: process.env.TARGET_SERVER_USER,
      host: process.env.TARGET_SERVER_HOST,
      ssh_options: 'StrictHostKeyChecking=no',
      ref: 'origin/main',
      repo: 'https://github.com/jenshen85/photobook.git',
      path: `/home/${process.env.TARGET_SERVER_USER}/photobook`,
      'post-setup': 'ls -la',
      'post-deploy': [
        process.env.PGPASSWORD
          ? `PGPASSWORD=${process.env.PGPASSWORD} pg_dump --username=${process.env.TARGET_SERVER_USER} --no-owner ${process.env.DB_DATABASE} > ~/dbback/photobook_$(date +%d_%m_%y).bak`
          : false,
        `npm install`,
        // 'touch .env.production',
        // `echo DB_HOST=${process.env.DB_HOST} >> .env.production`,
        // `echo DB_PORT=${process.env.DB_PORT} >> .env.production`,
        // `echo DB_USERNAME=${process.env.TARGET_SERVER_USER} >> .env.production`,
        // `echo DB_PASSWORD=${process.env.PGPASSWORD} >> .env.production`,
        // `echo DB_DATABASE=${process.env.DB_DATABASE} >> .env.production`,
        `npm run build:all`,
        `pm2 startOrRestart ecosystem.config.js --env production`,
      ]
        .filter(Boolean)
        .join(' && '),
    },
  },
};
