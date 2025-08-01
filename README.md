# Abalo

## Description
This is a simple Laravel project made for the module `Datenbanken und Webtechnologien 2` in SS 2024. The project uses Laravel as the backend and Vue.js as the frontend.
It partially implements a webshop where users can view products, add them to their cart and rate them.

# Screenshot
![Screenshot of the Homepage](/documentation/screenshots/Homepage.png)

## Authors
#### Simon Conrad
  - Student number: 3597903
  - Email: [simon.conrad@alumni.fh-aachen.de](mailto:simon.conrad@alumni.fh-aachen.de)
  - GitLab: https://git.fh-aachen.de/sc1103s
  - GitHub: https://github.com/IsAvaible
#### Dennis Wolff
  - Student number: 3510869
  - Email: [dennis.costa@alumni.fh-aachen.de](mailto:dennis.costa@alumni.fh-aachen.de)
  - GitLab: https://git.fh-aachen.de/dc9239s

## Features
### Core Features:

* **Product Display**: Intuitive grid layout with images, titles, descriptions, and prices. 
* **Filtering & Sorting**: Filter by condition, category, price, shipping, or country. Sort by price ascending or descending.
* **Shopping Cart:** Real-time cart with item details, remove option, and quick checkout.
* **Seller Profiles:** Sellers can manage their products and orders and view sales reports,

### Technical Features:

* **Built with:** Laravel, Vue.js, MariaDB, Tailwind CSS
* **Networking:** RESTful API, Axios, Laravel Websockets
* **Concepts:** MVC, ORM, Middleware, Seeders, Database Migrations

## Installation
1. Clone the [repository](https://git.fh-aachen.de/sc1103s/abalo)
2. Install the required packages using the following commands:
    ```bash
    php composer install
    npm install
    ```
3. Setup the database
    - Install PostgreSQL
    - Connect to PostgreSQL as a superuser (e.g. postgres)
    - Create the application role and database:
        ```postgresql
        CREATE ROLE dev WITH LOGIN PASSWORD 'dev';
        CREATE DATABASE abalo OWNER dev;
        GRANT ALL PRIVILEGES ON DATABASE abalo TO dev;
        ALTER ROLE dev CREATEDB;
        ```
    - Run Laravel migrations and seed the database:
        ```shell
        php artisan migrate:fresh
        php artisan db:seed
        ```
4. Enable the PostgreSQL PHP Driver
5. Create a copy of .env.example and rename it to .env. Adjust any values that do not match your configuration
6. Run the following four commands in parallel to serve the frontend and backend:
    ```bash
    npm run dev &
    php artisan serve &
    php artisan queue:work &
    php artisan reverb:start --debug
    ```
   
The site should now be accessible under http://localhost:8000/newsite

## Documentation
The documentation can be found in the `dossier` directory. It contains the following files:
- [BRANCHING.md](dossier/BRANCHING.md): Contains the branching strategy used in the project
- [M1.md](dossier/M1.md): Contains the documentation for the first milestone
- [M2.md](dossier/M2.md): Contains the documentation for the second milestone
- [M3.md](dossier/M3.md): Contains the documentation for the third milestone
- [M4.md](dossier/M4.md): Contains the documentation for the fourth milestone
- [M5.md](dossier/M5.md): Contains the documentation for the fifth milestone
