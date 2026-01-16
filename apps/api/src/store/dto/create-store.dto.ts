import { IsNotEmpty } from "class-validator";

export class CreateStoreDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  slug: string;
}
