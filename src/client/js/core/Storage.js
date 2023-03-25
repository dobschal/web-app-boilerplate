module.exports.Storage = {
    save(key, value) {
        if (typeof value === "string") {
            window.localStorage.setItem(key, value);
            window.localStorage.setItem(key + "___type", "string");
        } else if (Array.isArray(value) || value?.constructor === Object) {
            window.localStorage.setItem(key, JSON.stringify(value));
            window.localStorage.setItem(key + "___type", "object");
        } else {
            console.log("Unsupported type for saving in Storage.");
        }
    },
    get(key) {
        const type = window.localStorage.getItem(key + "___type");
        if (!type) return undefined;
        if (type === "string") return window.localStorage.getItem(key);
        if (type === "object") return JSON.parse(window.localStorage.getItem(key));
    }
};