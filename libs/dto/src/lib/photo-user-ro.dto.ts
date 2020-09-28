import "reflect-metadata";
import { Exclude, Expose, Type } from 'class-transformer';

import { UserRoleEnum } from '@photobook/enums';
import { UserProfileRODto } from './user-profile-ro.dto'

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