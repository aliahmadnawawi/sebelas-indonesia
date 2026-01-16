import {
  Body,
  Controller,
  Delete,
  Param,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { CartService } from "./cart.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { CheckoutDto } from "./dto/checkout.dto";

@ApiTags("cart")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller("stores/:storeId/cart")
export class CartController {
  constructor(private cartService: CartService) {}

  @Post()
  create(@Req() req: any, @Param("storeId") storeId: string, @Body() dto: CreateCartDto) {
    return this.cartService.createCart(req.tenantId, storeId, dto);
  }

  @Post("items")
  addItem(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Body() dto: AddCartItemDto
  ) {
    return this.cartService.addItem(req.tenantId, storeId, dto.cartId, dto);
  }

  @Delete("items/:itemId")
  removeItem(@Req() req: any, @Param("itemId") itemId: string) {
    return this.cartService.removeItem(req.tenantId, itemId);
  }

  @Post("checkout")
  checkout(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Body() dto: CheckoutDto
  ) {
    return this.cartService.checkout(
      req.tenantId,
      storeId,
      dto.cartId,
      dto.paymentProvider,
      dto.paymentMethod
    );
  }
}
