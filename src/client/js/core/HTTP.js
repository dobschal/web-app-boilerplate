const { isAuthenticated } = require("./Auth.js");
const { Storage } = require("./Storage.js");

const HTTP = {

    /**
     * Set this value on app start via `HTTP.baseUrl = "https://...";`
     * @type {string}
     */
    baseUrl: "",

    /**
     * This depends on two other modules "Auth" and "Storage". You can remove the dependencies and
     * set this jwt value manually.
     * @type {string}
     */
    jwt: isAuthenticated() ? Storage.get("jwt") : "",

    /**
     * @param {string} url
     * @param {object} data
     * @returns {Promise<*>}
     */
    async post(url = "", data = {}) {
        return this._request("POST", url, data);
    },

    /**
     * @param {string} url
     * @returns {Promise<*>}
     */
    async get(url = "") {
        return this._request("GET", url);
    },

    /**
     * @returns {object}
     */
    _getHeaders() {
        return {
            "Content-Type": "application/json",
            ...(this.jwt ? { "Authorisation": "Bearer " + this.jwt } : {})
        };
    },

    /**
     * @param {'POST'|'GET'|'PUT'|'PATCH'|'DELETE'} method
     * @param {string} url
     * @param {object} data
     * @returns {Promise<*>}
     */
    async _request(method, url, data = {}) {
        const options = {
            method,
            headers: this._getHeaders()
        };
        if(method !== "GET" && data) {
            options.body = JSON.stringify(data);
        }
        const rawResponse = await fetch(this.baseUrl + url, options);
        let response;
        try {
            response = await rawResponse.json();
        } catch (e) {
            console.warn("[HTTP] Couldn't parse server response to JSON: ", e);
        }
        if(rawResponse.status >= 400) {
            throw response;
        }
        return response;
    }
};

module.exports = { HTTP };