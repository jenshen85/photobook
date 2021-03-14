import {
  Controller,
  UseGuards,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  UseInterceptors,
  ValidationPipe,
  UploadedFiles,
  Param,
  ParseIntPipe,
  UploadedFile,
  Query,
} from '@nestjs/common';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';

import { Auth } from '../entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { PhotoService } from './photo.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorators/get-user.decorator';
import { GetPhotosQueryDto, PhotoQueryDto } from './dto/get-photo-query.dto';

@Controller('photo')
@UseGuards(JwtAuthGuard)
export class PhotoController {
  constructor(private readonly _photoService: PhotoService) {}

  @Get()
  getAll(
    @Query(ValidationPipe) getPhotosQuery: GetPhotosQueryDto,
  ): Promise<PhotoRoDto[]> {
    return this._photoService.getAll(getPhotosQuery);
  }

  @Get('album/:album_id')
  getAllAlbumPhoto(
    @Param('album_id', ParseIntPipe) album_id: number
  ): Promise<PhotoRoDto[]> {
    return this._photoService.getAllAlbumPhoto(album_id);
  }

  @Get(':photo_id')
  getOne(@Param('photo_id', ParseIntPipe) photo_id: number): Promise<PhotoRoDto> {
    return this._photoService.getOne(photo_id);
  }

  @Get(':photo_id/next')
  getNext(
    @Param('photo_id', ParseIntPipe) photo_id: number,
    @Query(ValidationPipe) photoQuery: PhotoQueryDto,
  ): Promise<PhotoRoDto> {
    return this._photoService.getNext(photo_id, photoQuery);
  }

  @Get(':photo_id/prev')
  getPrev(
    @Param('photo_id', ParseIntPipe) photo_id: number,
    @Query(ValidationPipe) photoQuery: PhotoQueryDto,
  ): Promise<PhotoRoDto> {
    return this._photoService.getPrev(photo_id, photoQuery);
  }

  @Post(':album_id')
  @UseInterceptors(FileInterceptor('photo'))
  create(
    @Param('album_id', ParseIntPipe) album_id: number,
    @UploadedFile() photo: Express.Multer.File,
    @GetUser() user: Auth
  ): Promise<PhotoRoDto> {
    return this._photoService.createPhoto(album_id, photo, user);
  }

  @Post('photos/:album_id')
  @UseInterceptors(FilesInterceptor('photos'))
  createPhotos(
    @Param('album_id', ParseIntPipe) album_id: number,
    @UploadedFiles() photos: Express.Multer.File[],
    @GetUser() user: Auth
  ): Promise<PhotoRoDto[]> {
    return this._photoService.createPhotos(album_id, photos, user);
  }

  @Patch(':album_id/:photo_id')
  update(
    @Param('album_id', ParseIntPipe) album_id: number,
    @Param('photo_id', ParseIntPipe) photo_id: number,
    @Body() photoCredentials: PhotoCredentialsDto,
  ): Promise<PhotoRoDto> {
    return this._photoService.updatePhoto(album_id, photo_id, photoCredentials);
  }

  @Delete(':album_id/:photo_id')
  delete(
    @Param('album_id', ParseIntPipe) album_id: number,
    @Param('photo_id', ParseIntPipe) photo_id: number,
  ): Promise<void> {
    return this._photoService.deletePhoto(album_id, photo_id);
  }
}
