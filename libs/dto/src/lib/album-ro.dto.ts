import { Exclude, Expose, Type } from 'class-transformer';
import { PhotoRoDto } from './photo-ro.dto';
import { AlbumRoI, PhotoRoI, UserProfileRoI } from '@photobook/data';
import { UserProfileRODto } from './user-profile-ro.dto';

@Exclude()
export class AlbumRoDto implements AlbumRoI {
  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  user_profile_id: number;

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
  photos: PhotoRoI[];

  @Expose()
  @Type(() => UserProfileRODto)
  user_profile: UserProfileRoI;
}
