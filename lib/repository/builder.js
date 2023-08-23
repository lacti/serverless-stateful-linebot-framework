"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newInternalRepository = void 0;
const repository_1 = require("@yingyeothon/repository");
const repository_s3_1 = require("@yingyeothon/repository-s3");
const mem_1 = __importDefault(require("mem"));
exports.newInternalRepository = (0, mem_1.default)((prefix) => process.env.NODE_ENV === "test"
    ? new repository_1.InMemoryRepository()
    : new repository_s3_1.S3Repository({
        bucketName: process.env.BUCKET_NAME,
        prefix,
    }));
//# sourceMappingURL=builder.js.map