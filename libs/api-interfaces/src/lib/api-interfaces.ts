import 'multer';
import { Request, Response } from 'express';
import { User } from '@photobook/entities';

export type FileType = Express.Multer.File;

export interface JwtPayload {
  id: number;
  email: string;
  username: string;
  exp?: number;
  iat?: number;
}

export interface IRequest extends Request {
  user: User;
}

export interface IRequestFile extends IRequest {
  file: FileType;
  files: FileType[];
}

export interface IResponse extends Response {}

export const enum SpriteIconEnum {
  add = 'add',
  album = 'album',
  arrow_left = 'arrow_left',
  arrow_right = 'arrow_right',
  cam = 'cam',
  close = 'close',
  comments = 'comments',
  delete = 'delete',
  edit = 'edit',
  envelope = 'envelope',
  heart = 'heart',
  home = 'home',
  like = 'like',
  loupe = 'loupe',
  magnifying_glass = 'magnifying-glass',
  more = 'more',
  name = 'name',
  off = 'off',
  password = 'password',
  pencil = 'pencil',
  power = 'power',
  search = 'search',
  soc_email = 'soc_email',
  soc_fb = 'soc_fb',
  soc_google = 'soc_google',
  soc_twitter = 'soc_twitter',
  soc_vk = 'soc_vk',
  top = 'top',
}
