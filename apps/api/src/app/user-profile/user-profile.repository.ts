import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Repository, EntityRepository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { User, UserProfile } from '@photobook/entities';
import { UserProfileCredentialsDto, UserProfileRODto } from '@photobook/dto';
import { IProfileFilesData } from './user-profile.service';

@EntityRepository(UserProfile)
export class UserProfileRepository extends Repository<UserProfile> {
  async createProfile(user: User): Promise<UserProfile> {
    let profile = await this.findOne({ where: { user_id: user.id } });

    if (profile) {
      throw new ConflictException('Profile exist for this user');
    } else {
      profile = new UserProfile();
      profile.user = user;

      try {
        await profile.save();
        return profile;
      } catch (error) {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async updateProfile(
    userProfileCredentials: UserProfileCredentialsDto,
    profileImages: IProfileFilesData,
    user: User
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

  async getProfileByUserId(user: User): Promise<UserProfileRODto> {
    try {
      const profile = await this.findOne({ where: { user_id: user.id } });

      if (!profile) {
        throw new ConflictException('Profile does not exists');
      }

      return plainToClass(UserProfileRODto, profile);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
