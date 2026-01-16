import { IsNotEmpty, IsOptional } from "class-validator";

export class CreateInvoiceDto {
  @IsNotEmpty()
  orderId: string;

  @IsNotEmpty()
  providerCode: string;

  @IsOptional()
  paymentMethod?: string;
}
