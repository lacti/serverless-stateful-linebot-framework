"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const actor_1 = require("../actor");
const processor_1 = require("./processor");
class Toolkit {
    options(options) {
        return options;
    }
    newProcessorBuilder(options) {
        return (entityId) => new processor_1.CommandProcessor(options, entityId);
    }
    newActorGetter(options) {
        return actor_1.newBasicReplyActor(this.newProcessorBuilder(options));
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
                    result[state].push(Object.assign({}, routes[routeKey], { handler: handlers[routeKey] }));
                }
            }
        }
        return result;
    }
    typeOfContext() {
        throw new Error("Please use for this via `ReturnType<typeof method>`");
    }
}
exports.toolkit = () => new Toolkit();
//# sourceMappingURL=toolkit.js.map