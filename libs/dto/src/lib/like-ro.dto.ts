import { LikeEnum, LikeRoI, UserProfileRoI } from "@photobook/data";
import { Expose, Type } from "class-transformer";
import { UserProfileRODto } from "./user-profile-ro.dto";

export class LikeRoDto implements LikeRoI {
  @Expose()
  id: number;

  @Expose()
  photo_id: number;

  @Expose()
  user_profile_id: number;

  @Expose()
  status: LikeEnum;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;

  @Expose()
  @Type(() => UserProfileRODto)
  user_profile: UserProfileRoI;
}