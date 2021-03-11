import { IsNotEmpty } from "class-validator";
import { LikeCredentialsI, LikeEnum } from "@photobook/data";

export class LikeCredentialsDto implements LikeCredentialsI {
  @IsNotEmpty()
  status: LikeEnum;
}