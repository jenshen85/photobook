import { IsNotEmpty, IsOptional } from "class-validator";

export class GetPhotosQueryDto {
  @IsOptional()
  @IsNotEmpty()
  take: number;

  @IsOptional()
  @IsNotEmpty()
  skip: number;
}