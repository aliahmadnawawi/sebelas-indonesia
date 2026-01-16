import { IsNotEmpty } from "class-validator";

export class AddWhatsAppDto {
  @IsNotEmpty()
  phoneNumberId: string;

  @IsNotEmpty()
  wabaId: string;

  @IsNotEmpty()
  accessToken: string;

  @IsNotEmpty()
  webhookVerifyToken: string;
}
