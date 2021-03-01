import 'reflect-metadata';
import { Exclude, Expose, Type } from 'class-transformer';
// import { PhotoUserRoDto } from './photo-user-ro.dto';
import { AlbumRoI, PhotoRoI, UserProfileRoI, UserRoI } from '@photobook/data';
// import { PhotoAlbumRoDto } from './photo-album-ro.dto';
import { AlbumRoDto } from './album-ro.dto';
// import { PhotoAlbumRoDto } from './photo-album-ro.dto';
// import { UserProfileRODto } from './user-profile-ro.dto';

@Exclude()
export class PhotoRoDto implements PhotoRoI {
  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  user_profile_id: number;

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
  user_avatar?: string;

  @Expose()
  album_title?: string;

  // @Expose()
  // @Type(() => PhotoUserRoDto)
  // user: UserRoI;

  @Expose()
  @Type(() => AlbumRoDto)
  album: AlbumRoI;

  // @Expose()
  // @Type(() => UserProfileRODto)
  // user_profile: UserProfileRoI;
}
