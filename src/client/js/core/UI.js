const { Router } = require("./Router.js");

if (typeof HTMLElement.prototype.addStyle === "undefined") {
    HTMLElement.prototype.addStyle = function (...classNames) {
        classNames.forEach((className) => this.classList.add(className));
        return this;
    };
}

function Form(...params) {
    const submitHandler = params.pop();
    params[0].setFocus(); // Make first input in form having focus
    return build({
        tag: "form",
        children: params,
        onSubmit(event) {
            event.preventDefault();
            const data = {};
            params // children
                .filter((el) => el.tagName === "INPUT")
                .forEach((el) => {
                    data[el.getAttribute("name")] = el.value;
                });
            submitHandler(data);
        }
    });
}

function Box(...children) {
    return build({ children });
}

function AsyncList(childrenBuilder) {
    const el = List();
    el.reload = function () {
        childrenBuilder().then((children) => {
            el.innerHTML = "";
            el.append(...children);
        });
    };
    el.reload();
    return el;
}

function Link(text, ref) {
    return build({
        tag: "a",
        href: ref,
        text,

        /**
     * On link click, we check if the reference is an external resource.
     * If so, just let the link do the native stuff, else use our Router
     * to handle the inapp routing.
     *
     * @param {MouseEvent} event
     */
        onClick(event) {
            if (ref.startsWith("http://") || ref.startsWith("https://")) return;
            event.preventDefault();
            Router.go(ref);
        }
    });
}

function Navigation(...children) {
    return build({
        tag: "nav",
        children
    });
}

function Title(text) {
    return build({
        tag: "h1",
        text
    });
}

function Headline(text) {
    return build({
        tag: "h2",
        text
    });
}

function SubHeadline(text) {
    return build({
        tag: "h3",
        text
    });
}

function Input(label, name, type = "text") {
    const el = build({
        tag: "input",
        type,
        name: name ?? label.toLowerCase(),
        placeholder: label
    });
    el.setRequired = function () {
        el.addEventListener("blur", () =>
            el.classList[el.value ? "remove" : "add"]("has-error")
        );
        return this;
    };
    el.setFocus = function () {
        el.setAttribute("autofocus", "true");
        setTimeout(() => {
            el.focus();
        });
        return this;
    };
    return el;
}

function List(children) {
    return build({
        tag: "ul",
        children
    });
}

function ListItem(text) {
    return build({
        tag: "li",
        text
    });
}

function PasswordInput(label, name) {
    return Input(label, name, "password").setRequired();
}

function SubmitButton(label) {
    return build({
        tag: "button",
        type: "submit",
        text: label
    });
}

function TextBlock(text) {
    return build({
        tag: "p",
        text
    });
}

function InlineText(text) {
    return build({
        tag: "span",
        text
    });
}

/**
 * Build a HTMLElement based on a given config.
 * Any property can be passed: Those will be added as attribute
 * to the HTMLElement. If the property starts with "on", and the value
 * is a function, it adds a eventListener.
 *
 * @param {{tag: string, children: HTMLElement[]}} param0
 */
function build({ tag = "div", text, children = [], ...attributes }) {
    const element = document.createElement(tag);
    Object.keys(attributes).forEach(
        _handleBuildAttribute.bind({ element, attributes })
    );
    if (typeof text === "string") element.innerText = text;
    element.append(...children);
    setTimeout(() =>
        !element.parentElement ? document.body.append(element) : null
    );
    return element;
}

/**
 * When calling the build function any attribute can be passed as
 * argument. All argument key value pairs are added as attributes
 * to the HTMLElement that is created. If the argument startsWith
 * "on" and the value is a function, we expect to have a eventListener.
 *
 * This function needs to have the element and attributes bound.
 *
 * @param {string} key
 * @returns {void}
 */
function _handleBuildAttribute(key) {
    if (key.startsWith("on") && typeof this.attributes[key] === "function") {
        this.element.addEventListener(
            key.substring(2).toLowerCase(),
            this.attributes[key]
        );
    } else {
        this.element.setAttribute(key, this.attributes[key]);
    }
}

module.exports = {
    Box,
    build,
    AsyncList,
    Form,
    Headline,
    InlineText,
    Input,
    PasswordInput,
    List,
    ListItem,
    Link,
    Navigation,
    SubHeadline,
    SubmitButton,
    TextBlock,
    Title
};