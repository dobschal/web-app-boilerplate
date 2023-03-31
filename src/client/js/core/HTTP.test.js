const {HTTP} = require("./HTTP.js");

global.fetch = jest.fn(() =>
    Promise.resolve({
        status: 200,
        json: () => Promise.resolve({}),
    })
);

HTTP.baseUrl = "yeah";

test("HTTP POST", async () => {
    await HTTP.post("/test");
    expect(global.fetch).toBeCalledWith("yeah/test", {
        headers: {
            "Content-Type": "application/json"
        },
        body: "{}",
        method: "POST"
    });
});

test("HTTP POST with body", async () => {
    await HTTP.post("/test", {
        uuuh: "yeah"
    });
    expect(global.fetch).toBeCalledWith("yeah/test", {
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            uuuh: "yeah"
        }),
        method: "POST"
    });
});

test("HTTP GET", async () => {
    await HTTP.get("/test");
    expect(global.fetch).toBeCalledWith("yeah/test", {
        headers: {
            "Content-Type": "application/json"
        },
        method: "GET"
    });
});