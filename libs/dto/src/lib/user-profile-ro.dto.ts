import { Exclude, Expose, Type } from 'class-transformer';
import {
  AlbumRoI,
  LanguageEnum,
  UserProfileRoI,
  UserRoI,
} from '@photobook/data';
import { UserRoDto } from './user-ro.dto';
import { AlbumRoDto } from './album-ro.dto';

@Exclude()
export class UserProfileRODto implements UserProfileRoI {
  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  first_name: string;

  @Expose()
  last_name: string;

  @Expose()
  avatar: string;

  @Expose()
  cover: string;

  @Expose()
  description: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  @Expose()
  language_code: LanguageEnum;

  deleted_at: Date;

  @Expose()
  @Type(() => UserRoDto)
  user: UserRoI;

  @Expose()
  @Type(() => AlbumRoDto)
  albums: AlbumRoI[];
}
