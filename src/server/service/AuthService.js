module.exports.AuthService = {
    generateOtp() {
        let otp = Math.floor(Math.random() * 100000).toString();
        while (otp.length < 6) otp = "0" + otp;
        return otp;
    }
};