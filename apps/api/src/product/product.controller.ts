import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { TenantGuard } from "../common/guards/tenant.guard";
import { ProductService } from "./product.service";
import { CreateCategoryDto } from "./dto/create-category.dto";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { AddImageDto } from "./dto/add-image.dto";
import { UpdateStockDto } from "./dto/update-stock.dto";

@ApiTags("products")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, TenantGuard)
@Controller("stores/:storeId")
export class ProductController {
  constructor(private productService: ProductService) {}

  @Post("categories")
  createCategory(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Body() dto: CreateCategoryDto
  ) {
    return this.productService.createCategory(req.tenantId, storeId, dto);
  }

  @Get("categories")
  listCategories(@Req() req: any, @Param("storeId") storeId: string) {
    return this.productService.listCategories(req.tenantId, storeId);
  }

  @Post("products")
  createProduct(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Body() dto: CreateProductDto
  ) {
    return this.productService.createProduct(req.tenantId, storeId, dto);
  }

  @Get("products")
  listProducts(@Req() req: any, @Param("storeId") storeId: string) {
    return this.productService.listProducts(req.tenantId, storeId);
  }

  @Get("products/:productId")
  getProduct(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Param("productId") productId: string
  ) {
    return this.productService.getProduct(req.tenantId, storeId, productId);
  }

  @Patch("products/:productId")
  updateProduct(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Param("productId") productId: string,
    @Body() dto: UpdateProductDto
  ) {
    return this.productService.updateProduct(req.tenantId, storeId, productId, dto);
  }

  @Post("products/:productId/images")
  addImage(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Param("productId") productId: string,
    @Body() dto: AddImageDto
  ) {
    return this.productService.addImage(req.tenantId, storeId, productId, dto);
  }

  @Patch("products/:productId/stock")
  updateStock(
    @Req() req: any,
    @Param("storeId") storeId: string,
    @Param("productId") productId: string,
    @Body() dto: UpdateStockDto
  ) {
    return this.productService.updateStock(req.tenantId, storeId, productId, dto);
  }
}
