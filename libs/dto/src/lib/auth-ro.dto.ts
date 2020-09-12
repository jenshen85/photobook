import { IsString, IsNotEmpty } from 'class-validator';

export class AuthRoDto {
  @IsString()
  @IsNotEmpty()
  accessToken: string;
}
