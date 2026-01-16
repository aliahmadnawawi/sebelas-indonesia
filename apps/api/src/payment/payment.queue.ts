import { Queue, Worker } from "bullmq";
import { ConfigService } from "@nestjs/config";
import { PAYMENT_WEBHOOK_QUEUE } from "./payment.constants";

export function createPaymentQueue(configService: ConfigService) {
  const connection = { url: configService.get<string>("REDIS_URL") };
  return new Queue(PAYMENT_WEBHOOK_QUEUE, { connection });
}

export function createPaymentWorker(
  configService: ConfigService,
  handler: (data: any) => Promise<void>
) {
  const connection = { url: configService.get<string>("REDIS_URL") };
  return new Worker(PAYMENT_WEBHOOK_QUEUE, async (job) => handler(job.data), {
    connection,
  });
}
