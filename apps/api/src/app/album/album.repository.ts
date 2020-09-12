import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Album, User } from '@photobook/entities';
import { AlbumCredentialsDto, AlbumRoDto } from '@photobook/dto';

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {
  async getAll(): Promise<AlbumRoDto[]> {
    const albums = await this.find();
    return albums.map((album) => plainToClass(AlbumRoDto, album));
  }

  async getAllUserAlbums(user_id: number): Promise<AlbumRoDto[]> {
    const albums = await this.find({where: { user_id }});
    return albums.map((album) => plainToClass(AlbumRoDto, album));
  }

  async getById(album_id: number): Promise<AlbumRoDto> {
    const album = await this.findOne({ where: { id: album_id } });

    if (!album) {
      throw new NotFoundException(`Album with ID "${album_id}" not found`);
    }

    return plainToClass(AlbumRoDto, album);
  }

  async getUserAlbumById(album_id: number, user: User): Promise<Album> {
    const found = await this.findOne({
      where: { id: album_id, user_id: user.id },
    });

    if (!found) {
      throw new NotFoundException(`Album with ID ${album_id} not found`);
    }

    return found;
  }

  async getWithDeleted(): Promise<Album[]> {
    const found = await this.find({ withDeleted: true });
    return found;
  }

  async createAlbum(
    albumCredentials: AlbumCredentialsDto,
    user: User
  ): Promise<AlbumRoDto> {
    const { title, description } = albumCredentials;
    const album = new Album();
    album.title = title;
    album.description = description;
    album.user_id = user.id;

    try {
      await album.save();
      return plainToClass(AlbumRoDto, album);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Album name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async updateAlbum(
    album_id: number,
    albumCredentials: AlbumCredentialsDto,
    user: User
  ): Promise<AlbumRoDto> {
    const { title, description, preview } = albumCredentials;
    const album = await this.getUserAlbumById(album_id, user);
    title && (album.title = title);
    description && (album.description = description);
    preview && (album.preview = preview);

    try {
      await album.save();
      return plainToClass(AlbumRoDto, album);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Album name already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async deleteAlbum(
    id: number,
    user: User /*, handler: (album: Album) => Promise<void>*/
  ): Promise<void> {
    const result = await this.getUserAlbumById(id, user);
    result.deleted_at = new Date();

    try {
      // await handler(result);
      await result.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
