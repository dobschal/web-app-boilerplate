const { isNonEmptyString } = require("./type.js");

test("isNonEmptyString", () => {
    expect(isNonEmptyString()).toBe(false);
    expect(isNonEmptyString("")).toBe(false);
    expect(isNonEmptyString("1")).toBe(true);
    expect(isNonEmptyString(1)).toBe(false);
    expect(isNonEmptyString({})).toBe(false);
});