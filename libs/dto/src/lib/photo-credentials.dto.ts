import { IsString, IsNotEmpty, MinLength, MaxLength, IsNumber } from "class-validator";

export class PhotoCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  title: string;

  @IsString()
  @MaxLength(200)
  description: string;
}