module.exports.Router = {
    routes: {},
    activePath: undefined,
    cache: {},
    beforeEach: undefined,
    rawQuery: undefined,
    params: {},

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
        this.go(window.location.pathname + window.location.search);
        window.addEventListener("popstate", () => this.go(window.location.pathname + window.location.search, false));
    },

    getQueryParams() {
        if (!this.rawQuery) return {};
        const parts = this.rawQuery.split("&");
        const queryParams = {};
        parts.forEach(pair => {
            const [key, value] = pair.split("=");
            queryParams[key] = value;
        });
        return queryParams;
    },

    async go(path, pushState = true) {
        this._clear();
        let route = "*";
        let [pathWithoutQuery, query] = path.split("?");
        if (pathWithoutQuery.endsWith("/")) pathWithoutQuery = pathWithoutQuery.slice(0, -1);
        this.rawQuery = query;
        this.params = {};
        this.activePath = path;
        Object.keys(this.routes).forEach(routeName => {
            const pathParts = pathWithoutQuery.split("/");
            const routeNameParts = routeName.split("/");
            if (pathParts.length !== routeNameParts.length) return;
            for (let i = 0; i < pathParts.length; i++) {
                if (routeNameParts[i].startsWith("{") && routeNameParts[i].endsWith("}")) {
                    const paramName = routeNameParts[i].slice(1, -1);
                    this.params[paramName] = pathParts[i];
                    continue;
                }
                if (pathParts[i] !== routeNameParts[i]) return;
            }
            route = routeName;
        });
        if (typeof this.beforeEach === "function") {
            const result = await this.beforeEach(route);
            if (!result) return;
        }
        if (pushState) {
            window.history.pushState({}, "", route === "*" ? "/" : path);
        }
        if (this.cache[path]) {
            return document.body.append(...this.cache[path]);
        }
        await this.routes[route]();
    },

    _clear() {
        if (typeof this.activePath !== "undefined") {
            this.cache[this.activePath] = [...document.body.children];
        }
        document.body.innerHTML = "";
    }

    // _parsePath(path) {
    //     let [_path, query] = path.split("?");
    //     this.rawQuery = query;
    //     console.log("Set query: ", query, _path);
    //     if (!this.routes[_path]) _path = "*";
    //     return _path;
    // }
};
