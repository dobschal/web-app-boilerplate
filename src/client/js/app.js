const {isAuthenticated} = require("./core/Auth.js");
const {HTTP} = require("./core/HTTP.js");
const {Router} = require("./core/Router.js");
const {on} = require("../../shared/util/Event.js");
const {Storage} = require("./core/Storage.js");

console.log("[app] 🚀 Application started.");

HTTP.baseUrl = window.location.protocol + "//" + window.location.host + "/api";

on("Authenticated", () => {
    HTTP.jwt = Storage.get("jwt");
});

Router.beforeEach = async function (path) {
    if (!isAuthenticated() && !["/verify-email", "/login"].includes(path)) {
        await Router.go("/login");
        return false;
    } else if (isAuthenticated() && ["/verify-email", "/login"].includes(path)) {
        await Router.go("/");
        return false;
    }
    return true;
};

Router.init({
    "/chats/{id}": () => require("./pages/ChatPage.js"),
    "/verify-email": () => require("./pages/VerifyEmailPage.js"),
    "/login": () => require("./pages/LoginPage.js"),
    "*": () => require("./pages/HomePage.js")
});

// HTTP.jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhc2NoYUBkb2JzY2hhbC5ldSIsInJvbGVzIjoidXNlciIsImlhdCI6MTY3OTkwNTk1Mn0.551gtZ0kw_mEzCpLNxiQpsOjFST4g53SMGl3PMjDeck";
// HTTP.baseUrl = "https://chat.dobschal.eu/api";

// HTTP.post("/auth/verify", {
//     email: "sascha@dobschal.eu",
//     otp: "040817"
// }).then(response => {
//     console.log("Reponse: ", response);
// });

// HTTP.get("/users/current").then(response => {
//     console.log("Reponse User: ", response);
// });

// HTTP.get("/version").then(response => {
//     console.log("Reponse: ", response);
// });

// Box(Headline("Nice!"));


// const socket = io();

// socket.on("chat message", function (msg) {
//     console.log("MEssage: ", msg);
// });

// socket.emit("auth", {
//     token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6InNhc2NoYUBkb2JzY2hhbC5ldSIsInJvbGVzIjoidXNlciIsImlhdCI6MTY3OTkwNTk1Mn0.551gtZ0kw_mEzCpLNxiQpsOjFST4g53SMGl3PMjDeck"
// });