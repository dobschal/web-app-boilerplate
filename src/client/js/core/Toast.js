const { Box, TextBlock } = require("./UI.js");
module.exports.Toast = {

    _toasts: [],
    _toastContainer: Box().addStyle("toasts"),

    /**
     * @param {string} message
     * @param {string} type
     * @param {number} [duration] - in milliseconds
     */
    show(message, type = "default", duration = 3000) {
        this._toasts.push(TextBlock(message).addStyle(type));
        this._toastContainer.add(this._toasts[this._toasts.length - 1]);
        setTimeout(() => {
            this._toasts.shift().remove();
        }, duration);
    }
};