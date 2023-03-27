const { Router } = require("../core/Router.js");
const { submit } = require("../../../shared/util/Event.js");
const { HTTP } = require("../core/HTTP.js");
const { Box, Headline, Form, Input, SubmitButton, TextBlock } = require("../core/UI.js");
const { Storage } = require("../core/Storage.js");

console.log("Email: ", Router.getQueryParams().email);

Box(
    Headline("Verify Email"),
    TextBlock("Please enter the One-Time-Password from the email."),
    Form(
        Input("OTP").setRequired(),
        SubmitButton("Login"),
        async (data) => {
            const { jwt } = await HTTP.post("/auth/verify", {
                email: Router.getQueryParams().email,
                ...data
            });
            Storage.save("jwt", jwt);
            submit("Authenticated", jwt);
            Router.go("/");
        }
    )
);

setTimeout(() => {
    if (!Router.getQueryParams().email) Router.go("/login");
});