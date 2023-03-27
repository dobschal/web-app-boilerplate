const { AuthService } = require("../service/AuthService.js");

module.exports = {
    "GET /current": async (req, res) => {
        AuthService.expectUser(req);
        delete req.user.otp; // do not expose the OTP
        res.send({ success: true, user: req.user });
    }
};