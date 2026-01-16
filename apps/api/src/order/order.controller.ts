import { Controller, Get, Param, Req, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { OrderService } from "./order.service";

@ApiTags("orders")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller("stores/:storeId/orders")
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  list(@Req() req: any, @Param("storeId") storeId: string) {
    return this.orderService.list(req.tenantId, storeId);
  }

  @Get(":orderId")
  getById(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Param("orderId") orderId: string
  ) {
    return this.orderService.getById(req.tenantId, storeId, orderId);
  }
}
