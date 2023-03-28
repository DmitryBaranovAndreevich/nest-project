require('dotenv').config({ path: '.env' });

const {
  DEPLOY_USER,
  DEPLOY_HOST,
  DEPLOY_PATH,
  DEPLOY_REPO,
  DEPLOY_REF = 'origin/master',
} = process.env;

module.exports = {
  deploy: {
    production: {
      user: DEPLOY_USER,
      host: DEPLOY_HOST,
      ref: DEPLOY_REF,
      repo: DEPLOY_REPO,
      path: DEPLOY_PATH,
      'pre-deploy-local': `scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH} && scp .env ${DEPLOY_USER}@${DEPLOY_HOST}:${DEPLOY_PATH}/current`,
      'post-deploy':
        'docker compose up --build && certbot certonly --webroot --webroot-path=/var/www/html --email final-task@mail.com --agree-tos --no-eff-email --staging -d api.mesto.baranov.nomoredomains.work -d api.mesto.baranov.nomoredomains.work',
    },
  },
};

// && certbot certonly --webroot --webroot-path=/var/www/html --email final-task@mail.com --agree-tos --no-eff-email --staging -d api.mesto.baranov.nomoredomains.work -d api.mesto.baranov.nomoredomains.work