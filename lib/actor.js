"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.newBasicReplier = void 0;
const Actor = __importStar(require("@yingyeothon/actor-system"));
const InMemoryActorSupport = __importStar(require("@yingyeothon/actor-system/lib/support/inmemory"));
const logger_1 = require("@yingyeothon/logger");
const mem_1 = __importDefault(require("mem"));
const actor_system_redis_support_1 = require("@yingyeothon/actor-system-redis-support");
const connection_1 = __importDefault(require("@yingyeothon/naive-redis/lib/connection"));
const line_1 = require("./line");
const logger = new logger_1.ConsoleLogger("debug");
const getRedisConnection = (0, mem_1.default)(() => {
    if (process.env.NODE_ENV === "test") {
        throw new Error();
    }
    return (0, connection_1.default)({
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD,
    });
});
const subsys = process.env.NODE_ENV === "test"
    ? {
        queue: new InMemoryActorSupport.InMemoryQueue(),
        lock: new InMemoryActorSupport.InMemoryLock(),
        awaiter: new InMemoryActorSupport.InMemoryAwaiter(),
        shift: () => logger.error(`Please check your lambda's lifetime`),
        logger,
    }
    : Object.assign(Object.assign({}, (0, actor_system_redis_support_1.newRedisSubsystem)({
        connection: getRedisConnection(),
        keyPrefix: "linebot",
        logger,
    })), { shift: () => logger.error(`Please check your lambda's lifetime`), logger });
class CommandActor {
    constructor(id, processor) {
        this.id = id;
        this.processor = processor;
        this.onPrepare = () => __awaiter(this, void 0, void 0, function* () { return this.processor.prepareContext(); });
        this.onCommit = () => __awaiter(this, void 0, void 0, function* () { return this.processor.storeContext(); });
        this.onMessage = ({ command, replyToken }) => __awaiter(this, void 0, void 0, function* () {
            const response = yield this.processor.processCommand(command);
            if (response) {
                yield (0, line_1.reply)(replyToken, response);
            }
        });
        this.onError = (error) => logger.error(`ActorError`, this.id, error);
    }
}
const newBasicReplier = (newProcessor) => (0, mem_1.default)((id) => {
    const processor = newProcessor(id);
    const env = Object.assign(Object.assign(Object.assign({}, Actor.singleConsumer), subsys), new CommandActor(id, processor));
    return (item, timeoutMillis = 30 * 1000) => Actor.send(env, {
        item,
        awaitPolicy: Actor.AwaitPolicy.Commit,
        awaitTimeoutMillis: timeoutMillis,
    }, {
        aliveMillis: timeoutMillis,
        oneShot: true,
        shiftable: true,
    });
});
exports.newBasicReplier = newBasicReplier;
//# sourceMappingURL=actor.js.map