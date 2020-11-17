import { Exclude, Expose } from 'class-transformer';
import { UserProfileRoI } from '@photobook/data';

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

  deleted_at: Date;
}
