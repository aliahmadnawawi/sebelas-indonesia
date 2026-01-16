import { Module } from "@nestjs/common";
import { TelegramController } from "./telegram.controller";
import { TelegramService } from "./telegram.service";
import { CartModule } from "../cart/cart.module";

@Module({
  imports: [CartModule],
  controllers: [TelegramController],
  providers: [TelegramService],
})
export class TelegramModule {}
