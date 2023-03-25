const { io } = require("socket.io-client");
const { HTTP } = require("./core/HTTP.js");
const { Box, Headline } = require("./core/UI.js");

HTTP.baseUrl = "https://chat.dobschal.eu/api";

HTTP.post("/login", {
    yeah: "uuuh"
}).then(response => {
    console.log("Reponse: ", response);
});

HTTP.get("").then(response => {
    console.log("Reponse: ", response);
});

console.log("Yeah");

Box(Headline("Nice!"));

var socket = io();

socket.emit("chat message", "hey");

socket.on("chat message", function (msg) {
    console.log("MEssage: ", msg);
});