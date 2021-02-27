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

import { Auth } from '../entities';
import { AlbumCredentialsDto, AlbumRoDto } from '@photobook/dto';

import { AlbumService } from './album.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorators/get-user.decorator';

@Controller('album')
@UseGuards(JwtAuthGuard)
export class AlbumController {
  constructor(private readonly _albumService: AlbumService) {}

  @Get('/:user_profile_id')
  getAlbumsByUserId(@Param('user_profile_id', ParseIntPipe) user_profile_id: number): Promise<AlbumRoDto[]> {
    return this._albumService.getAll(user_profile_id);
  }

  @Get('/:user_profile_id/:album_id')
  getById(
    @Param('user_profile_id', ParseIntPipe) user_profile_id: number,
    @Param('album_id', ParseIntPipe) album_id: number,
    @GetUser() user: Auth
  ): Promise<AlbumRoDto> {
    return this._albumService.getById(user_profile_id, album_id);
  }

  @Post()
  @UseInterceptors(FileInterceptor('preview', {
    storage: memoryStorage()
  }))
  createAlbum(
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) albumCredentials: AlbumCredentialsDto,
    @GetUser() user: Auth
  ): Promise<AlbumRoDto> {
    return this._albumService.createAlbum(file, albumCredentials, user);
  }

  @Patch('/:album_id')
  @UseInterceptors(FileInterceptor('preview', {
    storage: memoryStorage()
  }))
  updateAlbum(
    @Param('album_id') album_id: number,
    @UploadedFile() file: Express.Multer.File,
    @Body(ValidationPipe) albumCredentials: AlbumCredentialsDto,
    @GetUser() user: Auth
  ): Promise<AlbumRoDto> {
    return this._albumService.updateAlbum(album_id, file, albumCredentials, user);
  }

  @Delete('/:album_id')
  delete(
    @Param('album_id', ParseIntPipe) album_id: number,
    @GetUser() user: Auth
  ): Promise<void> {
    return this._albumService.delete(album_id, user);
  }
}
