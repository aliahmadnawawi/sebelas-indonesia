import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AddImageDto } from "./dto/add-image.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private async ensureStore(tenantId: string, storeId: string) {
    const store = await this.prisma.store.findFirst({
      where: { id: storeId, tenantId },
    });
    if (!store) {
      throw new NotFoundException("Store not found");
    }
  }

  async createCategory(tenantId: string, storeId: string, dto: CreateCategoryDto) {
    await this.ensureStore(tenantId, storeId);
    return this.prisma.category.create({
      data: { tenantId, storeId, name: dto.name, slug: dto.slug },
    });
  }

  async listCategories(tenantId: string, storeId: string) {
    await this.ensureStore(tenantId, storeId);
    return this.prisma.category.findMany({ where: { tenantId, storeId } });
  }

  async createProduct(tenantId: string, storeId: string, dto: CreateProductDto) {
    await this.ensureStore(tenantId, storeId);
    const product = await this.prisma.product.create({
      data: {
        tenantId,
        storeId,
        name: dto.name,
        slug: dto.slug,
        description: dto.description,
        categoryId: dto.categoryId,
      },
    });
    await this.prisma.price.create({
      data: {
        tenantId,
        productId: product.id,
        currency: dto.currency,
        amount: dto.amount,
      },
    });
    await this.prisma.inventory.create({
      data: {
        tenantId,
        productId: product.id,
        sku: dto.sku || `SKU-${product.slug}`.toUpperCase(),
        stockQty: dto.stockQty ?? 0,
      },
    });
    return product;
  }

  async listProducts(tenantId: string, storeId: string) {
    await this.ensureStore(tenantId, storeId);
    return this.prisma.product.findMany({
      where: { tenantId, storeId },
      include: { prices: true, inventory: true, images: true },
    });
  }

  async getProduct(tenantId: string, storeId: string, productId: string) {
    await this.ensureStore(tenantId, storeId);
    const product = await this.prisma.product.findFirst({
      where: { tenantId, storeId, id: productId },
      include: { prices: true, inventory: true, images: true },
    });
    if (!product) {
      throw new NotFoundException("Product not found");
    }
    return product;
  }

  async updateProduct(
    tenantId: string,
    storeId: string,
    productId: string,
    dto: UpdateProductDto
  ) {
    await this.getProduct(tenantId, storeId, productId);
    return this.prisma.product.update({
      where: { id: productId },
      data: dto,
    });
  }

  async addImage(
    tenantId: string,
    storeId: string,
    productId: string,
    dto: AddImageDto
  ) {
    await this.getProduct(tenantId, storeId, productId);
    return this.prisma.productImage.create({
      data: {
        tenantId,
        productId,
        url: dto.url,
      },
    });
  }

  async updateStock(
    tenantId: string,
    storeId: string,
    productId: string,
    dto: UpdateStockDto
  ) {
    await this.getProduct(tenantId, storeId, productId);
    return this.prisma.inventory.update({
      where: { productId },
      data: { stockQty: dto.stockQty },
    });
  }
}
