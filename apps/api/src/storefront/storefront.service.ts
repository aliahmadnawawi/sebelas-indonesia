import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CartService } from "../cart/cart.service";

@Injectable()
export class StorefrontService {
  constructor(private prisma: PrismaService, private cartService: CartService) {}

  async getStoreBySlug(slug: string) {
    const store = await this.prisma.store.findUnique({ where: { slug } });
    if (!store) {
      throw new NotFoundException("Store not found");
    }
    return store;
  }

  async listProductsBySlug(slug: string) {
    const store = await this.getStoreBySlug(slug);
    return this.prisma.product.findMany({
      where: { storeId: store.id, tenantId: store.tenantId, status: "ACTIVE" },
      include: { prices: true, images: true, inventory: true },
    });
  }

  async getProductBySlug(slug: string, productId: string) {
    const store = await this.getStoreBySlug(slug);
    const product = await this.prisma.product.findFirst({
      where: { id: productId, storeId: store.id, tenantId: store.tenantId },
      include: { prices: true, images: true, inventory: true },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async createCart(slug: string) {
    const store = await this.getStoreBySlug(slug);
    return this.cartService.createCart(store.tenantId, store.id, {
      channel: "WEB",
    });
  }

  async addCartItem(slug: string, cartId: string, productId: string, qty: number) {
    const store = await this.getStoreBySlug(slug);
    return this.cartService.addItem(store.tenantId, store.id, cartId, {
      cartId,
      productId,
      qty,
    });
  }

  async getCart(slug: string, cartId: string) {
    const store = await this.getStoreBySlug(slug);
    return this.cartService.getCart(store.tenantId, store.id, cartId);
  }

  async checkout(slug: string, cartId: string, providerCode: string, paymentMethod?: string) {
    const store = await this.getStoreBySlug(slug);
    return this.cartService.checkout(
      store.tenantId,
      store.id,
      cartId,
      providerCode,
      paymentMethod
    );
  }
}
