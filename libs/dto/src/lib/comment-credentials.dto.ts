import { IsNotEmpty } from "class-validator";
import { CommentCredentialsI } from "@photobook/data";

export class CommentCredentialsDto implements CommentCredentialsI {
  @IsNotEmpty()
  text: string;
}