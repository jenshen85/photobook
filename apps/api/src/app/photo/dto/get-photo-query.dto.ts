import { IsNotEmpty, IsOptional } from 'class-validator';

export class GetPhotosQueryDto {
  @IsOptional()
  @IsNotEmpty()
  take?: number;

  @IsOptional()
  @IsNotEmpty()
  skip?: number;
}

export class PhotoQueryDto {
  @IsOptional()
  album_id: number;
}
