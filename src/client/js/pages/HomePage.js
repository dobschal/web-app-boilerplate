const { HTTP } = require("../core/HTTP.js");
const { Box, TextBlock, Title, Headline, Input, List, ListItem } = require("../core/UI.js");

const data = {
    users: []
};

const list = List(() => data.users.map(user => ListItem(user.email)));

Box(
    Title("Chat"),
    TextBlock("Welcome to my chat app"),
    Headline(() => "Find Users"),
    Input("Query").on("input", (event) => _loadUsers(event.target.value)),
    list
);

_loadUsers();

/* functions */

/**
 * @param {string} query 
 */
async function _loadUsers(query) {
    list.classList.add("loading");
    data.users = (await HTTP.get("/users" + (query ? `?query=${query}` : ""))).users;
    list.classList.remove("loading");
    list.update();
}