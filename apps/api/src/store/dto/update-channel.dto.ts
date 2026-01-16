import { IsOptional } from "class-validator";

export class UpdateChannelDto {
  @IsOptional()
  status?: "ACTIVE" | "DISABLED";
}
