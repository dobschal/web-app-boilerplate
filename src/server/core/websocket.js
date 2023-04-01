const jwt = require("jsonwebtoken");

let io;
let userConnections = {};

function init(_io) {
    io = _io;
    io.on("connection", (socket) => {
        let connectedUserEmail;
        socket.on("auth", (data) => {
            try {
                const result = jwt.verify(data.token, process.env.JWT_SECRET);
                connectedUserEmail = result.email;
                userConnections[connectedUserEmail] = socket;
                console.log("[websocket] \t🔗 User " + connectedUserEmail + " connected.");
            } catch (e) {
                console.log("[websocket] \t💁 Authentication failed: ", e);
            }
        });
        socket.on("disconnect", () => {
            if (!connectedUserEmail) return;
            console.log("[websocket] \t🚪🏃💨 User " + connectedUserEmail + " disconnected.");
            delete userConnections[connectedUserEmail];
        });
    });
}

function sendToUser(email, eventName, data) {
    if (!userConnections[email]) return;
    userConnections[email].emit(eventName, data);
}

module.exports = { init, io, sendToUser };