const {Image} = require("../core/UI.js");

// TODO: import component specific CSS right in the javascript file

/**
 * @param {string} iconUrl
 * @param {(MouseEvent) => void} onClick
 * @returns {HTMLImageElement}
 */
module.exports.IconButton = function (iconUrl, onClick) {
    return Image(iconUrl).addStyle("icon", "button").on("click", onClick);
};
