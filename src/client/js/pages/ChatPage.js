const {Router} = require("../core/Router.js");
const {Box, Input, Form, SubmitButton, List, refs, Headline, Header} = require("../core/UI.js");
const {HTTP} = require("../core/HTTP.js");
const {IconButton} = require("../partials/IconButton.js");
const {logout} = require("../core/Auth.js");
const {ChatBubble} = require("../partials/ChatBubble.js");

const data = {
    messages: []
};

Header(
    IconButton("/icons/home.svg", () => Router.go("/")),
    Headline(() => "Chat #" + Router.params.id),
    IconButton("/icons/logout.svg", logout)
);
Box(
    List(() => data.messages.map(ChatBubble))
        .ref("messages"),
    Form(
        Input("Message").setFocus(),
        SubmitButton("Send"),
        ({message}) => _sendMessage(message)
    ).addStyle("stick-bottom", "inline-form", "bg-white", "py1")
).on("update", _loadMessages);

/** Functions **/

async function _loadMessages() {
    refs.messages.addStyle("loading");
    data.messages = [];
    const response = await HTTP.get("/chats/messages?chat_room_id=" + Router.params.id);
    data.messages = response.messages;
    refs.messages.removeStyle("loading").update();
}

async function _sendMessage(message) {
    const chatRoomId = Number(Router.params.id);
    await HTTP.post("/chats/message", {
        chatRoomId,
        message
    });
    await _loadMessages();
}