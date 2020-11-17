import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsOptional,
} from 'class-validator';
import { AlbumCredentialsI } from '@photobook/data';

export class AlbumCredentialsDto implements AlbumCredentialsI {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  title: string;

  @IsString()
  @IsOptional()
  @MaxLength(200)
  description: string;

  @IsString()
  @IsOptional()
  preview: string;
}
