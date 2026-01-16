import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";

@Injectable()
export class OrderService {
  constructor(private prisma: PrismaService) {}

  async list(tenantId: string, storeId: string) {
    await this.ensureStore(tenantId, storeId);
    return this.prisma.order.findMany({
      where: { tenantId, storeId },
      include: { items: true, payment: true },
      orderBy: { createdAt: "desc" },
    });
  }

  async getById(tenantId: string, storeId: string, orderId: string) {
    await this.ensureStore(tenantId, storeId);
    const order = await this.prisma.order.findFirst({
      where: { tenantId, storeId, id: orderId },
      include: { items: true, payment: true },
    });
    if (!order) {
      throw new NotFoundException("Order not found");
    }
    return order;
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
