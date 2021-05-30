import { UserRoleEnum, LikeEnum, LanguageEnum } from './enums';

export interface JwtPayload {
  id: number;
  email: string;
  username: string;
  exp?: number;
  iat?: number;
  hasProfile: boolean;
}

export interface UserCredentialsI {
  email: string;
  username: string;
  password: string;
}

export interface UserRoI {
  id: number;
  email: string;
  password: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  is_active: boolean;
  role: UserRoleEnum;
  has_profile: boolean;
  user_profile_id: number;
}

export interface AuthCredentialsI {
  email: string;
  password: string;
}

export interface AuthRoI {
  accessToken: string;
}

export interface UserProfileCredentialsI {
  first_name: string;
  last_name: string;
  description: string;
  language_code?: LanguageEnum;
}

export interface UserProfileRoI {
  id: number;
  user_id: number;
  first_name: string;
  last_name: string;
  avatar: string;
  cover: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  user: UserRoI;
  albums: AlbumRoI[];
  language_code: LanguageEnum;
}

export interface AlbumCredentialsI {
  title: string;
  description: string;
  preview: string;
}

export interface AlbumRoI {
  id: number;
  user_id: number;
  user_profile_id: number;
  title: string;
  description: string;
  preview: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  photos: PhotoRoI[];
}

export interface PhotoCredentialsI {
  title: string;
  description: string;
}

export interface PhotoRoI {
  id: number;
  user_id: number;
  user_profile_id: number;
  album_id: number;
  image: string;
  filename: string;
  width: number;
  height: number;
  ratio: number;
  dimension: string;
  preview: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  user_avatar?: string;
  album_title?: string;
  album?: AlbumRoI;
  user_profile?: UserProfileRoI;
  likes?: LikeRoI[];
  comments?: CommentRoI[];
}

export interface CommentCredentialsI {
  text: string;
}

export interface CommentRoI {
  id: number;
  text: string;
  photo_id: number;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  user_profile_id: number;
  user_profile?: UserProfileRoI;
}

export interface LikeCredentialsI {
  status: LikeEnum;
}

export interface LikeRoI {
  id: number;
  photo_id: number;
  status: LikeEnum;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  user_profile_id: number;
  user_profile?: UserProfileRoI;
}
