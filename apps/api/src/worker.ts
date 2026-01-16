import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { PaymentService } from "./payment/payment.service";
import { ConfigService } from "@nestjs/config";
import { createPaymentWorker } from "./payment/payment.queue";

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const paymentService = app.get(PaymentService);

  createPaymentWorker(configService, async (data) => {
    await paymentService.processWebhookJob(data);
  });
}

bootstrap();
