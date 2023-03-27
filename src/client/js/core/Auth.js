const { Storage } = require("./Storage.js");

function isAuthenticated() {
    return Boolean(Storage.get("jwt"));
}

module.exports = { isAuthenticated };