"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.lookupHandler = void 0;
const lookupHandler = (routeHandlers, command) => {
    for (const { regex, parse, handler } of routeHandlers) {
        const match = command.match(regex);
        if (!!match) {
            const args = parse(match.slice(1));
            return (context) => handler(Object.assign({ context }, args));
        }
    }
    return null;
};
exports.lookupHandler = lookupHandler;
//# sourceMappingURL=router.js.map