import { CommentRoI, UserProfileRoI } from "@photobook/data";
import { Expose, Type } from "class-transformer";
import { UserProfileRODto } from "./user-profile-ro.dto";

export class CommentRoDto implements CommentRoI {
  @Expose()
  id: number;

  @Expose()
  photo_id: number;

  @Expose()
  user_profile_id: number;

  @Expose()
  text: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;

  deleted_at: Date;

  @Expose()
  @Type(() => UserProfileRODto)
  user_profile: UserProfileRoI;
}