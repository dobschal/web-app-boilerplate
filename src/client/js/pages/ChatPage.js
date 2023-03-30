const {Router} = require("../core/Router.js");
const {Box, TextBlock, Input, Form, SubmitButton, List, ListItem, refs} = require("../core/UI.js");
const {Header} = require("../partials/Header.js");
const {HTTP} = require("../core/HTTP.js");

const data = {
    messages: []
};

Box(
    Header(() => "Chat " + Router.params.id),
    TextBlock("Write a message!"),
    Form(
        Input("Message").setFocus(),
        SubmitButton("Send"),
        ({message}) => _sendMessage(message)
    ),
    List(() => data.messages.map(message => ListItem(message.content))).ref("list")
).on("update", _loadMessages);

async function _loadMessages() {
    const response = await HTTP.get("/chats/messages?chat_room_id=" + Router.params.id);
    data.messages = response.messages;
    console.log("Messages: ", data.messages, Router.params.id);
    refs.list.update();
}

async function _sendMessage(message) {
    const chatRoomId = Number(Router.params.id);
    await HTTP.post("/chats/message", {
        chatRoomId,
        message
    });
    await _loadMessages();
}