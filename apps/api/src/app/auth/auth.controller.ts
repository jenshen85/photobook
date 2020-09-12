import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';

import { AuthService } from './auth.service';
import { UserCredentialsDto, AuthCredentialsDto } from '@photobook/dto';
import { UserRoDto, AuthRoDto } from '@photobook/dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('/signup')
  signUp(
    @Body(ValidationPipe) userCredentials: UserCredentialsDto
  ): Promise<UserRoDto> {
    return this._authService.singUp(userCredentials);
  }

  @Post('/signin')
  signIn(
    @Body(ValidationPipe) authCredentials: AuthCredentialsDto
  ): Promise<AuthRoDto> {
    return this._authService.signIn(authCredentials);
  }
}
