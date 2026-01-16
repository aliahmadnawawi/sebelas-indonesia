import { IsOptional } from "class-validator";

export class UpdateStoreDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  status?: "ACTIVE" | "DISABLED";
}
