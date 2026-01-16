import { IsInt, IsNotEmpty, Min } from "class-validator";

export class AddCartItemDto {
  @IsNotEmpty()
  cartId: string;

  @IsNotEmpty()
  productId: string;

  @Min(1)
  @IsInt()
  qty: number;
}
