import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { Public } from "../common/decorators/public.decorator";
import { StorefrontService } from "./storefront.service";

@ApiTags("public-storefront")
@Public()
@Controller("public/stores")
export class StorefrontController {
  constructor(private storefrontService: StorefrontService) {}

  @Get(":slug")
  getStore(@Param("slug") slug: string) {
    return this.storefrontService.getStoreBySlug(slug.toLowerCase());
  }

  @Get(":slug/products")
  listProducts(@Param("slug") slug: string) {
    return this.storefrontService.listProductsBySlug(slug.toLowerCase());
  }

  @Get(":slug/products/:productId")
  getProduct(@Param("slug") slug: string, @Param("productId") productId: string) {
    return this.storefrontService.getProductBySlug(slug.toLowerCase(), productId);
  }

  @Post(":slug/cart")
  createCart(@Param("slug") slug: string) {
    return this.storefrontService.createCart(slug.toLowerCase());
  }

  @Post(":slug/cart/items")
  addItem(
    @Param("slug") slug: string,
    @Body() body: { cartId: string; productId: string; qty: number }
  ) {
    return this.storefrontService.addCartItem(
      slug.toLowerCase(),
      body.cartId,
      body.productId,
      body.qty
    );
  }

  @Get(":slug/cart/:cartId")
  getCart(@Param("slug") slug: string, @Param("cartId") cartId: string) {
    return this.storefrontService.getCart(slug.toLowerCase(), cartId);
  }

  @Post(":slug/checkout")
  checkout(
    @Param("slug") slug: string,
    @Body()
    body: { cartId: string; providerCode: string; paymentMethod?: string }
  ) {
    return this.storefrontService.checkout(
      slug.toLowerCase(),
      body.cartId,
      body.providerCode,
      body.paymentMethod
    );
  }
}
