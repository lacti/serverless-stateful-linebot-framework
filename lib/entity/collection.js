"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const filterByIndex = (index) => (each) => each.index === index;
class EntityElementExtension {
    constructor(entity, name) {
        this.entity = entity;
        this.name = name;
    }
    get elements() {
        return this.entity[this.name];
    }
    find(predicate) {
        return this.elements.find(predicate);
    }
    filter(predicate) {
        return this.elements.filter(predicate);
    }
    findByIndex(index) {
        return this.find(filterByIndex(index));
    }
    add(fields) {
        const insertId = Math.max(...this.elements.map(each => each.index), 0) + 1;
        const newTuple = Object.assign(Object.assign({}, fields), { index: insertId });
        this.elements.push(newTuple);
    }
    update(index, fields) {
        const arrayIndex = this.elements.findIndex(each => each.index === index);
        if (arrayIndex < 0) {
            return false;
        }
        this.elements[arrayIndex] = Object.assign(Object.assign({}, this.elements[arrayIndex]), fields);
        return true;
    }
    remove(index) {
        this.removeWhere(filterByIndex(index));
    }
    removeWhere(predicate) {
        this.entity[this.name] = this.elements.filter(each => !predicate(each));
    }
}
exports.EntityElementExtension = EntityElementExtension;
//# sourceMappingURL=collection.js.map