const { HTTP } = require("../core/HTTP.js");
const { Router } = require("../core/Router.js");
const { Box, TextBlock, Title, Headline, Input, List, ListItem } = require("../core/UI.js");

const data = {
    users: []
};

Box(
    Title("Chat"),
    TextBlock("Welcome to my chat app"),
    Headline(() => "Find Users"),
    Input("Query").on("input", (event) => _loadUsers(event.target.value)),
    List(() => data.users.map(user =>
        ListItem(user.email).on("click", () => {
            _openChat(user.email);
        }).addStyle("selectable")
    ))
).on("create", () => _loadUsers());

/**
 * @param {string} query 
 */
async function _loadUsers(query) {
    if (data.users.length === 0) List.first().addStyle("loading");
    data.users = (await HTTP.get("/users" + (query ? `?query=${query}` : ""))).users;
    List.first().removeStyle("loading");
    List.first().update();
}

/**
 * @param {string} email 
 */
async function _openChat(email) {
    const response = await HTTP.post("/chats/open", {
        email
    });
    Router.go(`/chats/${response.chatRoomId}`);
}