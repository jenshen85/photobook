import {
  Controller,
  UseGuards,
  Post,
  Body,
  ValidationPipe,
  Get,
  Param,
  ParseIntPipe,
  Delete,
  UseInterceptors,
  UploadedFile,
  Req,
  Patch,
  // Res,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';

import { User } from '../entities';
import { AlbumCredentialsDto, AlbumRoDto } from '@photobook/dto';

import { AlbumService } from './album.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorators/get-user.decorator';

@Controller('album')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private readonly _albumService: AlbumService) {}

  @Post()
  @UseInterceptors(FileInterceptor('preview', {
    storage: memoryStorage()
  }))
  createAlbum(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) albumCredentials: AlbumCredentialsDto,
    @GetUser() user: User
  ): Promise<AlbumRoDto> {
    return this._albumService.createAlbum(file, albumCredentials, user);
  }

  @Patch('/:id')
  @UseInterceptors(FileInterceptor('preview', {
    storage: memoryStorage()
  }))
  updateAlbum(
    @Param('id') album_id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) albumCredentials: AlbumCredentialsDto,
    @GetUser() user: User
  ): Promise<AlbumRoDto> {
    console.log(file);
    console.log(album_id);
    return this._albumService.updateAlbum(album_id, file, albumCredentials, user);
  }

  @Get()
  getAll(@GetUser() user: User): Promise<AlbumRoDto[]> {
    return this._albumService.getAll(user);
  }

  @Get('/:user_id')
  getAlbumsByUserId(@Param('user_id', ParseIntPipe) user_id: number): Promise<AlbumRoDto[]> {
    return this._albumService.getAlbumsByUserId(user_id);
  }

  @Get('/:user_id/:album_id')
  getById(
    @Param('user_id', ParseIntPipe) user_id: number,
    @Param('album_id', ParseIntPipe) album_id: number,
    @GetUser() user: User
  ): Promise<AlbumRoDto> {
    return this._albumService.getUserAlbumById(user_id, album_id);
  }

  @Delete('/:album_id')
  delete(
    @Param('album_id', ParseIntPipe) album_id: number,
    @GetUser() user: User
  ): Promise<void> {
    return this._albumService.delete(album_id, user);
  }
}
