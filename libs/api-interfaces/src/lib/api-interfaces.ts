import 'multer';
import { Request, Response } from 'express';
import { User } from '@photobook/entities';

export type FileType = Express.Multer.File;

export interface JwtPayload {
  id: number;
  email: string;
  username: string;
}

export interface IRequest extends Request {
  user: User;
}

export interface IRequestFile extends IRequest {
  file: FileType;
  files: FileType[];
}

export interface IResponse extends Response {}
