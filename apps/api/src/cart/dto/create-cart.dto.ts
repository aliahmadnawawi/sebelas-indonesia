import { IsEnum } from "class-validator";
import { ChannelType } from "@prisma/client";

export class CreateCartDto {
  @IsEnum(ChannelType)
  channel: ChannelType;
}
