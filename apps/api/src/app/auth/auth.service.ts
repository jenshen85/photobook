import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import {
  UserCredentialsDto,
  UserRoDto,
  AuthCredentialsDto,
  AuthRoDto,
} from '@photobook/dto';

import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly _userService: UserService,
    private readonly _jwtService: JwtService
  ) {}

  async singUp(userCredentials: UserCredentialsDto): Promise<UserRoDto> {
    return this._userService.createUser(userCredentials);
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<AuthRoDto> {
    const payload = await this._userService.validateUser(authCredentials);
    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this._jwtService.sign(payload);
    return { accessToken };
  }
}
