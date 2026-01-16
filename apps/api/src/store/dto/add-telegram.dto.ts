import { IsNotEmpty } from "class-validator";

export class AddTelegramDto {
  @IsNotEmpty()
  botToken: string;
}
