const { on } = require("../../../shared/util/Event.js");
const { isAuthenticated } = require("./Auth.js");
const { Storage } = require("./Storage.js");

on("Authenticated", () => {
    HTTP.jwt = Storage.get("jwt");
});

const HTTP = {

    /**
     * Set this value on app start via `HTTP.baseUrl = "https://...";`
     * @type {string}
     */
    baseUrl: "",
    jwt: isAuthenticated() ? Storage.get("jwt") : "",

    _getHeaders() {
        return {
            "Content-Type": "application/json",
            ...(this.jwt ? { "Authorisation": "Bearer " + this.jwt } : {})
        };
    },

    async post(url = "", data = {}) {
        const response = await fetch(this.baseUrl + url, {
            method: "POST",
            headers: this._getHeaders(),
            body: JSON.stringify(data)
        });
        // TODO: throw error is status >= 400        
        return response.json();
    },

    async get(url = "") {
        const response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: this._getHeaders()
        });
        return response.json();
    }
};

module.exports = { HTTP };