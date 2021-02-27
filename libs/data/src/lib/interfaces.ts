import { UserRoleEnum } from './enums';

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
  // user_profile: UserProfileRoI;
  // albums: AlbumRoI[];
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
  image_name: string;
  title: string;
  description: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date;
  user_avatar?: string;
  album_title?: string;
  // user: PhotoUserRoI;
  // album: PhotoAlbumRoI;
  // user_profile: UserProfileRoI;
}

export interface PhotoUserRoI {
  id: number;
  email: string;
  username: string;
  created_at: Date;
  updated_at: Date;
  is_active: boolean;
  role: UserRoleEnum;
}

export interface PhotoAlbumRoI {
  id: number;
  user_id: number;
  title: string;
  description: string;
  preview: string;
  created_at: Date;
  updated_at: Date;
}
