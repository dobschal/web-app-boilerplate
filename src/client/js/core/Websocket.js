const { io } = require("socket.io-client");
const { on } = require("../../../shared/util/Event.js");
const { isAuthenticated } = require("./Auth.js");
const { Storage } = require("./Storage.js");

let _socket;

module.exports.Websocket = {
    init() {
        _socket = io();
        if (isAuthenticated()) this.authenticate();
        on("Authenticated", () => this.authenticate());
    },

    listen(name, callback) {
        _socket.on(name, callback);
    },

    authenticate() {
        _socket.emit("auth", {
            token: Storage.get("jwt")
        });
    }
};