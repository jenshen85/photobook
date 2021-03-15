import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlbumController } from './album.controller';
import { AlbumService } from './album.service';
import { AlbumRepository } from './album.repository';
import { FileModule } from '../file/file.module';
import { PhotoModule } from '../photo/photo.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlbumRepository]),
    FileModule,
    PhotoModule,
  ],
  controllers: [AlbumController],
  providers: [AlbumService],
  exports: [AlbumService],
})
export class AlbumModule {}
