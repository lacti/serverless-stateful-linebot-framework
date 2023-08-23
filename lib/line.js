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
Object.defineProperty(exports, "__esModule", { value: true });
exports.reply = exports.installWebhook = void 0;
const line = __importStar(require("@line/bot-sdk"));
const logger_1 = require("@yingyeothon/logger");
const logger = new logger_1.ConsoleLogger("info");
const lineConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET,
};
const lineClient = new line.Client(lineConfig);
const installWebhook = (handler) => (gatewayEvent) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const signature = gatewayEvent.headers["X-Line-Signature"];
        if (!signature) {
            throw new line.SignatureValidationFailed("no signature");
        }
        const body = gatewayEvent.body;
        if (!line.validateSignature(body, lineConfig.channelSecret, signature)) {
            throw new line.SignatureValidationFailed("signature validation failed", signature);
        }
        let lineEvents;
        try {
            lineEvents = JSON.parse(body);
            logger.debug(`EventFromLine`, JSON.stringify(lineEvents, null, 2));
        }
        catch (err) {
            throw new line.JSONParseError(err.message, body);
        }
        for (const lineEvent of lineEvents.events) {
            const sourceId = lineEvent.source.roomId ||
                lineEvent.source.groupId ||
                lineEvent.source.userId;
            if (lineEvent.type === "message" && lineEvent.message.type === "text") {
                yield handler(sourceId, (lineEvent.message.text || "").trim(), lineEvent.replyToken);
            }
        }
        return { statusCode: 200, body: "OK" };
    }
    catch (error) {
        logger.error(error);
        return { statusCode: 500, body: error.message || "FAIL" };
    }
});
exports.installWebhook = installWebhook;
const reply = (replyToken, response) => {
    const texts = splitResponseByProperLength(response);
    return lineClient.replyMessage(replyToken, texts.map((text) => ({
        type: "text",
        text,
    })));
};
exports.reply = reply;
const splitResponseByProperLength = (response) => {
    const maxLength = 1900;
    const result = [];
    let length = 0;
    let buffer = [];
    for (const text of response.split(/\n/)) {
        if (length > 0 && length + text.length > maxLength) {
            result.push(buffer.join("\n"));
            buffer = [];
            length = 0;
        }
        buffer.push(text);
        length += text.length;
    }
    if (buffer.length > 0) {
        result.push(buffer.join("\n"));
    }
    return result;
};
//# sourceMappingURL=line.js.map