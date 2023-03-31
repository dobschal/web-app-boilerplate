const { Storage } = require("./Storage.js");

function isAuthenticated() {
    return Boolean(Storage.get("jwt"));
}

function logout() {
    Storage.remove("jwt");
    window.location.reload();
}

function getJwtContent() {
    if(!isAuthenticated()) return;
    const [_, content] = Storage.get("jwt").split(".");
    return JSON.parse(atob(content));
}

function getCurrentUserClaim(claim) {
    return (getJwtContent() || {})[claim];
}

module.exports = { isAuthenticated, logout, getJwtContent, getCurrentUserClaim };