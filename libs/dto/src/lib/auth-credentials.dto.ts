import {
  IsString,
  IsEmail,
  // MinLength,
  // MaxLength,
  // Matches,
  IsNotEmpty,
} from 'class-validator';
import { AuthCredentialsI } from '@photobook/data';

export class AuthCredentialsDto implements AuthCredentialsI {
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  // @MinLength(8)
  // @MaxLength(20)
  // @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
  //   message: 'password too weak',
  // })
  password: string;
}
