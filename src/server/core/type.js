function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
}

function expectType(obj, typeDef) {
    for (const key in typeDef) {
        if (Object.hasOwnProperty.call(typeDef, key)) {
            const type = typeDef[key];
            if (type === "email") {
                if (typeof obj[key] !== "string" || !obj[key].match(
                    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                )) {
                    throw new Error(`400 Expect property ${key} to be ${type}`);
                }
            }
            else if (typeof obj[key] !== type) {
                throw new Error(`400 Expect property ${key} to be ${type}`);
            }
        }
    }
}

module.exports = { isNonEmptyString, expectType };