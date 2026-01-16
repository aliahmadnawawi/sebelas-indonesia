import { Module } from "@nestjs/common";
import { PaymentService } from "./payment.service";
import { PaymentController } from "./payment.controller";
import { StorePaymentController } from "./store-payment.controller";

@Module({
  providers: [PaymentService],
  controllers: [PaymentController, StorePaymentController],
  exports: [PaymentService],
})
export class PaymentModule {}
