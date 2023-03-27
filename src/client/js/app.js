const { io } = require("socket.io-client");
const { HTTP } = require("./core/HTTP.js");
const { Box, Headline } = require("./core/UI.js");

console.log("[app] Application started.");

HTTP.baseUrl = "https://chat.dobschal.eu/api";

// HTTP.post("/auth/verify", {
//     email: "sascha@dobschal.eu",
//     otp: "065951"
// }).then(response => {
//     console.log("Reponse: ", response);
// });

HTTP.get("/version").then(response => {
    console.log("Reponse: ", response);
});

Box(Headline("Nice!"));


const socket = io();

socket.on("chat message", function (msg) {
    console.log("MEssage: ", msg);
});

socket.emit("auth", {
    token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhc2NoYUBkb2JzY2hhbC5ldSIsInJvbGVzIjoidXNlciIsImlhdCI6MTY3OTkwNTk1Mn0.551gtZ0kw_mEzCpLNxiQpsOjFST4g53SMGl3PMjDeck"
});