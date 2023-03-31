# Web App Boilerplate

👉 This is a boilerplate framework for a web app to be built with NodeJS and MySQL.

[![Tests](https://github.com/dobschal/web-app-boilerplate/actions/workflows/unit-test.yml/badge.svg)](https://github.com/dobschal/web-app-boilerplate/actions/workflows/unit-test.yml)

## Content 
1. [Installation](#installation)
2. [Deployment](#deployment)
3. [Development](#development)
4. [Features](#features)

## Installation 🎁<a name="installation"></a>

To get this boilerplate code deployd and the workspace (e.g. in VSCode) up and running, some additional steps need to be done.
* Have NodeJS version 10+ and MySQL 8+ or Docker installed
* Add all needed information to the `.env` file.

### Start the app
Run in terminal:
```bash
# install dependencies
npm install

# This builds the frontend, starts the server and watches for changes to restart and rebuild
npm start
```

### Run Database with Docker

The `.env` file contains the credentials to connect to your MySQL database. The project contains a docker compose file
to start a MySQL database easily via Docker.

The name of the database inside the `docker-compose.yml` and `.env` file need to match.
Then just start the database via terminal with:
```bash
docker-compose up -d
```

All database migrations take place in the `src/db-migrations` folder.


### Configure ESLint

#### VSCode
In Visual Studio code, check that the eslint extension is installed and enabled.
Here are the settings to have eslint work fine in VSCode:
```json
{
    "eslint.format.enable": true,
    "editor.formatOnSave": true,
    "editor.codeActionsOnSave": {
        "source.fixAll.eslint": true
    },
    "eslint.validate": [
        "javascript"
    ]
}
```
#### IntelliJ
In IntelliJ just right click the `.eslintrc.yml` file and choose `Apply eslint code style rules`.
IntelliJ has the option to apply eslint fixes on save too. Check the preferences therefore.

## Deployment  🚀<a name="deployment"></a>

To deploy this application, follow these steps:
* SSH into server
* Generate SSH key pair
* Add public key to GitHub repository for access
* Install and run MySQL with user/password security
* Add one database to MySQL
* Install NodeJS version 10 or higher
* Check git repository on server
* Run `npm install` and `npm run build`
* Adjust the `.env` to contain the correct credentials to the database and email provider
* Install PM2 via NPM: `npm install -g pm2`
* Start with PM2 `pm2 start src/server/index.js --name=your_app_name`
* Get a domain or subdomain
* Configure Nginx and run `systemctl restart nginx`
* Open Domain in your browser. Should work :)

### Nginx Configuration

Example for `/etc/nginx/sites-available/default`:
```
server {
	listen 80;
    server_name chat.dobschal.eu;
	return 301 https://$server_name/$request_uri;
}

server {
    listen 443 ssl;

    access_log  /var/log/nginx/chat.log;

    client_max_body_size 50M;
 
    server_name chat.dobschal.eu;
 
    ssl_certificate    /certificates/dobschal_eu.cer;
    ssl_certificate_key /certificates/dobschal_eu.key;
 
    location / { 
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Development 🤓<a name="development"></a>

The applications source code under `src/` is split into 3 parts:
* server
* client
* shared

To start the application for development and watch/auto-restart on file changes, just run:
```bash
npm start
```

### Server

#### Database Transaction

Transaction allow automatically rollbacks of throw for save database handling.

Example:
```javascript
await transaction(async (query) => {
    await query("INSERT INTO user SET ?", {
        email: "test4"
    });
    throw new Error("Something"); // will rollback the query above
});
```

#### Routing 

All route handlers should be in `src/server/routes`. The file name determines the URL path for the route handler.
E.g. `src/server/routes/login.js` will listen to request coming on `/api/login`. 
Inside the route handler you can specify the HTTP method and subpaths. 

Example:
```javascript
// users.js
module.exports = {
    "POST /address": async (req, res) => { // will listen to POST requests coming on "/api/users/address"
        // ...
        res.send({
            message: "Yeah"
        });
    }
};
```

## Features 😎<a name="features"></a>

 - [x] MySQL Database Setup
 - [x] MySQL Database Transaction Rollbacks
 - [x] MySQL Database Migrations
 - [x] Eslint Setup
 - [x] Websocket Setup with SocketIO
 - [x] Server side autoload route handlers
 - [x] .env support
 - [x] Version API route
 - [x] Email send Service
 - [x] User OTP Login
 - [x] User OTP verfication
 - [x] User authentication JWT
 - [x] User authentication roles
 - [x] Test Setup with Mocks (e.g. Database)
 - [x] Error Handling
 - [x] Authorised Routes
 - [x] User authentication websocket
 - [x] Database via Docker Compose
 - [x] Is Email validator
 - [ ] User role util 
 - [ ] K6 stress tests
 - [ ] Path variables in URL
 - [ ] Localisation
 - [ ] Request Limiter
 - [x] Deployment with PM2
 - [ ] PM2 Load Balancing
 - [ ] PM2 Load Balancing with Websockets
 - [ ] Better Unit Tests Coverage
 - [ ] HTML Emails
 

 - [x] Server/Client Shared Modules
 - [ ] DateUtil
 - [ ] esdocs types

 - [ ] Frontend Unit Tests
 - [ ] Have onAdd to dom event
 - [x] Declarative UI Framework 
 - [x] Declarative UI Framework List
 - [ ] Declarative UI Framework File Input
 - [ ] Declarative UI Framework Select/Options
 - [ ] Declarative UI Framework Table
 - [ ] Declarative UI Framework Image
 - [ ] Declarative UI Framework TextEditor
 - [ ] Dialog
 - [x] Toast
 - [x] Client Side Router
 - [x] Client Side Router Params
 - [x] Client Side Router BeforeEach Guard
 - [x] Login UI
 - [x] Event Bus
 - [x] Button with Loading State
 - [x] Example Chat App
 - [ ] Chat App Websocket
 - [x] Page transition animation
 - [ ] Custom Font
 - [ ] Better Unit Tests Coverage

 - [ ] iOS Container App
 - [ ] Android Container App
 - [ ] Push Notifications


### NOT sure if wanted:
 - [ ] SCSS Support
 - [ ] TypeScript Support  --> brings problems with files etc.
 - [ ] Run Test, Build, Run on Watch Files --> performance issues
 - [ ] Cache --> how to evict nicely?
