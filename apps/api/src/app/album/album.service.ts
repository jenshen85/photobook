import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AlbumCredentialsDto, AlbumRoDto } from '@photobook/dto';
import { User, Album } from '../entities';

import { AlbumRepository } from './album.repository';
import { FileService, IFileData } from '../file/file.service';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumRepository)
    private readonly _albumRepository: AlbumRepository,
    private readonly _fileService: FileService
  ) {}

  async createAlbum(
    file: Express.Multer.File,
    albumCredentials: AlbumCredentialsDto,
    user: User
  ): Promise<AlbumRoDto> {
    const album = await this._albumRepository.createAlbum(
      albumCredentials,
      user
    );

    let savedImageData: IFileData;
    if(file) {
      const pathToAlbumPreview = `images/${user.id}/albums/${album.id}/preview`;
      savedImageData = await this._fileService.saveFile(
        file,
        pathToAlbumPreview,
        'preview'
      );
    }
    return await this._albumRepository.updateAlbum(
      album.id,
      { ...albumCredentials, preview: savedImageData && savedImageData.imageUrl },
      user
    );
  }

  async updateAlbum(
    album_id: number,
    file: Express.Multer.File,
    albumCredentials: AlbumCredentialsDto,
    user: User
  ): Promise<AlbumRoDto> {
    const album = await this._albumRepository.getById(album_id);
    let savedImageData: IFileData;
    if(file) {
      const pathToAlbumPreview = `images/${user.id}/albums/${album_id}/preview`;
      album.preview && await this._fileService.deleteFile(album.preview);
      savedImageData = await this._fileService.saveFile(
        file,
        pathToAlbumPreview,
        'preview'
      );
    }
    return this._albumRepository.updateAlbum(
      album_id,
      { ...albumCredentials, preview: savedImageData && savedImageData.imageUrl },
      user
    );
  }

  async getAll(user: User): Promise<AlbumRoDto[]> {
    return await this._albumRepository.getAll(user);
  }

  async getAlbumsByUserId(user_id: number): Promise<AlbumRoDto[]> {
    return await this._albumRepository.getAlbumsByUserId(user_id);
  }

  async getById(id: number): Promise<AlbumRoDto> {
    return await this._albumRepository.getById(id);
  }

  async getUserAlbumById(album_id: number, user: User): Promise<Album> {
    return await this._albumRepository.getUserAlbumById(album_id, user);
  }

  async delete(id: number, user: User): Promise<void> {
    return await this._albumRepository.deleteAlbum(
      id,
      user /*, async (album) => {
      await this.fileService.deleteFile(album.preview)
    }*/
    );
  }
}
