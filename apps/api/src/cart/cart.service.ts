import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCartDto } from "./dto/create-cart.dto";
import { AddCartItemDto } from "./dto/add-cart-item.dto";
import { PaymentService } from "../payment/payment.service";

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private paymentService: PaymentService
  ) {}

  async createCart(tenantId: string, storeId: string, dto: CreateCartDto) {
    await this.ensureStore(tenantId, storeId);
    return this.prisma.cart.create({
      data: { tenantId, storeId, channel: dto.channel },
    });
  }

  async addItem(
    tenantId: string,
    storeId: string,
    cartId: string,
    dto: AddCartItemDto
  ) {
    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId, tenantId, storeId, status: "ACTIVE" },
    });
    if (!cart) {
      throw new NotFoundException("Cart not found");
    }
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, tenantId, storeId: cart.storeId },
      include: { prices: true, inventory: true },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    if (product.inventory && product.inventory.stockQty < dto.qty) {
      throw new BadRequestException("Insufficient stock");
    }
    const price = product.prices[0];
    if (!price) {
      throw new BadRequestException("Product price not set");
    }
    return this.prisma.cartItem.create({
      data: {
        tenantId,
        cartId,
        productId: product.id,
        qty: dto.qty,
        priceAtAdd: price.amount,
      },
    });
  }

  async removeItem(tenantId: string, cartItemId: string) {
    const item = await this.prisma.cartItem.findFirst({
      where: { id: cartItemId, tenantId },
    });
    if (!item) {
      throw new NotFoundException("Cart item not found");
    }
    return this.prisma.cartItem.delete({ where: { id: cartItemId } });
  }

  async checkout(
    tenantId: string,
    storeId: string,
    cartId: string,
    paymentProvider: string,
    paymentMethod?: string
  ) {
    const cart = await this.prisma.cart.findFirst({
      where: { id: cartId, tenantId, storeId, status: "ACTIVE" },
      include: { items: true, store: true },
    });
    if (!cart || cart.items.length === 0) {
      throw new BadRequestException("Cart is empty");
    }
    const totalAmount = cart.items.reduce(
      (sum, item) => sum + item.priceAtAdd * item.qty,
      0
    );
    const order = await this.prisma.order.create({
      data: {
        tenantId,
        storeId: cart.storeId,
        channel: cart.channel,
        status: "PENDING_PAYMENT",
        totalAmount,
        currency: cart.store.currency,
        items: {
          create: cart.items.map((item) => ({
            tenantId,
            productId: item.productId,
            qty: item.qty,
            priceAtOrder: item.priceAtAdd,
          })),
        },
      },
    });
    await this.prisma.cart.update({
      where: { id: cartId },
      data: { status: "CHECKED_OUT" },
    });
    const payment = await this.paymentService.createInvoice(
      tenantId,
      order.id,
      paymentProvider,
      paymentMethod
    );
    return { order, payment };
  }

  private async ensureStore(tenantId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: { tenantId, id: storeId },
    });
    if (!store) {
      throw new NotFoundException("Store not found");
    }
  }
}
