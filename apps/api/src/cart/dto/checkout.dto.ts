import { IsNotEmpty, IsOptional } from "class-validator";

export class CheckoutDto {
  @IsNotEmpty()
  cartId: string;

  @IsNotEmpty()
  paymentProvider: string;

  @IsOptional()
  paymentMethod?: string;
}
