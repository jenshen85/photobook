import 'reflect-metadata';
import { Exclude, Expose, Type } from 'class-transformer';
import { PhotoUserRoDto } from './photo-user-ro.dto';
import { PhotoRoI } from '@photobook/data';
import { PhotoAlbumRoDto } from './photo-album-ro.dto';
import { UserProfileRODto } from './user-profile-ro.dto';

@Exclude()
export class PhotoRoDto implements PhotoRoI {
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

  @Expose()
  @Type(() => PhotoAlbumRoDto)
  album: PhotoAlbumRoDto;

  @Expose()
  @Type(() => UserProfileRODto)
  user_profile: UserProfileRODto;
}
