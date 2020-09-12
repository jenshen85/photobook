import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { UserProfileService } from './user-profile.service';
import { UserProfileController } from './user-profile.controller';
import { UserProfileRepository } from './user-profile.repository';
import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserProfileRepository]),
    FileModule
  ],
  providers: [UserProfileService],
  controllers: [UserProfileController],
  exports: [UserProfileService]
})
export class UserProfileModule {}
