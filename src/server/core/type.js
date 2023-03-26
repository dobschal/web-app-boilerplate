function isNonEmptyString(value) {
    return typeof value === "string" && value.length > 0;
}

function expectType(obj, typeDef) {
    for (const key in typeDef) {
        if (Object.hasOwnProperty.call(typeDef, key)) {
            const type = typeDef[key];
            if (typeof obj[key] !== type) {
                throw new Error(`400 Expect property ${key} to be ${type}`);
            }
        }
    }
}

module.exports = { isNonEmptyString, expectType };