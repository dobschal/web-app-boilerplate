export const HTTP = {
    baseUrl: "https://119uib-8080.csb.app",
    async post(url = "", data = {}) {
        const response = await fetch(this.baseUrl + url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        return response.json(); // parses JSON response into native JavaScript objects
    },
    async get(url = "") {
        const response = await fetch(this.baseUrl + url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });
        return response.json(); // parses JSON response into native JavaScript objects
    }
};