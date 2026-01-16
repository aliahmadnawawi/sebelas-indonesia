import { IsNotEmpty } from "class-validator";

export class AddImageDto {
  @IsNotEmpty()
  url: string;
}
