# Setup instructions (for both frontend and backend).

## backend

install php and composer and then run these command

composer install
php artisan key:gen
cp .env.example .env
#change configuration of datbase postgress or any other 
php artisan migrate:fresh --seed
php artisan serve 

## frontend

npm i 
npm run dev