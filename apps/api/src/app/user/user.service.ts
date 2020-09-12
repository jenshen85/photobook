import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToClass } from 'class-transformer';

import { UserCredentialsDto, AuthCredentialsDto } from '@photobook/dto';
import { JwtPayload } from '@photobook/api-interfaces';
import { UserRoDto } from '@photobook/dto';

import { User } from '@photobook/entities';
import { UserRepository } from './user.repository';
import { UserProfileService } from '../user-profile/user-profile.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly _userRepository: UserRepository,
    private readonly _userProfileService: UserProfileService
  ) {}

  async createUser(userCredentials: UserCredentialsDto): Promise<UserRoDto> {
    let user = await this._userRepository.createUser(userCredentials);
    const profile = await this._userProfileService.createUserProfile(user);
    user = await this._userRepository.setUserProfile(user, profile);
    return plainToClass(UserRoDto, user);
  }

  async getUsers(): Promise<UserRoDto[]> {
    return await this._userRepository.getUsers();
  }

  async getUserById(id: number): Promise<UserRoDto> {
    return await this._userRepository.getUserById(id);
  }

  async deleteUser(user: User): Promise<void> {
    return await this._userRepository.deleteUser(user);
  }

  async validateUser(
    authCredentials: AuthCredentialsDto,
  ): Promise<JwtPayload> {
    return await this._userRepository.validateUserPassword(authCredentials);
  }
}
