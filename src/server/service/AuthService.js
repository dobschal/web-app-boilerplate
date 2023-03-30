var jwt = require("jsonwebtoken");

module.exports.AuthService = {
    generateOtp() {
        let otp = Math.floor(Math.random() * 100000).toString();
        while (otp.length < 6) otp = "0" + otp;
        return otp;
    },

    /**
     * @param {string} email 
     * @param {string} roles - comma separated
     * @returns {string}
     */
    generateToken(email, roles) {
        return jwt.sign({ email, roles }, process.env.JWT_SECRET);
    },

    expectUser(req) {
        if (!req.user) throw new Error("401 Please login first.");
    }
};