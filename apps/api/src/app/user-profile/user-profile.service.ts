import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User, UserProfile } from '@photobook/entities';
import { UserProfileCredentialsDto, UserProfileRODto } from '@photobook/dto';

import { UserProfileRepository } from './user-profile.repository';
import { FileService, IFileData } from '../file/file.service';

export enum ProfileFilesFields {
  avatar = 'avatar',
  cover = 'cover',
}

export interface IProfileFiles {
  [ProfileFilesFields.avatar]: Express.Multer.File[];
  [ProfileFilesFields.cover]: Express.Multer.File[];
}

export interface IProfileFilesData {
  avatarUrl: string;
  coverUrl: string;
}

@Injectable()
export class UserProfileService {
  constructor(
    @InjectRepository(UserProfile)
    private readonly _userProfileRepository: UserProfileRepository,
    private readonly _fileService: FileService
  ) {}

  async createUserProfile(user: User): Promise<UserProfile> {
    return await this._userProfileRepository.createProfile(user);
  }

  async updateProfile(
    files: IProfileFiles,
    userProfileCredentials: UserProfileCredentialsDto,
    user: User
  ): Promise<UserProfileRODto> {
    const profileImages = await this.saveProfileFiles(files, user);
    return await this._userProfileRepository.updateProfile(
      userProfileCredentials,
      profileImages,
      user
    );
  }

  private async saveProfileFiles(
    files: IProfileFiles,
    user: User
  ): Promise<IProfileFilesData> {
    const profileFilesPath = `images/${user.id}/profile`;
    const avatar = files.avatar ? files.avatar[0] : null;
    const cover = files.cover ? files.cover[0] : null;
    let avatarData: IFileData, coverData: IFileData;

    if(avatar) {
      avatarData = await this._fileService.saveFile(
        avatar,
        profileFilesPath,
        avatar.fieldname
      );
    }

    if(cover) {
      coverData = await this._fileService.saveFile(
        cover,
        profileFilesPath,
        cover.fieldname
      );
    }

    return {
      avatarUrl: avatarData?.imageUrl,
      coverUrl: coverData?.imageUrl,
    };
  }
}
