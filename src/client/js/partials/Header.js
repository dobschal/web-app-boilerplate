const {Box, Headline} = require("../core/UI.js");
const {IconButton} = require("./IconButton.js");
const {logout} = require("../core/Auth.js");
const {Router} = require("../core/Router.js");

/**
 * @param {string|(() => string)} headline
 * @returns {HTMLDivElement}
 */
module.exports.Header = function (headline) {
    return Box(
        IconButton("/icons/home.svg", () => Router.go("/")),
        IconButton("/icons/logout.svg", logout),
        Headline(headline)
    );
};