import { IsOptional } from "class-validator";

export class UpdateProductDto {
  @IsOptional()
  name?: string;

  @IsOptional()
  description?: string;

  @IsOptional()
  status?: "ACTIVE" | "ARCHIVED";
}
