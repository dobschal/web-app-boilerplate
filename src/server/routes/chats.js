const { expectType } = require("../core/type.js");
const { AuthService } = require("../service/AuthService.js");
const { ChatRoomService } = require("../service/ChatRoomService.js");
const { UserService } = require("../service/UserService.js");

module.exports = {
    "POST /open": async (req, res) => {
        // TODO: request body should contain array of emails for chat room
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
            console.log("[chats] Created new chat room: ", chatRoomId);
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
    }
};