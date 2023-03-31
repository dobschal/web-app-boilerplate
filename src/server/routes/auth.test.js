jest.mock("../service/AuthService.js", () => {
    return {
        AuthService: {
            generateOtp: () => {
                return "";
            }
        }
    };
});
jest.mock("../service/UserService.js", () => {
    return {
        UserService: {
            getUserByEmail: () => {
                return Promise.resolve({
                    id: 1,
                    email: "yeah@yeah.com"
                });
            },
            insertUser: () => {
                return Promise.resolve({
                    id: 1,
                    email: "yeah@yeah.com"
                });
            },
            setOtp: () => {
                return Promise.resolve();
            }
        }
    };
});
jest.mock("../core/email.js", () => {
    return {
        sendMail: jest.fn(() => {
            return Promise.resolve();
        })
    };
});
const auth = require("./auth.js");
const { sendMail } = require("../core/email.js");

test("POST /auth/login", async () => {
    const res = {
        send: jest.fn()
    };
    const req = {
        body: { email: "yeah@yeah.com" }
    };
    await auth["POST /login"](req, res);
    expect(sendMail).toBeCalledWith("yeah@yeah.com", "Your One Time Password", "Your OTP is: ");
    expect(res.send).toBeCalledWith({
        success: true
    });
});

test("POST /auth/login invalid email", async () => {
    const res = {
        send: jest.fn()
    };
    const req = {
        body: { email: "weird" }
    };
    try {
        await auth["POST /login"](req, res);
        expect(true).toBe(false);
    } catch(e) {
        expect(e.message.startsWith("400")).toBe(true);
    }
});