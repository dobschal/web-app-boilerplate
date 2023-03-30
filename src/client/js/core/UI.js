const { Router } = require("./Router.js");

/**
 * @typedef {object} BuildConfig
 * @property {string} [tag]
 * @property {string|() => string} [text]
 * @property {HTMLElement[]|() => HTMLElement[]} [children]
 */

if (typeof HTMLElement.prototype.addStyle === "undefined") {

    /**
     * @param  {...string} classNames 
     * @returns {HTMLElement}
     */
    HTMLElement.prototype.addStyle = function (...classNames) {
        classNames.forEach((className) => this.classList.add(className));
        return this;
    };
}

if (typeof HTMLElement.prototype.removeStyle === "undefined") {

    /**
     * @param  {...string} classNames 
     * @returns {HTMLElement}
     */
    HTMLElement.prototype.removeStyle = function (...classNames) {
        classNames.forEach((className) => this.classList.remove(className));
        return this;
    };
}

if (typeof HTMLElement.prototype.on === "undefined") {

    /**
     * @param {string} eventName 
     * @param {(Event) => void)} callback 
     * @returns {HTMLElement}
     */
    HTMLElement.prototype.on = function (eventName, callback) {
        if (eventName === "create") {
            setTimeout(() => callback(this));
            return this;
        }
        if (eventName === "value") {
            this.addEventListener(
                "input",
                (event) => callback(event.target?.value)
            );
            return this;
        }
        this.addEventListener(eventName, callback);
        return this;
    };
}

/**
 * @param {BuildConfig|HTMLElement|() => HTMLElement} config 
 * @param  {...HTMLElement|() => HTMLElement} children 
 * @returns {HTMLDivElement}
 */
function Box(config, ...children) {
    if (config instanceof HTMLElement || typeof config === "function") {
        children.unshift(config);
        config = {};
    }
    return build({ children, ...config });
}

/**
 * @param {string} imageUrl
 * @returns {HTMLImageElement}
 */
function Image(imageUrl) {
    return build({
        tag: "img",
        src: imageUrl
    });
}

function Form(...params) {
    const submitHandler = params.pop();
    params[0].setFocus(); // Make first input in form having focus
    const element = build({
        tag: "form",
        children: params,
        async onSubmit(event) {
            event.preventDefault();
            element.classList.add("loading");
            const data = {};
            params // children
                .filter((el) => el.tagName === "INPUT")
                .forEach((el) => {
                    data[el.getAttribute("name")] = el.value;
                });
            try {
                await submitHandler(data);
            } catch (e) {
                console.error("Submit Handler thrown error: ", e);
            }
            element.classList.remove("loading");
        }
    });
    return element;
}

function Headline(text) {
    return build({
        tag: "h2",
        text
    });
}

function InlineText(text) {
    return build({
        tag: "span",
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
        el.setAttribute("required", "true");
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

function List(children) {
    return build({
        tag: "ul",
        children
    });
}

/**
 * Return the first List instance in the DOM.
 * @returns {HTMLElement}
 */
List.first = function () {
    return document.querySelector("ul");
};

function ListItem(text) {
    return build({
        tag: "li",
        text
    });
}

function Navigation(...children) {
    return build({
        tag: "nav",
        children
    });
}

function PasswordInput(label, name) {
    return Input(label, name, "password").setRequired();
}

function SubHeadline(text) {
    return build({
        tag: "h3",
        text
    });
}

function SubmitButton(label) {
    const element = build({
        tag: "button",
        type: "submit",
        text: label
    });
    return element;
}

function Title(text) {
    return build({
        tag: "h1",
        text
    });
}

function TextBlock(text) {
    return build({
        tag: "p",
        text
    });
}

/**
 * Creates a HTMLElement based on a passed config.
 * 
 * @param {BuildConfig} config 
 * @returns {HTMLElement}
 */
function build(config) {
    const { tag = "div", text, children, ...attributes } = config;
    const element = document.createElement(tag);
    element.update = () => {
        Object.keys(attributes).forEach(
            _handleBuildAttribute.bind({ element, attributes })
        );
        if (typeof text === "string") {
            element.innerText = text;
        } else if (typeof text === "function") {
            element.innerText = text();
        }
        if (Array.isArray(children)) {
            element.innerHTML = "";
            element.append(...children.map(child => typeof child === "function" ? child() : child));
        } else if (typeof children === "function") {
            element.innerHTML = "";
            element.append(...children().map(child => typeof child === "function" ? child() : child));
        }
    };
    element.update();
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
 * This function needs to have the element and attributes bound as context.
 *
 * @param {string} key
 * @returns {void}
 */
function _handleBuildAttribute(key) {
    if (key.startsWith("on") && typeof this.attributes[key] === "function") {
        if (key.toLowerCase() === "oncreate") {
            setTimeout(() => this.attributes[key](this.element));
            return;
        }
        if (key.toLowerCase() === "onvalue") {
            this.element.addEventListener(
                "input",
                (event) => this.attributes[key](event.target?.value)
            );
            return;
        }
        this.element.addEventListener(
            key.substring(2).toLowerCase(),
            this.attributes[key]
        );
    } else {
        this.element.setAttribute(key, typeof this.attributes[key] === "function" ? this.attributes[key]() : this.attributes[key]);
    }
}

module.exports = {
    Box,
    build,
    Form,
    Headline,
    Image,
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