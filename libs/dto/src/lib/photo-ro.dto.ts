import 'reflect-metadata';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  AlbumRoI,
  CommentRoI,
  LikeRoI,
  PhotoRoI,
  UserProfileRoI,
} from '@photobook/data';
import { AlbumRoDto } from './album-ro.dto';
import { UserProfileRODto } from './user-profile-ro.dto';
import { LikeRoDto } from './like-ro.dto';
import { CommentRoDto } from './comment-ro.dto';

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
  filename: string;

  @Expose()
  width: number;

  @Expose()
  height: number;

  @Expose()
  ratio: number;

  @Expose()
  dimension: string;

  @Expose()
  preview: string;

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

  @Expose()
  @Type(() => AlbumRoDto)
  album: AlbumRoI;

  @Expose()
  @Type(() => UserProfileRODto)
  user_profile: UserProfileRoI;

  @Expose()
  @Type(() => LikeRoDto)
  likes: LikeRoI[];

  @Expose()
  @Type(() => CommentRoDto)
  comments: CommentRoI[];
}
