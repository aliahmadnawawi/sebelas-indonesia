import { IsNotEmpty } from "class-validator";

export class CheckoutDto {
  @IsNotEmpty()
  cartId: string;

  @IsNotEmpty()
  paymentProvider: string;

  paymentMethod?: string;
}
