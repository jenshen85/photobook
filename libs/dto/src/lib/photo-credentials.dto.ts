import {
  IsString,
  IsNotEmpty,
  MinLength,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { PhotoCredentialsI } from '@photobook/data';

export class PhotoCredentialsDto implements PhotoCredentialsI {
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(20)
  title: string;

  @IsString()
  @MaxLength(200)
  description: string;
}
