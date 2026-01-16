import { IsNotEmpty } from "class-validator";

export class CreateInvoiceDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  providerCode: string;

  paymentMethod?: string;
}
