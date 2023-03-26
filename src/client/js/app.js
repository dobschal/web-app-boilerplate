const { io } = require("socket.io-client");
const { HTTP } = require("./core/HTTP.js");
const { Box, Headline } = require("./core/UI.js");

HTTP.baseUrl = "https://chat.dobschal.eu/api";

HTTP.post("/auth/verify", {
    email: "sascha@dobschal.eu",
    otp: "016991"
}).then(response => {
    console.log("Reponse: ", response);
});

HTTP.get("/version").then(response => {
    console.log("Reponse: ", response);
});

Box(Headline("Nice!"));


const socket = io();

socket.emit("chat message", "hey");

socket.on("chat message", function (msg) {
    console.log("MEssage: ", msg);
});