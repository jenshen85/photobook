import 'reflect-metadata';
import { Exclude, Expose, Type } from 'class-transformer';

import { UserRoleEnum, PhotoUserRoI } from '@photobook/data';
import { UserProfileRODto } from './user-profile-ro.dto';

@Exclude()
export class PhotoUserRoDto implements PhotoUserRoI {
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
}
