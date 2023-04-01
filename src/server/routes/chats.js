const { expectType } = require("../core/type.js");
const { AuthService } = require("../service/AuthService.js");
const { ChatRoomService } = require("../service/ChatRoomService.js");
const { UserService } = require("../service/UserService.js");
const {sendToUser} = require("../core/websocket.js");

module.exports = {
    "POST /open": async (req, res) => {
        expectType(req.body, { email: "email" });
        AuthService.expectUser(req);
        if (req.body.email === req.user.email) {
            throw new Error("400 You cannot chat with yourself.");
        }
        const otherUser = await UserService.getUserByEmail(req.body.email);
        if (!otherUser) {
            throw new Error("400 User with email not found.");
        }
        const chat = await ChatRoomService.getDirectChat(req.user.id, otherUser.id);
        if (!chat) {
            const chatRoomId = await ChatRoomService.createDirectChat(req.user.id, otherUser.id);
            console.log("[chats] Created new chat room: ", chatRoomId);
            res.send({
                success: true,
                chatRoomId: chatRoomId
            });
        } else {
            res.send({
                success: true,
                chatRoomId: chat.id
            });
        }
    },

    "POST /message": async (req, res) => {
        expectType(req.body, { chatRoomId: "number", message: "string" });
        AuthService.expectUser(req);
        if(!(await ChatRoomService.userIsInChatRoom(req.user.id, req.body.chatRoomId))) {
            throw new Error("403 Not in chat.");
        }
        await ChatRoomService.insertMessage(req.user.id, req.body.chatRoomId, req.body.message);
        const users = await ChatRoomService.getUsersOfChatRoom(req.body.chatRoomId);
        users.forEach(user => sendToUser(user.email, "message", {
            chatRoomId: req.body.chatRoomId,
            userId: req.user.id,
            userEmail: req.user.email,
            message: req.body.message
        }));
        res.send({
            success: true
        });
    },

    "GET /messages": async (req, res) => {
        expectType(req.query, { chat_room_id: "string" });
        AuthService.expectUser(req);
        const chatRoomId = Number(req.query.chat_room_id);
        if(!(await ChatRoomService.userIsInChatRoom(req.user.id, chatRoomId))) {
            throw new Error("403 Not in chat.");
        }
        const messages = await ChatRoomService.getMessages(chatRoomId);
        res.send({
            success: true,
            messages
        });
    }
};