const { io } = require("socket.io-client");
const { Box, Headline } = require("./core/UI.js");

console.log("Yeah");

Box(Headline("Nice!"));

var socket = io();

socket.emit("chat message", "hey");

socket.on("chat message", function (msg) {
    console.log("MEssage: ", msg);
});