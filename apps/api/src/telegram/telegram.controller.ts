import { Body, Controller, Headers, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { Public } from "../common/decorators/public.decorator";
import { TelegramService } from "./telegram.service";
import { ConfigService } from "@nestjs/config";

@ApiTags("telegram")
@Public()
@Controller("telegram")
export class TelegramController {
  constructor(
    private telegramService: TelegramService,
    private configService: ConfigService
  ) {}

  @Post("webhook/:botToken")
  @Throttle({ limit: 60, ttl: 60 })
  async webhook(
    @Param("botToken") botToken: string,
    @Body() body: any,
    @Headers("x-telegram-bot-api-secret-token") secretToken?: string
  ) {
    const expected = this.configService.get<string>("TELEGRAM_WEBHOOK_SECRET");
    if (expected && secretToken !== expected) {
      return { ok: false };
    }
    return this.telegramService.handleUpdate(botToken, body);
  }
}
