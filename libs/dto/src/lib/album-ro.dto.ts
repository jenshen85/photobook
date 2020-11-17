import { Exclude, Expose, Type } from 'class-transformer';
import { PhotoRoDto } from './photo-ro.dto';
import { AlbumRoI } from '@photobook/data';

@Exclude()
export class AlbumRoDto implements AlbumRoI {
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
  photos: PhotoRoDto[];
}
