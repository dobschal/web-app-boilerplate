export const Router = {
    routes: {},
    activePath: undefined,
    cache: {},

    /**
     * Initialise the router with your page routes. Where the
     * keys of the passed object are the paths and the values
     * are the import paths to the module to be loaded.
     * E.g. Router.init({ home: "./Home.js" });
     *
     * @param {{[string]: [string]}} r
     */
    init(r) {
        this.routes = r;
        this.go(window.location.pathname);
        window.addEventListener("popstate", () =>
            this.go(window.location.pathname, false)
        );
    },

    async go(path, pushState = true) {
        this._clear();
        this.activePath = this._parsePath(path);
        if (pushState) {
            window.history.pushState({}, "", this.activePath);
        }
        if (this.cache[this.activePath]) {
            return document.body.append(...this.cache[this.activePath]);
        }
        await this.routes[this.activePath]();
    },

    _clear() {
        if (typeof this.activePath !== "undefined") {
            this.cache[this.activePath] = [...document.body.children];
        }
        document.body.innerHTML = "";
    },

    _parsePath(path) {
        if (path.startsWith("/")) path = path.substring(1);
        if (!this.routes[path]) path = "root";
        return path;
    }
};
