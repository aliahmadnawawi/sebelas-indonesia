import { IsInt, IsNotEmpty, IsOptional, IsString, Min } from "class-validator";

export class CreateProductDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  categoryId?: string;

  @IsNotEmpty()
  currency: string;

  @IsNotEmpty()
  @IsInt()
  @Min(1)
  amount: number;

  @IsOptional()
  sku?: string;

  @IsOptional()
  @IsInt()
  stockQty?: number;
}
