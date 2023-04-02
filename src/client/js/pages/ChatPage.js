const { Router } = require("../core/Router.js");
const { Box, Input, Form, SubmitButton, List, refs, Headline, Header } = require("../core/UI.js");
const { HTTP } = require("../core/HTTP.js");
const { IconButton } = require("../partials/IconButton.js");
const { logout } = require("../core/Auth.js");
const { ChatBubble } = require("../partials/ChatBubble.js");
const { Websocket } = require("../core/Websocket.js");

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
        .ref("messages")
        .addStyle("min-height-80"),
    Form(
        Input("Message").setFocus(),
        SubmitButton("Send"),
        ({ message }) => _sendMessage(message)
    ).addStyle("stick-bottom", "inline-form", "bg-white", "py1")
).on("update", _loadMessages);

/** Websocket **/

Websocket.listen("message", async ({ chatRoomId }) => {
    if (chatRoomId === Number(Router.params.id)) {
        await _loadMessages();
    }
});

/** Functions **/

async function _loadMessages() {
    data.messages = [];
    const response = await HTTP.get("/chats/messages?chat_room_id=" + Router.params.id);
    data.messages = response.messages;
    await refs.messages.update();
    _scrollToPageBottom();
}

function _scrollToPageBottom() {
    const scrollingElement = (document.scrollingElement || document.body);
    scrollingElement.scrollTop = scrollingElement.scrollHeight;
}

async function _sendMessage(message) {
    const chatRoomId = Number(Router.params.id);
    await HTTP.post("/chats/message", {
        chatRoomId,
        message
    });
}