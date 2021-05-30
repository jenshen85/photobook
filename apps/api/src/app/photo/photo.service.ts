import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { Photo, Auth } from '../entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { PhotoRepository } from './photo.repository';
import { FileService } from '../file/file.service';
import { generateFileName } from '../shared/utils/edit-file-name';
import { GetPhotosQueryDto, PhotoQueryDto } from './dto/get-photo-query.dto';

@Injectable()
export class PhotoService {
  constructor(
    @InjectRepository(Photo)
    private readonly _photoRepository: PhotoRepository,
    private readonly _fileService: FileService
  ) {}

  async getAll(getPhotosQuery: GetPhotosQueryDto): Promise<PhotoRoDto[]> {
    return this._photoRepository.getAll(getPhotosQuery);
  }

  async getAllAlbumPhoto(
    album_id: number,
    getPhotosQuery?: GetPhotosQueryDto
  ): Promise<PhotoRoDto[]> {
    return this._photoRepository.getAllAlbumPhoto(album_id, getPhotosQuery);
  }

  async getOne(photo_id: number): Promise<PhotoRoDto> {
    return await this._photoRepository.getOne(photo_id);
  }

  async getNext(
    photo_id: number,
    photoQuery: PhotoQueryDto
  ): Promise<PhotoRoDto> {
    return await this._photoRepository.getNext(photo_id, photoQuery);
  }

  async getPrev(
    photo_id: number,
    photoQuery: PhotoQueryDto
  ): Promise<PhotoRoDto> {
    return await this._photoRepository.getPrev(photo_id, photoQuery);
  }

  async createPhoto(
    album_id: number,
    file: Express.Multer.File,
    user: Auth
  ): Promise<PhotoRoDto> {
    const photoPath = `images/${user.path_id}/albums/${album_id}/photos`;
    const photoName = generateFileName(file);
    const imageData = await this._fileService.saveFile(
      file,
      photoPath,
      photoName
    );

    const imagePreview = await this._fileService.savePreview(
      photoPath,
      imageData.fileName
    );

    const photo = await this._photoRepository.createPhoto(
      imageData,
      imagePreview,
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
        return await this.createPhoto(album_id, file, user);
      })
    );
    return photos;
  }

  async updatePhoto(
    album_id: number,
    photo_id: number,
    photoCredentials: PhotoCredentialsDto
  ): Promise<PhotoRoDto> {
    return await this._photoRepository.updatePhoto(
      album_id,
      photo_id,
      photoCredentials
    );
  }

  async deletePhoto(album_id: number, photo_id: number): Promise<void> {
    return await this._photoRepository.deletePhoto(album_id, photo_id);
  }

  async deleteAlbumPhotos(album_id: number): Promise<void> {
    await this._photoRepository.deleteAlbumPhotos(album_id);
  }

  async patchPhotosInfo(): Promise<void> {
    const photos = await this._photoRepository.find({ withDeleted: true });
    try {
      await Promise.all(
        photos.map(async (photo) => {
          const needPatch = !(
            photo.filename &&
            photo.preview &&
            photo.width &&
            photo.height &&
            photo.ratio &&
            photo.dimension
          );

          if (needPatch) {
            const photoInfo = await this._fileService.getPhotoInfo(photo.image);
            const filename = photo.image.split('/').pop();
            let imagePreview = null;

            if (!photo.preview) {
              imagePreview = await this._fileService.savePreview(
                photo.image.replace(`/${filename}`, ''),
                filename
              );
            }

            await this._photoRepository.patchPhotoInfo(
              photo,
              photoInfo,
              filename,
              imagePreview
            );
          }
        })
      );
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
