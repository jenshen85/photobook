import { Exclude, Expose, Type } from "class-transformer";
import { Photo } from '@photobook/entities'
import { PhotoRoDto } from './photo-ro.dto';

@Exclude()
export class AlbumRoDto {

  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  preview: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;

  @Expose()
  @Type(() => PhotoRoDto)
  photos: Photo[];
}