import { Exclude, Expose, Type } from 'class-transformer';

import { UserRoleEnum } from '@photobook/enums';
import { UserProfileRODto } from './user-profile-ro.dto'
import { AlbumRoDto } from './album-ro.dto';

@Exclude()
export class UserRoDto {
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
  @Type(() => UserProfileRODto)
  user_profile: UserProfileRODto;

  @Expose()
  @Type(() => AlbumRoDto)
  albums: AlbumRoDto[];
}

@Exclude()
export class PhotoUserRoDto {
  @Expose()
  id: number;

  @Expose()
  email: string;

  @Expose()
  username: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  is_active: boolean;

  @Expose()
  role: UserRoleEnum;

  @Expose()
  @Type(() => UserProfileRODto)
  user_profile: UserProfileRODto;
}
