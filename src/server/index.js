require("dotenv").config();
const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const fs = require("fs");
const { Server } = require("socket.io");
const { runMigrations } = require("./core/database.js");

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
            const [httpMethod, path] = key.split(" ");
            const pathPrefix = file === "index.js" ? "/api" : "/api/" + file.slice(0, -3);
            console.log("[server/index] \t➕ Add route " + httpMethod + " " + pathPrefix + (path || ""));
            app[httpMethod.toLowerCase()](pathPrefix + (path || ""), async (req, res) => {
                try {
                    const t1 = Date.now();
                    await routeHandlers[key](req, res);
                    console.log("[server/index] \t👉 " + httpMethod + " " + pathPrefix + (path || "") + " \t" + (Date.now() - t1) + "ms.");
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

    io.on("connection", (socket) => {
        console.log("[server/index] \t🔗 User connected via Websocket.");
        socket.on("chat message", (msg) => {
            console.log("message: " + msg);
            socket.emit("chat message", "Huhu");
        });
    });

    server.listen(process.env.PORT, () => {
        console.log("\n[server/index] \t🚀 Server started on port " + process.env.PORT);
    });
}

module.exports = { io };