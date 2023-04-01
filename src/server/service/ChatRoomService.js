const {query} = require("../core/database.js");

module.exports.ChatRoomService = {
    async getDirectChat(userId1, userId2) {
        const chats = await query(`
            SELECT cr.id   AS id,
                   cr.name AS name
            FROM chat_room cr
                     JOIN chat_room_user cru1 ON cru1.chat_room_id = cr.id
                     JOIN chat_room_user cru2 ON cru1.chat_room_id = cr.id
            WHERE cru1.chat_room_id = cru2.chat_room_id
              AND cru1.user_id = ${userId1}
              AND cru2.user_id = ${userId2}
              AND NOT EXISTS(
                    SELECT 1
                    FROM chat_room_user cru3
                    WHERE cru3.chat_room_id = cru1.chat_room_id
                      AND cru3.user_id <> ${userId1}
                      AND cru3.user_id <> ${userId2}
                );
        `);
        console.log("[Chat Room Service] Chats: ", chats);
        return chats[0];
    },

    async createDirectChat(userId1, userId2) {
        const {insertId: chatRoomId} = await query("INSERT INTO chat_room SET ?", {
            name: "chat_" + userId1 + "_" + userId2
        });
        await query("INSERT INTO chat_room_user SET ?", {
            user_id: userId1,
            chat_room_id: chatRoomId
        });
        await query("INSERT INTO chat_room_user SET ?", {
            user_id: userId2,
            chat_room_id: chatRoomId
        });
        return chatRoomId;
    },

    async userIsInChatRoom(userId, chatRoomId) {
        const [{amount}] = await query(`
            SELECT COUNT(*) as amount
            FROM chat_room cr
                     JOIN chat_room_user cru on cr.id = cru.chat_room_id
            WHERE cru.user_id = ?
              AND cr.id = ?
        `, [userId, chatRoomId]);
        return amount === 1;
    },

    async insertMessage(userId, chatRoomId, message) {
        await query("INSERT INTO message SET ?", {
            chat_room_id: chatRoomId,
            content: message,
            sender_id: userId,
            type: "text"
        });
    },

    async getMessages(chatRoomId) {
        return await query(`
            SELECT m.id         as id,
                   m.content    as content,
                   m.created_at as createdAt,
                   m.type       as type,
                   u.email      as userEmail,
                   u.id         as userId
            FROM message m
                     JOIN user u ON u.id = m.sender_id
            WHERE chat_room_id = ?
        `, [chatRoomId]);
    },

    async getUsersOfChatRoom(chatRoomId) {
        const results = await query(`
            SELECT u.*
            FROM chat_room cr
                     JOIN chat_room_user cru ON cr.id = cru.chat_room_id
                     JOIN user u ON u.id = cru.user_id
            WHERE cr.id = ?
        `, [chatRoomId]);
        return results;
    },
};