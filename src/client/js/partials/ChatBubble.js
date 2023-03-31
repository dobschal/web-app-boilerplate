const {Box, SubHeadline, TextBlock} = require("../core/UI.js");
const {getCurrentUserClaim} = require("../core/Auth.js");

// TODO: Add type for chat message

/**
 * @param message
 * @returns {HTMLElement}
 */
module.exports.ChatBubble = function (message) {
    const isOwnMessage = getCurrentUserClaim("email") === message.userEmail;
    return Box(
        SubHeadline(message.userEmail),
        TextBlock(message.content)
    ).addStyle(
        "chat-bubble",
        isOwnMessage ? "own-message" : ""
    );
};