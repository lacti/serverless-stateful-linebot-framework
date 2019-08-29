"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const actor_system_1 = require("@yingyeothon/actor-system");
const actor_system_redis_support_1 = require("@yingyeothon/actor-system-redis-support");
const logger_1 = require("@yingyeothon/logger");
const ioredis_1 = __importDefault(require("ioredis"));
const mem_1 = __importDefault(require("mem"));
const line_1 = require("./line");
const logger = new logger_1.ConsoleLogger("debug");
const getRedis = mem_1.default(() => {
    if (process.env.NODE_ENV === "test") {
        throw new Error();
    }
    return new ioredis_1.default({
        host: process.env.REDIS_HOST,
        password: process.env.REDIS_PASSWORD
    });
});
exports.getSystem = mem_1.default(() => process.env.NODE_ENV === "test"
    ? new actor_system_1.ActorSystem({
        queue: new actor_system_1.InMemoryQueue(),
        lock: new actor_system_1.InMemoryLock(),
        logger
    })
    : new actor_system_1.ActorSystem({
        queue: new actor_system_redis_support_1.RedisQueue({ redis: getRedis(), logger }),
        lock: new actor_system_redis_support_1.RedisLock({ redis: getRedis(), logger }),
        logger
    }));
exports.newBasicReplyActor = (newProcessor) => (id) => {
    const processor = newProcessor(id);
    return exports.getSystem().spawn(id, actor => actor
        .on("beforeAct", processor.prepareContext)
        .on("afterAct", processor.storeContext)
        .on("act", ({ message: { command, replyToken } }) => __awaiter(this, void 0, void 0, function* () {
        const response = yield processor.processCommand(command);
        if (response) {
            yield line_1.reply(replyToken, response);
        }
    }))
        .on("error", error => logger.error(`ActorError`, id, error)));
};
//# sourceMappingURL=actor.js.map