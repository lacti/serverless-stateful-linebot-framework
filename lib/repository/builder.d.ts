import { InMemoryRepository } from "@yingyeothon/repository";
import { S3Repository } from "@yingyeothon/repository-s3";
export declare const newInternalRepository: (prefix: string) => InMemoryRepository | S3Repository;
