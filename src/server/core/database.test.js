jest.mock("mysql", () => {
    return {
        createPool: () => {
            return {
                query: (state, param, callback) => {
                    callback(null, []);
                }
            };
        }
    };
});
const { query } = require("./database.js");

test("Database query function returns array", async () => {

    const result = await query("SELECT * FROM user;");

    expect(Array.isArray(result)).toBe(true);
});