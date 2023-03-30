const { query } = require("../core/database.js");

const UserRoles = {
    user: "user",
    admin: "admin"
};

module.exports.UserService = {
    async getUserById(id) {
        const results = await query("SELECT * FROM user WHERE id = ?", [id]);
        return results[0];
    },
    async getUserByEmail(email) {
        const results = await query("SELECT * FROM user WHERE email = ?", [email]);
        return results[0];
    },
    async insertUser(email, otp) {
        const results = await query("INSERT INTO user SET ?", { email, otp, roles: UserRoles.user });
        return this.getUserById(results.insertId);
    },
    async setOtp(userId, otp) {
        await query("UPDATE user SET otp=? WHERE id=?", [otp, userId]);
    },
    async findAll() {
        return await query("SELECT * FROM user;");
    },
    async find(searchTerm) {
        return await query(`SELECT * FROM user WHERE email LIKE "%${searchTerm}%";`);
    }
};