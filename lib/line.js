"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const line = __importStar(require("@line/bot-sdk"));
const logger_1 = require("@yingyeothon/logger");
const logger = new logger_1.ConsoleLogger("info");
const lineConfig = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
    channelSecret: process.env.CHANNEL_SECRET
};
const lineClient = new line.Client(lineConfig);
exports.installWebhook = (handler) => (gatewayEvent) => __awaiter(this, void 0, void 0, function* () {
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
exports.reply = (replyToken, response) => {
    const texts = splitResponseByProperLength(response);
    return lineClient.replyMessage(replyToken, texts.map(text => ({
        type: "text",
        text
    })));
};
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