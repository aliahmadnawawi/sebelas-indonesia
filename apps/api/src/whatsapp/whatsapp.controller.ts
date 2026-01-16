import { Body, Controller, Get, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";
import { Public } from "../common/decorators/public.decorator";
import { WhatsAppService } from "./whatsapp.service";

@ApiTags("whatsapp")
@Public()
@Controller("whatsapp")
export class WhatsAppController {
  constructor(private whatsappService: WhatsAppService) {}

  @Get("webhook")
  verify(
    @Query("hub.mode") mode: string,
    @Query("hub.verify_token") token: string,
    @Query("hub.challenge") challenge: string
  ) {
    if (mode === "subscribe") {
      return this.whatsappService.verifyWebhook(token, challenge);
    }
    return "OK";
  }

  @Post("webhook")
  @Throttle({ limit: 60, ttl: 60 })
  handle(@Body() body: any) {
    return this.whatsappService.handleWebhook(body);
  }
}
