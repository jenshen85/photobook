import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhotoController } from './photo.controller';
import { PhotoService } from './photo.service';
import { PhotoRepository } from './photo.repository';
import { FileModule } from '../file/file.module';
import { AlbumModule } from '../album/album.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PhotoRepository]),
    AlbumModule,
    FileModule
  ],
  providers: [PhotoService],
  controllers: [PhotoController],
})
export class PhotoModule {}
