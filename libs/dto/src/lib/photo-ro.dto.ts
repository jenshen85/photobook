import { Exclude, Expose, Type } from "class-transformer";
import { PhotoUserRoDto } from './user-ro.dto';

@Exclude()
export class PhotoRoDto {
  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  album_id: number;

  @Expose()
  image: string;

  @Expose()
  image_name: string;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;

  @Expose()
  @Type(() => PhotoUserRoDto)
  user: PhotoUserRoDto;
}