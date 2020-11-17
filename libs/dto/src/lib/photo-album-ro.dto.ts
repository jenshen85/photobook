import 'reflect-metadata';
import { Exclude, Expose } from 'class-transformer';

import { PhotoAlbumRoI } from '@photobook/data';

@Exclude()
export class PhotoAlbumRoDto implements PhotoAlbumRoI {
  @Expose()
  id: number;

  @Expose()
  user_id: number;

  @Expose()
  title: string;

  @Expose()
  description: string;

  @Expose()
  preview: string;

  @Expose()
  created_at: Date;

  @Expose()
  updated_at: Date;
}
