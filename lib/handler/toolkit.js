"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toolkit = void 0;
const processor_1 = require("./processor");
const actor_1 = require("../actor");
class Toolkit {
    options(options) {
        return options;
    }
    newProcessorBuilder(options) {
        return (entityId) => new processor_1.CommandProcessor(options, entityId);
    }
    newReplierGenerator(options) {
        return (0, actor_1.newBasicReplier)(this.newProcessorBuilder(options));
    }
    routes(routes) {
        return routes;
    }
    partialStateRoutes(routes) {
        return routes;
    }
    stateRoutes(routes) {
        return routes;
    }
    handlers(handlers) {
        return handlers;
    }
    partialStateHandlers(handlers) {
        return handlers;
    }
    stateHandlers(handlers) {
        return handlers;
    }
    routeHandlers(mapOfRoutes, mapOfHandlers) {
        const result = {};
        for (const groupKey of Object.keys(mapOfRoutes)) {
            const group = groupKey;
            const stateRoutes = mapOfRoutes[group];
            const stateHandlers = mapOfHandlers[group];
            for (const stateKey of Object.keys(stateRoutes)) {
                const state = stateKey;
                if (!result[state]) {
                    result[state] = [];
                }
                const routes = stateRoutes[state];
                const handlers = stateHandlers[state];
                for (const routeKey of Object.keys(routes)) {
                    result[state].push(Object.assign(Object.assign({}, routes[routeKey]), { handler: handlers[routeKey] }));
                }
            }
        }
        return result;
    }
    typeOfContext() {
        throw new Error("Please use for this via `ReturnType<typeof method>`");
    }
}
const toolkit = () => new Toolkit();
exports.toolkit = toolkit;
//# sourceMappingURL=toolkit.js.map