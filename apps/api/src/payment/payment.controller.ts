import { Body, Controller, Get, Param, Post, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { PaymentService } from "./payment.service";
import { Public } from "../common/decorators/public.decorator";
import { CreateInvoiceDto } from "./dto/create-invoice.dto";

@ApiTags("payments")
@Controller("payment")
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Get("providers")
  getProviders() {
    return this.paymentService.getAvailableProviders();
  }

  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, TenantGuard)
  @Post("create-invoice")
  createInvoice(
    @Req() req: any,
    @Body() body: CreateInvoiceDto
  ) {
    return this.paymentService.createInvoice(
      req.tenantId,
      body.orderId,
      body.providerCode,
      body.paymentMethod
    );
  }

  @Public()
  @Post("webhook/:provider")
  webhook(@Param("provider") provider: string, @Body() payload: any, @Req() req: any) {
    return this.paymentService.enqueueWebhook(provider, payload, req.headers);
  }
}
