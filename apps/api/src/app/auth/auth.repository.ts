import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { plainToClass } from 'class-transformer';

import {
  UserRoDto,
  UserCredentialsDto,
  AuthCredentialsDto,
} from '@photobook/dto';
import { JwtPayload } from '@photobook/data';

import { Auth } from '../entities';

@EntityRepository(Auth)
export class AuthRepository extends Repository<Auth> {
  async createUser(userCredentials: UserCredentialsDto): Promise<UserRoDto> {
    const { email, username, password } = userCredentials;
    const user = new Auth();
    user.email = email;
    user.username = username;
    user.password = await this.hashPassword(password);

    try {
      await user.save();
      return plainToClass(UserRoDto, user);
    } catch (error) {
      if (error.code === '23505') {
        //duplicate username
        throw new ConflictException('User already exists');
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async updateUser(
    userCredentials: UserCredentialsDto,
    user: Auth
  ): Promise<UserRoDto> {
    const { username } = userCredentials;
    const found = await this.getUser(user.id);
    found.username = username;

    try {
      await found.save();
      return plainToClass(UserRoDto, found);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAll(): Promise<UserRoDto[]> {
    const users = await this.find();
    return users.map((user) => plainToClass(UserRoDto, user));
  }

  async getUser(id: number): Promise<Auth> {
    const user = await this.findOne(id);
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async getUserById(id: number): Promise<UserRoDto> {
    const user = await this.getUser(id);
    return plainToClass(UserRoDto, user);
  }

  async deleteUser(user: Auth): Promise<void> {
    const found = await this.getUser(user.id);
    found.deleted_at = new Date();

    try {
      await found.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setHasProfile(user: Auth, user_profile_id: number): Promise<UserRoDto> {
    const found = await this.getUser(user.id);
    found.has_profile = true;
    found.user_profile_id = user_profile_id;

    try {
      await found.save();
      return plainToClass(UserRoDto, found);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async validateUserPassword(
    authCredentials: AuthCredentialsDto
  ): Promise<JwtPayload> {
    const { email, password } = authCredentials;
    const user = await this.findOne({ email });
    const hasProfile = user.has_profile;

    if (user && (await user.validatePassword(password))) {
      return { id: user.id, email, username: user.username, hasProfile };
    } else {
      return null;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }
}
