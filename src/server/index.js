const t1 = Date.now();
require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { Server } = require("socket.io");
const { runMigrations } = require("./core/database.js");
const { init } = require("./core/websocket.js");
const { verify } = require("jsonwebtoken");
const { UserService } = require("./service/UserService.js");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

setup();

async function setup() {

    await runMigrations();

    app.use(express.static(path.join(__dirname, "../../build/public")));
    app.use(express.static(path.join(__dirname, "../../public")));
    app.use(cors());
    app.use(express.json());

    // This is loading all route handlers automatically in
    // Just provide a module under `routes/` with e.g. { "POST /hello": (req, res) => res.send("hello") }
    // The name of the file is the path prefix. E.g. `routes/login.js` would end up in "/api/login/"
    const routesDirectory = path.join(__dirname, "routes");
    fs.readdirSync(routesDirectory).forEach((file) => {
        const routeHandlers = require(path.join(routesDirectory, file));
        Object.keys(routeHandlers).forEach(key => {
            let [httpMethod, path] = key.split(" ");
            if (path.endsWith("/")) path = path.slice(0, -1);
            const pathPrefix = file === "index.js" ? "/api" : "/api/" + file.slice(0, -3);
            console.log("[server/index] \t➕ Add route " + httpMethod + " " + pathPrefix + (path || ""));
            app[httpMethod.toLowerCase()](pathPrefix + (path || ""), async (req, res) => {
                try {
                    const t1 = Date.now();
                    const authHeader = req.headers["authorisation"] || req.headers["authorization"] || req.headers["auth"];
                    if (authHeader) {
                        try {
                            const [_, token] = authHeader.split(" ");
                            const { email } = verify(token, process.env.JWT_SECRET);
                            req.user = await UserService.getUserByEmail(email);
                        } catch (e) {
                            console.error("[server/index] \t❌ Got invalid JWT.");
                        }
                    }
                    await routeHandlers[key](req, res);
                    console.log("[server/index] \t👉 " + httpMethod + " " + pathPrefix + (path || "") + " \t\t" + (Date.now() - t1) + "ms.");
                } catch (e) {
                    const statusCode = e.message.substring(0, 3);
                    if (isNaN(statusCode)) { // non expected error...
                        console.error("[server/index] \t❌ Error: ", e);
                    }
                    res.status(isNaN(statusCode) ? 500 : Number(statusCode)).send({
                        error: e.message
                    });
                }
            });
        });
    });

    // By default always return the index.html file. The client side should show
    // some 404 like error message, if the URL is wrong.
    app.get("*", (_, res) => {
        res.sendFile(path.join(__dirname, "../../build/public/index.html"));
    });

    init(io);

    server.listen(process.env.PORT, () => {
        console.log("\n[server/index] \t🚀 Server started in " + ((Date.now() - t1) / 1000).toFixed(2) + "sec on port " + process.env.PORT + ".");
    });
}

module.exports = { io };