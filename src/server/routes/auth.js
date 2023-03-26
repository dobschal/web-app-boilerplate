const { sendMail } = require("../core/email.js");
const { isNonEmptyString } = require("../core/type.js");
const { AuthService } = require("../service/AuthService.js");
const { UserService } = require("../service/UserService.js");

module.exports = {
    "POST /login": async (req, res) => {
        if (!isNonEmptyString(req.body.email)) {
            throw new Error("400 Email missing");
        }
        const otp = AuthService.generateOtp();
        let user = await UserService.getUserByEmail(req.body.email);
        if (!user) {
            user = await UserService.insertUser(req.body.email, otp);
        } else {
            await UserService.setOtp(user.id, otp);
        }
        await sendMail(req.body.email, "Your One Time Password", `Your OTP is: ${otp}`);
        res.send({
            success: true
        });
    },

    "POST /verify": async (req, res) => {
        // TODO: set user as active if token is valid
        res.send({
            success: true
        });
    }
};

