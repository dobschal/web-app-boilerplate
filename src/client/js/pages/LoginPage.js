const { HTTP } = require("../core/HTTP.js");
const { Router } = require("../core/Router.js");
const { Box, Headline, Form, Input, SubmitButton, TextBlock } = require("../core/UI.js");

Box(
    Headline("Login"),
    TextBlock("We will send you a code to the entered email address to verify that you are the owner."),
    Form(
        Input("Email").setRequired(),
        SubmitButton("Login"),
        async (data) => {
            await HTTP.post("/auth/login", data);
            Router.go("/verify-email?email=" + data.email);
        }
    )
);