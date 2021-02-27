import {
  Controller,
  UseGuards,
  Body,
  Patch,
  UseInterceptors,
  Post,
  Get,
  ParseIntPipe,
  Param,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

import { Auth, UserProfile } from '../entities';
import { UserProfileCredentialsDto, UserProfileRODto } from '@photobook/dto';

import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorators/get-user.decorator';
import {
  UserProfileService,
  ProfileFilesFields,
  IProfileFiles,
} from './user-profile.service';
import { GetUserProfileFiles } from './decorators/get-user-profile-files.decorator';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class UserProfileController {
  constructor(private readonly _userProfileService: UserProfileService) {}

  @Get()
  getMe(@GetUser() user: Auth): Promise<UserProfileRODto> {
    return this._userProfileService.getMe(user);
  }

  @Get("/:user_profile_id")
  getUser(@Param('user_profile_id', ParseIntPipe) user_profile_id: number): Promise<UserProfileRODto> {
    return this._userProfileService.getUser(user_profile_id);
  }

  @Post()
  createProfile(
    @Body() userProfileCredentials: UserProfileCredentialsDto,
    @GetUser() user: Auth
  ): Promise<UserProfileRODto> {
    return this._userProfileService.createUserProfile(user, userProfileCredentials);
  }

  @Patch()
  @UseInterceptors(
    FileFieldsInterceptor([
      { name: ProfileFilesFields.avatar, maxCount: 1 },
      { name: ProfileFilesFields.cover, maxCount: 1 },
    ])
  )
  updateUserProfile(
    @GetUserProfileFiles() files: IProfileFiles,
    @Body() userProfileCredentials: UserProfileCredentialsDto,
    @GetUser() user: Auth
  ): Promise<UserProfileRODto> {
    return this._userProfileService.updateProfile(
      files,
      userProfileCredentials,
      user
    );
  }
}
