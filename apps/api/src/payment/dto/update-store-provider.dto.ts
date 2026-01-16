import { IsBoolean, IsOptional } from "class-validator";

export class UpdateStoreProviderDto {
  @IsOptional()
  @IsBoolean()
  isEnabled?: boolean;

  @IsOptional()
  config?: Record<string, any>;
}
