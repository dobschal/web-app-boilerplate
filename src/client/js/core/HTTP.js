module.exports.HTTP = {

    /**
     * Set this value on app start via `HTTP.baseUrl = "https://...";`
     * @type {string}
     */
    baseUrl: "",

    async post(url = "", data = {}) {
        const response = await fetch(this.baseUrl + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json();
    },

    async get(url = "") {
        const response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.json();
    }
};