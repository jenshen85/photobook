import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo, Auth } from '../entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { PhotoRepository } from './photo.repository';
import { FileService } from '../file/file.service';
// import { AlbumService } from '../album/album.service';
import { generateFileName } from '../shared/utils/edit-file-name';
import { GetPhotosQueryDto, PhotoQueryDto } from './dto/get-photo-query.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photoRepository: PhotoRepository,
    // private readonly _albumService: AlbumService,
    private readonly _fileService: FileService
  ) {}

  async getAll(getPhotosQuery: GetPhotosQueryDto): Promise<PhotoRoDto[]> {
    return this._photoRepository.getAll(getPhotosQuery);
  }

  async getAllAlbumPhoto(album_id: number): Promise<PhotoRoDto[]> {
    return this._photoRepository.getAllAlbumPhoto(album_id);
  }

  async getOne(photo_id: number): Promise<PhotoRoDto> {
    return await this._photoRepository.getOne(photo_id);
  }

  async getNext(photo_id: number, photoQuery: PhotoQueryDto): Promise<PhotoRoDto> {
    return await this._photoRepository.getNext(photo_id, photoQuery);
  }

  async getPrev(photo_id: number, photoQuery: PhotoQueryDto): Promise<PhotoRoDto> {
    return await this._photoRepository.getPrev(photo_id, photoQuery);
  }

  async createPhoto(
    album_id: number,
    file: Express.Multer.File,
    user: Auth
  ): Promise<PhotoRoDto> {
    const imageData = await this._fileService.saveFile(
      file,
      `images/${user.path_id}/albums/${album_id}/photos`,
      generateFileName(file)
    );

    const photo = await this._photoRepository.createPhoto(
      imageData,
      album_id,
      user
    );

    return photo;
  }

  async createPhotos(
    album_id: number,
    files: Express.Multer.File[],
    user: Auth
  ): Promise<PhotoRoDto[]> {
    const photos = await Promise.all(
      files.map(async (file) => {
        const imageData = await this._fileService.saveFile(
          file,
          `images/${user.path_id}/albums/${album_id}/photos`,
          generateFileName(file)
        );
        const photo = await this._photoRepository.createPhoto(
          imageData,
          album_id,
          user
        );
        return photo;
      })
    );

    return photos;
  }

  async updatePhoto(
    album_id: number,
    photo_id: number,
    photoCredentials: PhotoCredentialsDto,
  ): Promise<PhotoRoDto> {
    return await this._photoRepository.updatePhoto(album_id, photo_id, photoCredentials);
  }

  async deletePhoto(album_id: number, photo_id: number): Promise<void> {
    return await this._photoRepository.deletePhoto(album_id, photo_id);
  }
}
