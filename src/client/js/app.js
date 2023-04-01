const {isAuthenticated} = require("./core/Auth.js");
const {HTTP} = require("./core/HTTP.js");
const {Router} = require("./core/Router.js");
const {Websocket} = require("./core/Websocket.js");

console.log("[app] 🚀 Application started.");

HTTP.init( window.location.protocol + "//" + window.location.host + "/api");
Websocket.init();

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