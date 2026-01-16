import { Module } from "@nestjs/common";
import { CartController } from "./cart.controller";
import { CartService } from "./cart.service";
import { PaymentModule } from "../payment/payment.module";

@Module({
  imports: [PaymentModule],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
