import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';

import {
  UserCredentialsDto,
  UserRoDto,
  AuthCredentialsDto,
  AuthRoDto,
} from '@photobook/dto';
import { Auth } from '../entities';

import { AuthRepository } from './auth.repository';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth)
    private readonly _authRepository: AuthRepository,
    private readonly _jwtService: JwtService
  ) {}

  async singUp(userCredentials: UserCredentialsDto): Promise<UserRoDto> {
    return await this._authRepository.createUser(userCredentials);
  }

  async signIn(authCredentials: AuthCredentialsDto): Promise<AuthRoDto> {
    const payload = await this._authRepository.validateUserPassword(
      authCredentials
    );
    if (!payload) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const accessToken = this._jwtService.sign(payload);
    return { accessToken };
  }

  public async setHasProfile(
    user: Auth,
    user_profile_id: number
  ): Promise<UserRoDto> {
    return await this._authRepository.setHasProfile(user, user_profile_id);
  }

  async getAll(): Promise<UserRoDto[]> {
    return await this._authRepository.getAll();
  }

  async getUserById(id: number): Promise<UserRoDto> {
    return await this._authRepository.getUserById(id);
  }

  async deleteUser(user: Auth): Promise<void> {
    return await this._authRepository.deleteUser(user);
  }
}
