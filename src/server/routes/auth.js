const { sendMail } = require("../core/email.js");
const { expectType } = require("../core/type.js");
const { AuthService } = require("../service/AuthService.js");
const { UserService } = require("../service/UserService.js");

module.exports = {

    "POST /login": async (req, res) => {
        expectType(req.body, { email: "string" });
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
        expectType(req.body, {
            email: "string",
            otp: "string"
        });
        const user = await UserService.getUserByEmail(req.body.email);
        if (!user) throw new Error("400 Unknown user.");
        if (user.otp !== req.body.otp) throw new Error("401 Unauthorised");
        await UserService.setOtp(user.id, AuthService.generateOtp());
        res.send({
            jwt: AuthService.generateToken(user.email, user.roles),
            success: true
        });
    }
};

