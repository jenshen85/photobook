import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AlbumCredentialsDto, AlbumRoDto } from '@photobook/dto';
import { Auth, Album } from '../entities';

import { AlbumRepository } from './album.repository';
import { FileService, IFileData } from '../file/file.service';
import { generateFileNameFromStr } from '../shared/utils/edit-file-name';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumRepository)
    private readonly _albumRepository: AlbumRepository,
    private readonly _fileService: FileService
  ) {}

  async getAll(user_profile_id: number): Promise<AlbumRoDto[]> {
    return await this._albumRepository.getAll(user_profile_id);
  }

  async getById(user_profile_id: number, album_id: number): Promise<AlbumRoDto> {
    return await this._albumRepository.getById(user_profile_id, album_id);
  }

  async createAlbum(
    file: Express.Multer.File,
    albumCredentials: AlbumCredentialsDto,
    user: Auth
  ): Promise<AlbumRoDto> {
    const album = await this._albumRepository.createAlbum(
      albumCredentials,
      user
    );

    let savedImageData: IFileData;
    if(file) {
      const pathToAlbumPreview = `images/${user.path_id}/albums/${album.id}`;
      savedImageData = await this._fileService.saveFile(
        file,
        pathToAlbumPreview,
        generateFileNameFromStr('preview')
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
    user: Auth
  ): Promise<AlbumRoDto> {
    const album = await this._albumRepository.getById(user.user_profile_id, album_id);
    let savedImageData: IFileData;
    if(file) {
      const pathToAlbumPreview = `images/${user.path_id}/albums/${album_id}`;
      album.preview && await this._fileService.deleteFile(album.preview);
      savedImageData = await this._fileService.saveFile(
        file,
        pathToAlbumPreview,
        generateFileNameFromStr('preview')
      );
    }
    return this._albumRepository.updateAlbum(
      album_id,
      { ...albumCredentials, preview: savedImageData && savedImageData.imageUrl },
      user
    );
  }

  async delete(id: number, user: Auth): Promise<void> {
    return await this._albumRepository.deleteAlbum(
      id,
      user /*, async (album) => {
      await this.fileService.deleteFile(album.preview)
    }*/
    );
  }
}
