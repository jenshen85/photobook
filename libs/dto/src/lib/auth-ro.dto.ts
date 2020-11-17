import { IsString, IsNotEmpty } from 'class-validator';
import { AuthRoI } from '@photobook/data';

export class AuthRoDto implements AuthRoI {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
