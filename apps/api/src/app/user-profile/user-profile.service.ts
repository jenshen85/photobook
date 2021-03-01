import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Auth, UserProfile } from '../entities';
import { UserProfileCredentialsDto, UserProfileRODto } from '@photobook/dto';

import { UserProfileRepository } from './user-profile.repository';
import { FileService, IFileData } from '../file/file.service';
import { AuthService } from '../auth/auth.service';

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
    private readonly _authService: AuthService,
    private readonly _fileService: FileService
  ) {}

  async getMe(user: Auth): Promise<UserProfileRODto> {
    return await this._userProfileRepository.getMe(user);
  }

  async getUser(user_profile_id: number): Promise<UserProfileRODto> {
    return await this._userProfileRepository.getUserProfile(user_profile_id);
  }

  async createUserProfile(user: Auth, userProfileCredentials?: UserProfileCredentialsDto): Promise<UserProfileRODto> {
    const newUserProfile = await this._userProfileRepository.createProfile(user, userProfileCredentials);
    await this._authService.setHasProfile(user, newUserProfile.id);
    return newUserProfile;
  }

  async updateProfile(
    files: IProfileFiles,
    userProfileCredentials: UserProfileCredentialsDto,
    user: Auth
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
    user: Auth
  ): Promise<IProfileFilesData> {
    const profileFilesPath = `images/${user.path_id}/profile`;
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
