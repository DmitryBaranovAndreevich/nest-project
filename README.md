# Докеризация приложения
для выпуска сертификатов на ваш домен:
sudo docker compose run --rm  certbot certonly --webroot --webroot-path /var/www/certbot/ -d {ваш домен}
