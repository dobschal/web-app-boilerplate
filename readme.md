# Web App Boilerplate

## Installation

To get this boilerplate code deployd and the workspace in VSCode up and running, some additional steps need to be done.

### ESLint

In Visual Studio code, check that the eslint extension is installed and enabled.
Here at the seetings to have eslint work fine in VSCode:
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

### Server

nginx example for `/etc/nginx/sites-available/default`.
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

## Server

### Routing

All route handlers should be in `src/server/routes`. The file name determines the URL path for the route handler.
E.g. `src/server/routes/login.js` will listen to request coming on `/api/login`. 
Inside the route handler you can specify the HTTP method and subpaths. 

Example:
```javascript
// users.js
module.exports = {
    "POST /address": (req, res) => { // will listen to POST requests coming on "/api/users/address"
        // ...
        res.send({
            message: "Yeah"
        });
    }
};
```

## Includes

 - [ ] MySQL Database Setup
 - [ ] MySQL Database Transaction Rollbacks
 - [ ] MySQL Database Migrations
 - [x] Eslint Setup
 - [x] Websocket Setup with SocketIO
 - [ ] Deployment with PM2
 - [x] Server Side Automatic router
 - [ ] User authentication JWT
 - [ ] User authentication roles
 - [ ] User authentication websocket
 - [ ] Test Setup with Mocks (e.g. Database)
 - [ ] SCSS Support
 - [ ] TypeScript Support
 - [ ] Declarative UI Framework
 - [ ] Declarative UI Framework List
 - [ ] Declarative UI Framework Table
 - [ ] Declarative UI Framework Image
 - [ ] Declarative UI Framework TextEditor
 - [ ] Client Side Router
 - [ ] Server/Client Shared Modules
 - [ ] DateUtil