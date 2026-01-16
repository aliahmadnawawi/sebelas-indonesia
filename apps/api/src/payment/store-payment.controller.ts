import { Body, Controller, Get, Param, Put, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { PaymentService } from "./payment.service";
import { UpdateStoreProviderDto } from "./dto/update-store-provider.dto";

@ApiTags("store-payment-providers")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller("stores/:storeId/payment-providers")
export class StorePaymentController {
  constructor(private paymentService: PaymentService) {}

  @Get()
  list(@Req() req: any, @Param("storeId") storeId: string) {
    return this.paymentService.getStoreProviders(req.tenantId, storeId);
  }

  @Put(":code")
  update(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Param("code") code: string,
    @Body() dto: UpdateStoreProviderDto
  ) {
    return this.paymentService.upsertStoreProvider(req.tenantId, storeId, code, dto);
  }
}
