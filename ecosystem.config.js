// https://pm2.io/doc/en/runtime/reference/ecosystem-file/#deploy-options
// https://pm2.io/doc/en/runtime/guide/easy-deploy-with-ssh/
module.exports = {
  apps: [
    {
      name: 'phapp',
      script: 'npm',
      args: 'run start',
      log_date_format: 'HH:mm:ss.SSS YYYY-MM-DD',
    },
  ],
  deploy: {
    production: {
      key: '~/.ssh/phkey.pub',
      user: 'jenshen',
      // user: `${process.env.TARGET_SERVER_USER}`,
      // host: `${process.env.TARGET_SERVER_HOST}`,
      host: '37.77.104.228',
      // port: '228',
      ssh_options: 'StrictHostKeyChecking=no',
      ref: 'origin/main',
      repo: 'git@github.com:jenshen85/photobook.git',
      path: `/home/jenshen/photobook`,
      'post-deploy': [
        process.env.PGPASSWORD
          ? `PGPASSWORD=${process.env.PGPASSWORD} pg_dump --username=${process.env.TARGET_SERVER_USER} --no-owner photobook > ~/memory_$(date +%d_%m_%y).bak`
          : false,
        // `cd back-end`,
        `npm install`,
        `npm run build:all`,
        // `app_test__db_section__user=vultrlex npm run test`, // memory leak in jest Out of memory: Kill process ... (node) score ... or sacrifice child
        // process.env.TARGET_SERVER_PASSWORD
        //   ? `echo ${process.env.TARGET_SERVER_PASSWORD} | sudo -S setcap 'cap_net_bind_service=+ep' /usr/bin/node`
        //   : false,
        // `cd ..`,
        `pm2 startOrRestart ecosystem.config.js --env production`,
      ]
        .filter(Boolean)
        .join(' && '),
    },
  },
};
