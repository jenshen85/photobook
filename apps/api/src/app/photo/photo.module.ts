import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PhotoRepository } from './photo.repository';
import { FileModule } from '../file/file.module';
import { EventModule } from '../event/event.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoRepository]),
    FileModule,
    EventModule,
  ],
  providers: [PhotoService],
  controllers: [PhotoController],
  exports: [PhotoService],
})
export class PhotoModule {
  constructor(private readonly _photoService: PhotoService) {
    this._photoService.patchPhotosInfo();
  }
}
