import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { AlbumCredentialsDto, AlbumRoDto } from '@photobook/dto';
import { User, Album } from '@photobook/entities';

import { AlbumRepository } from './album.repository';
import { FileService } from '../file/file.service';

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
    const pathToAlbumPreview = `images/${user.id}/albums/${album.id}/preview`;
    const savedImageData = await this._fileService.saveFile(
      file,
      pathToAlbumPreview,
      'preview'
    );
    return await this._albumRepository.updateAlbum(
      album.id,
      { ...albumCredentials, preview: savedImageData.imageUrl },
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
    const pathToAlbumPreview = `images/${user.id}/albums/${album_id}/preview`;
    await this._fileService.deleteFile(album.preview);
    const savedImageData = await this._fileService.saveFile(
      file,
      pathToAlbumPreview,
      'preview'
    );
    return this._albumRepository.updateAlbum(
      album_id,
      { ...albumCredentials, preview: savedImageData.imageUrl },
      user
    );
  }

  async getAll(): Promise<AlbumRoDto[]> {
    return await this._albumRepository.getAll();
  }

  async getAllUserAlbums(user_id: number): Promise<AlbumRoDto[]> {
    return await this._albumRepository.getAllUserAlbums(user_id);
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
