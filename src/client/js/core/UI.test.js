const {build} = require("./UI.js");

test("Build p tag element", () => {
    const element = build({
        tag: "p",
    });
    expect(element.tagName).toBe("P");
});

test("Build element with any attribute", () => {
    const element = build({
        tag: "div",
        other: "yeah"
    });
    expect(element.getAttribute("other")).toBe("yeah");
});

test("Child is attached", () => {
    const element = build({
        children: build({
            tag: "p"
        })
    });setTimeout(() => {
        expect(element.children[0].tagName).toBe("P");
    });
});