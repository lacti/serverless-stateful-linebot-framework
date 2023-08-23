"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleGetSetRepository = void 0;
const builder_1 = require("./builder");
class SimpleGetSetRepository {
    constructor({ prefix, id }) {
        this.id = id;
        this.internal = (0, builder_1.newInternalRepository)(prefix || "");
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internal.get(this.id);
        });
    }
    set(value) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internal.set(this.id, value);
        });
    }
    delete() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.internal.delete(this.id);
        });
    }
}
exports.SimpleGetSetRepository = SimpleGetSetRepository;
//# sourceMappingURL=simple.js.map