

Furever Health: Grooming System
How to Run

Make sure not to reinstall any packages that are already installed.
You can check existing dependencies in the composer.json file before proceeding.

Setup Instructions

composer install

cp .env.example .env

php artisan key:generate

composer require laravel/fortify

composer require spatie/laravel-permission

composer require laravel/sanctum

composer require tightenco/ziggy

php artisan migrate

php artisan db:seed PermissionSeeder

npm install

php artisan migrate:fresh --seed

npm install framer-motion ziggy-js chart.js react-chartjs-2










Furever Health: Grooming System

How to run: Make sure not to reinstall any packages that are already installed. You can check the installed extensions in the composer.json file.

install these things.
1. composer install
2. cp .env.example .env
3. php artisan key:generate
4. composer require laravel/fortify
5. php artisan migrate
6. npm install
7. npm install framer-motion
8. composer require spatie/laravel-permission
9. npm install framer-motion ziggy-js
10. php artisan db:seed PermissionSeeder 
11. composer require laravel/sanctum
12. php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
13. composer require tightenco/ziggy
14. php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
15. npm install chart.js react-chartjs-2 framer-motion
16. npm install chart.js react-chartjs-2




