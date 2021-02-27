import 'reflect-metadata';
import { Exclude, Expose } from 'class-transformer';

import { UserRoleEnum, UserRoI } from '@photobook/data';
// import { UserProfileRODto } from './user-profile-ro.dto';
// import { AlbumRoDto } from './album-ro.dto';

@Exclude()
export class UserRoDto implements UserRoI {
  @Expose()
  id: number;

  @Expose()
  email: string;

  password: string;

  @Expose()
  username: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;

  @Expose()
  is_active: boolean;

  @Expose()
  role: UserRoleEnum;

  @Expose()
  has_profile: boolean;

  @Expose()
  user_profile_id: number;

  // @Expose()
  // @Type(() => UserProfileRODto)
  // user_profile: UserProfileRODto;

  // @Expose()
  // @Type(() => AlbumRoDto)
  // albums: AlbumRoDto[];
}
