import { Module } from "@nestjs/common";
import { StorefrontController } from "./storefront.controller";
import { StorefrontService } from "./storefront.service";
import { CartModule } from "../cart/cart.module";

@Module({
  imports: [CartModule],
  controllers: [StorefrontController],
  providers: [StorefrontService],
})
export class StorefrontModule {}
