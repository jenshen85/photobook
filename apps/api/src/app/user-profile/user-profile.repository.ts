import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { Auth, UserProfile } from '../entities';
import { UserProfileCredentialsDto, UserProfileRODto } from '@photobook/dto';
import { IProfileFilesData } from './user-profile.service';

@EntityRepository(UserProfile)
export class UserProfileRepository extends Repository<UserProfile> {

  async getMe(user: Auth): Promise<UserProfileRODto> {
    const meProfile = await this.createQueryBuilder('user_profile')
      .where('user_profile.deleted_at IS NULL')
      .leftJoinAndSelect('user_profile.user', 'user')
      .where('user_profile.user_id = :user_id', { user_id: user.id })
      .getOne();

    if (!meProfile) {
      throw new NotFoundException('Profile does not exists');
    }

    return plainToClass(UserProfileRODto, meProfile);
  }

  async getUserProfile(user_profile_id: number): Promise<UserProfileRODto> {
    const profile = await this.findOne({where: {id: user_profile_id}, relations: ['user']});

    if (!profile) {
      throw new NotFoundException('Profile does not exists');
    }

    return plainToClass(UserProfileRODto, profile);
  }

  async createProfile(user: Auth, userProfileCredentials?: UserProfileCredentialsDto): Promise<UserProfileRODto> {
    let profile = await this.findOne({ where: { user_id: user.id } });

    if (profile) {
      throw new ConflictException('Profile exist for this user');
    } else {
      const { first_name, last_name, description } = userProfileCredentials;
      profile = new UserProfile();
      profile.user_id = user.id;
      first_name && (profile.first_name = first_name);
      last_name && (profile.last_name = last_name);
      description && (profile.description = description);

      try {
        await profile.save();
        return plainToClass(UserProfileRODto, profile);
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async updateProfile(
    userProfileCredentials: UserProfileCredentialsDto,
    profileImages: IProfileFilesData,
    user: Auth
  ): Promise<UserProfileRODto> {
    const { avatarUrl, coverUrl } = profileImages;
    const { first_name, last_name, description } = userProfileCredentials;
    const profile = await this.findOne({ where: { user_id: user.id } });

    if (!profile) {
      throw new ConflictException('Profile does not exists');
    }

    first_name && (profile.first_name = first_name);
    last_name && (profile.last_name = last_name);
    description && (profile.description = description);
    avatarUrl && (profile.avatar = avatarUrl);
    coverUrl && (profile.cover = coverUrl);

    try {
      await profile.save();
      return plainToClass(UserProfileRODto, profile);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getProfileByUserId(id: number): Promise<UserProfileRODto> {
    const profile = await this.findOne({ where: { user_id: id } });

    if (!profile) {
      throw new NotFoundException('Profile does not exists');
    }

    try {
      return plainToClass(UserProfileRODto, profile);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
