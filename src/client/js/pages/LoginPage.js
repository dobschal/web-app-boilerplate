const { HTTP } = require("../core/HTTP.js");
const { Router } = require("../core/Router.js");
const { Box, Headline, Form, Input, SubmitButton, TextBlock, refs} = require("../core/UI.js");
const {Toast} = require("../core/Toast.js");

Box(
    Headline("Login"),
    TextBlock("We will send you a code to the entered email address to verify that you are the owner."),
    Form(
        Input("Email").ref("email").setRequired(),
        SubmitButton("Login"),
        async (data) => {
            try {
                await HTTP.post("/auth/login", data);
                await Router.go("/verify-email?email=" + data.email);
            }catch(e) {
                Toast.show(e.error.substring(4));
                refs.email.focus();
            }
        }
    )
);