import { IsString, IsNotEmpty, MaxLength, IsOptional } from 'class-validator';
import { UserProfileCredentialsI } from '@photobook/data';

export class UserProfileCredentialsDto implements UserProfileCredentialsI {
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  first_name: string;

  @IsOptional()
  @MaxLength(20)
  last_name: string;

  @IsOptional()
  @MaxLength(300)
  description: string;
}
