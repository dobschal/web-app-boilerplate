const {HTTP} = require("../core/HTTP.js");
const {Router} = require("../core/Router.js");
const {Box, Input, List, ListItem} = require("../core/UI.js");
const {Header} = require("../partials/Header.js");
const {getJwtContent} = require("../core/Auth.js");

const data = {
    users: []
};

Box(
    Header("Find a user to chat with"),
    Input("Query").on("value", _loadUsers),
    List(_buildListItem)
).on("create", () => _loadUsers());

/**
 * @param {string} [query]
 */
async function _loadUsers(query) {
    if (data.users.length === 0) List.first().addStyle("loading");
    data.users = (await HTTP.get("/users" + (query ? `?query=${query}` : ""))).users;
    List.first().removeStyle("loading");
    List.first().update();
}

function _buildListItem() {
    const {email: currentUserEmail} = getJwtContent();
    return data.users
        .filter(({email}) => email !== currentUserEmail)
        .map(user =>
            ListItem(user.email)
                .on("click", () => _openChat(user.email))
                .addStyle("selectable")
        );
}

/**
 * @param {string} email
 */
async function _openChat(email) {
    const response = await HTTP.post("/chats/open", {
        email
    });
    await Router.go(`/chats/${response.chatRoomId}`);
}