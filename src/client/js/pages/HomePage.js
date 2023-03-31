const {HTTP} = require("../core/HTTP.js");
const {Router} = require("../core/Router.js");
const {Box, Input, List, ListItem, refs, Headline, Header} = require("../core/UI.js");
const {getJwtContent, logout} = require("../core/Auth.js");
const {IconButton} = require("../partials/IconButton.js");

const data = {
    users: []
};

Header(
    IconButton("/icons/home.svg", () => Router.go("/")),
    Headline(() => "Users"),
    IconButton("/icons/logout.svg", logout)
);
Box(
    Input("Find user", "query").on("value", _loadUsers),
    List(_buildListItem).ref("list")
).on("update", () => _loadUsers());

/**
 * @param {string} [query]
 */
async function _loadUsers(query) {
    if (data.users.length === 0) refs.list.addStyle("loading");
    data.users = (await HTTP.get("/users" + (query ? `?query=${query}` : ""))).users;
    refs.list.removeStyle("loading");
    refs.list.update();
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