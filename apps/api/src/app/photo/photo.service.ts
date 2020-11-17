import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo, User } from '../entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { PhotoRepository } from './photo.repository';
import { FileService } from '../file/file.service';
import { AlbumService } from '../album/album.service';
import { generateFileName } from '../shared/utils/edit-file-name';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photoRepository: PhotoRepository,
    private readonly _albumService: AlbumService,
    private readonly _fileService: FileService
  ) {}

  async getAll(): Promise<PhotoRoDto[]> {
    return this._photoRepository.getAll();
  }

  async getAllAlbumPhoto(album_id: number): Promise<PhotoRoDto[]> {
    return this._photoRepository.getAllAlbumPhoto(album_id);
  }

  async getOne(photo_id: number): Promise<PhotoRoDto> {
    return await this._photoRepository.getOne(photo_id);
  }

  async createPhoto(
    album_id: number,
    files: Express.Multer.File[],
    user: User
  ): Promise<PhotoRoDto[]> {
    const album = await this._albumService.getUserAlbumById(album_id, user);
    const photos = await Promise.all(
      files.map(async (file) => {
        const imageData = await this._fileService.saveFile(
          file,
          `images/${user.id}/albums/${album_id}/photos`,
          generateFileName(file)
        );
        const photo = await this._photoRepository.createPhoto(
          imageData,
          album,
          user
        );
        return photo;
      })
    );

    return photos;
  }

  async updatePhoto(
    photo_id: number,
    photoCredentials: PhotoCredentialsDto,
    user: User
  ): Promise<PhotoRoDto> {
    return await this._photoRepository.updatePhoto(photo_id, photoCredentials, user);
  }

  async deletePhoto(photo_id: number, user: User): Promise<void> {
    return await this._photoRepository.deletePhoto(photo_id, user);
  }
}
