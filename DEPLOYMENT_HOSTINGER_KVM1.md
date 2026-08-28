# Déploiement Benin Cadeau sur Hostinger KVM 1

## Pré-requis

Préparer un VPS Hostinger KVM 1 sous Ubuntu 24.04, un domaine pointé vers l’adresse IPv4 du VPS et un accès SSH administrateur. La branche à déployer est `prod`.

## 1. Préparer le VPS

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git nginx mysql-server ufw curl build-essential
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.3/install.sh | bash
source ~/.bashrc
nvm install 22
nvm alias default 22
node --version
npm --version
sudo npm install --global pm2
```

## 2. Créer la base MySQL

```bash
sudo mysql
```

```sql
CREATE DATABASE `benin_cadeau` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'benin_cadeau_app'@'localhost' IDENTIFIED BY 'REMPLACER_PAR_UN_MOT_DE_PASSE_FORT';
GRANT ALL PRIVILEGES ON `benin_cadeau`.* TO 'benin_cadeau_app'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## 3. Déployer le code

```bash
sudo mkdir -p /var/www/benin-cadeau
sudo chown -R "$USER":"$USER" /var/www/benin-cadeau
git clone --branch prod --single-branch https://github.com/sicmaDev/BeninCadeau.git /var/www/benin-cadeau
cd /var/www/benin-cadeau
cp .env.example .env
nano .env
npm ci
npx prisma generate
```

Le dépôt ne contient pas encore de dossier `prisma/migrations`. Pour la première initialisation de cette base vide uniquement, appliquer le schéma avec :

```bash
npx prisma db push
```

Sur les déploiements ultérieurs, il faudra remplacer cette pratique par un historique de migrations versionnées et utiliser `npx prisma migrate deploy`.

## 4. Variables de production

Compléter `.env` avec les vraies valeurs, sans les committer : `DATABASE_URL`, `JWT_SECRET`, `FEDAPAY_SECRET_KEY`, `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`, `ADMIN_EMAIL`, `NEXT_PUBLIC_SITE_URL` et `PORT=3000`.

Générer un secret JWT robuste avec :

```bash
openssl rand -base64 48
```

## 5. Construire et lancer avec PM2

```bash
npm run build
pm2 start ecosystem.config.cjs
pm2 save
pm2 startup
```

La commande `pm2 startup` affiche une commande supplémentaire : l’exécuter avec `sudo`, puis relancer `pm2 save`. Vérifier ensuite :

```bash
pm2 status
pm2 logs benin-cadeau --lines 100
curl -I http://127.0.0.1:3000
```

## 6. Configurer Nginx

Créer `/etc/nginx/sites-available/benincadeau` :

```nginx
server {
    listen 80;
    listen [::]:80;
    server_name votre-domaine.tld www.votre-domaine.tld;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

Activer le site et le pare-feu :

```bash
sudo ln -s /etc/nginx/sites-available/benincadeau /etc/nginx/sites-enabled/benincadeau
sudo nginx -t
sudo systemctl reload nginx
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'
sudo ufw --force enable
```

## 7. Activer HTTPS

Après propagation du DNS :

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d votre-domaine.tld -d www.votre-domaine.tld
sudo certbot renew --dry-run
```

## 8. Tests de production

Tester la page d’accueil, le catalogue, une fiche produit, l’inscription, la connexion, la création de commande, la validation de code promo, le suivi, la réception e-mail et l’espace admin. Configurer ensuite dans FedaPay l’URL HTTPS publique : `https://votre-domaine.tld/api/webhooks/fedapay`.

## 9. Mise à jour ultérieure

```bash
cd /var/www/benin-cadeau
git fetch origin
git checkout prod
git pull --ff-only origin prod
npm ci
npx prisma generate
npx prisma migrate deploy
npm run build
pm2 restart benin-cadeau --update-env
```

Ne jamais utiliser `git pull` ou `npm ci` avec un fichier `.env` versionné. Conserver une sauvegarde de la base avant chaque migration.

## Références Hostinger

- https://www.hostinger.com/support/9553137-how-to-set-up-a-node-js-application-using-hostinger-cloudpanel/
- https://www.hostinger.com/support/1583227-how-to-point-a-domain-to-your-vps-at-hostinger/
- https://www.hostinger.com/tutorials/deploy-node-js-application
