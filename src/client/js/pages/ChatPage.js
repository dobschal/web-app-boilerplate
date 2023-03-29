const { Router } = require("../core/Router.js");
const { Box, TextBlock } = require("../core/UI.js");

console.log("Params: ", Router.params);

Box(() => TextBlock(() => {
    console.log("[Chat] Render text: ", Router.params);
    return "Chat!!!" + Router.params.id;
}));