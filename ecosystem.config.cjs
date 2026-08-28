module.exports = {
  apps: [
    {
      name: 'benin-cadeau',
      script: 'npm',
      args: 'start',
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      autorestart: true,
      watch: false,
      max_memory_restart: '450M',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
    },
  ],
};
