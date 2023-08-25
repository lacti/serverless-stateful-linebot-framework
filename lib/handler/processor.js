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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommandProcessor = void 0;
const entity_1 = require("../entity");
const router_1 = require("./router");
const logger_1 = require("@yingyeothon/logger");
const repository_1 = require("../repository");
const fast_copy_1 = __importDefault(require("fast-copy"));
const fast_equals_1 = require("fast-equals");
const logger = new logger_1.ConsoleLogger("debug");
const pjson = (obj) => JSON.stringify(obj, null, 2);
class CommandProcessor {
    constructor(options, entityId) {
        this.options = options;
        this.entityId = entityId;
        this.prepareContext = () => __awaiter(this, void 0, void 0, function* () {
            const { initialEntity, initialState } = this.options;
            const tuple = yield this.repository.get();
            this.entity =
                !!tuple && !!tuple.entity ? tuple.entity : initialEntity(this.entityId);
            this.state = !!tuple && !!tuple.state ? tuple.state : initialState();
            this.oldEntity = (0, fast_copy_1.default)(this.entity);
            this.oldState = (0, fast_copy_1.default)(this.state);
        });
        this.storeContext = () => __awaiter(this, void 0, void 0, function* () {
            if (!(0, fast_equals_1.deepEqual)(this.oldEntity, this.entity) ||
                !(0, fast_equals_1.deepEqual)(this.oldState, this.state)) {
                const tuple = {
                    entity: this.entity,
                    state: this.state,
                };
                yield this.repository.set(tuple);
                this.oldEntity = (0, fast_copy_1.default)(this.entity);
                this.oldState = (0, fast_copy_1.default)(this.state);
            }
        });
        this.processCommand = (command) => __awaiter(this, void 0, void 0, function* () {
            const { decorateEntity = this.castEntityImplicit } = this.options;
            const holder = new entity_1.EntityStateHolder(this.entityId, this.entity, this.state, decorateEntity);
            logger.info(`Handle command[${command}] on state[${String(holder.state.name)}]`);
            logger.debug(`Entity[${pjson(this.entity)}], State[${pjson(this.state)}]`);
            const { routeHandlers } = this.options;
            const handler = (0, router_1.lookupHandler)(routeHandlers[holder.state.name], command);
            if (!handler) {
                logger.error(`No handler for a command[${command}]`);
                return null;
            }
            let response = handler(holder);
            if (response instanceof Promise) {
                response = yield response;
            }
            logger.debug(`Result of command[${command}]: ${response}`);
            logger.debug(`Entity[${pjson(this.entity)}], State[${pjson(this.state)}]`);
            this.entity = holder.entity;
            this.state = holder.state;
            return response;
        });
        this.castEntityImplicit = (entity) => entity;
        this.repository = new repository_1.SimpleGetSetRepository({
            id: entityId,
            prefix: options.bucketPrefix,
        });
    }
    truncate() {
        return __awaiter(this, void 0, void 0, function* () {
            const { initialEntity, initialState } = this.options;
            this.entity = this.oldEntity = initialEntity(this.entityId);
            this.state = this.oldState = initialState();
            yield this.repository.delete();
        });
    }
}
exports.CommandProcessor = CommandProcessor;
//# sourceMappingURL=processor.js.map