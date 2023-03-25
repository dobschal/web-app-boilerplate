const { io } = require("socket.io-client");
const { Box, Headline } = require("./core/UI.js");

console.log("Yeah");

Box(Headline("Yeah 2!"));

var socket = io();

socket.emit("chat message", "hey");

socket.on("chat message", function (msg) {
    console.log("MEssage: ", msg);
});