

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

php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"

php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"

php artisan db:seed PermissionSeeder

npm install

npm install framer-motion ziggy-js chart.js react-chartjs-2










Furever Health: Grooming System

How to run: Make sure not to reinstall any packages that are already installed. You can check the installed extensions in the composer.json file.

install these things.
1. composer install
2. cp .env.example .env
3. php artisan key:generate
composer require laravel/fortify
4. php artisan migrate
5. npm install
6. npm install framer-motion
7. composer require spatie/laravel-permission
8. npm install framer-motion ziggy-js
9. php artisan db:seed PermissionSeeder 
10. composer require laravel/sanctum
11. php artisan vendor:publish --provider="Laravel\Sanctum\SanctumServiceProvider"
12. composer require tightenco/ziggy
13. composer require spatie/laravel-permission
14. php artisan vendor:publish --provider="Spatie\Permission\PermissionServiceProvider"
15. npm install chart.js react-chartjs-2 framer-motion
16. npm install chart.js react-chartjs-2




