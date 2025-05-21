# Setup instructions (for both frontend and backend).

## backend

install php and composer and then run these command

```bash
composer install
php artisan key:gen
cp .env.example .env
#change configuration of datbase postgress or any other 
php artisan migrate:fresh --seed
php artisan serve 
```

## frontend

```bash
npm i 
npm run dev
```
#screenshot

![image](https://github.com/user-attachments/assets/8d012be8-39ef-4f4d-bc8a-dfac1a00b05f)


![image](https://github.com/user-attachments/assets/41ebd245-8864-4f69-bd4d-80b019ba2840)

![image](https://github.com/user-attachments/assets/f6448391-2ee4-4751-aa2f-0b4628ecb74e)

![image](https://github.com/user-attachments/assets/0b430d27-c631-4bbb-9d26-46aea9056ca9)



