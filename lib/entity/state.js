"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class EntityStateHolder {
    constructor(entityId, currentEntity, currentState, transform) {
        this.entityId = entityId;
        this.currentEntity = currentEntity;
        this.currentState = currentState;
        this.transform = transform;
    }
    update(entity) {
        this.currentEntity = entity;
    }
    transit(name, payload) {
        this.currentState = {
            name,
            payload
        };
    }
    ensureState(name) {
        if (this.currentState.name === name) {
            return this.currentState.payload;
        }
        return undefined;
    }
    get state() {
        return this.currentState;
    }
    get entity() {
        return this.currentEntity;
    }
    get t() {
        return this.transform(this.currentEntity);
    }
}
exports.EntityStateHolder = EntityStateHolder;
//# sourceMappingURL=state.js.map