const { AuthService } = require("../service/AuthService.js");
const { UserService } = require("../service/UserService.js");

module.exports = {

    /**
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     */
    "GET /current": async (req, res) => {
        AuthService.expectUser(req);
        delete req.user.otp; // do not expose the OTP
        res.send({ success: true, user: req.user });
    },

    /**
     * @param {import("express").Request} req 
     * @param {import("express").Response} res 
     */
    "GET /": async (req, res) => {
        AuthService.expectUser(req);
        let users = [];
        if (req.query.query) {
            users = await UserService.find(req.query.query);
        } else {
            users = await UserService.findAll();
        }
        res.send({
            success: true,
            users: users.map(user => {
                return {
                    email: user.email
                };
            })
        });
    }
};