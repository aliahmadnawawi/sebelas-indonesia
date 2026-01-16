import { IsInt, IsNotEmpty } from "class-validator";

export class UpdateStockDto {
  @IsNotEmpty()
  @IsInt()
  stockQty: number;
}
