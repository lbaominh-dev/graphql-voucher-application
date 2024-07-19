import IORedis from "ioredis";

export enum QueueName {
  EMAIL = "emailQueue",
}

export const connection = new IORedis({
  maxRetriesPerRequest: null,
});
