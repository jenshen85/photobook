import { IsString, IsNotEmpty, MinLength, MaxLength, IsOptional } from "class-validator";

export class AlbumCredentialsDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description: string;

  @IsString()
  @IsOptional()
  preview: string;
}