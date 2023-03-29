module.exports.Router = {
    routes: {},
    activeRoute: undefined,
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


    // TODO: clean up

    async go(path, pushState = true) {
        if (typeof this.activeRoute !== "undefined") {
            this.cache[this.activeRoute] = [...document.body.children];
        }
        document.body.innerHTML = "";
        let route = "*";
        let [pathWithoutQuery, query] = path.split("?");
        if (pathWithoutQuery.endsWith("/")) pathWithoutQuery = pathWithoutQuery.slice(0, -1);
        this.rawQuery = query;
        this.params = {};
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
        this.activeRoute = route;
        if (pushState) {
            window.history.pushState({}, "", route === "*" ? "/" : path);
        }
        if (this.cache[this.activeRoute]) {
            console.log("[Router] Use cached HTMLelements: ", this.activeRoute, this.cache[this.activeRoute]);
            document.body.append(...this.cache[this.activeRoute]);
            for (let child of document.body.children) {
                if (typeof child.update !== "function") continue;
                console.log("[Router] Update page on reopen: ", child);
                child.update();
            }
        } else {
            console.log("[Router] Import page module: ", this.activeRoute);
            await this.routes[this.activeRoute]();
        }
    }
};
