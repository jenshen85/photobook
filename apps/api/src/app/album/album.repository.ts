import { Repository, EntityRepository } from 'typeorm';
import {
  ConflictException,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Album, Auth } from '../entities';
import { AlbumCredentialsDto, AlbumRoDto } from '@photobook/dto';

@EntityRepository(Album)
export class AlbumRepository extends Repository<Album> {

  async getAll(user_profile_id: number): Promise<AlbumRoDto[]> {
    const albums = await this.find({where: { user_profile_id }});
    return albums.map((album) => plainToClass(AlbumRoDto, album));
  }

  async getById(user_profile_id: number, album_id: number): Promise<AlbumRoDto> {
    const album = await this.createQueryBuilder('album')
      .leftJoinAndSelect('album.user_profile', 'user_profile')
      .where('album.user_profile_id = :user_profile_id', { user_profile_id })
      .andWhere('album.id = :album_id', { album_id })
      .leftJoinAndSelect('album.photos', 'photo')
      // .from((subQuery) => {
      //   return subQuery
      //     .innerJoinAndSelect('photos', 'photo')
      // }, 'photo')
      .getOne();

    if (!album) {
      throw new NotFoundException(`Album with ID "${album_id}" not found`);
    }

    return plainToClass(AlbumRoDto, album);
  }

  // async getUserAlbumById(user_id: number, album_id: number): Promise<AlbumRoDto> {
  //   const found = await this.findOne({
  //     where: { id: album_id, user_id: user_id },
  //   });

  //   if (!found) {
  //     throw new NotFoundException(`Album with ID ${album_id} not found`);
  //   }

  //   return plainToClass(AlbumRoDto, found);
  // }

  async getWithDeleted(): Promise<Album[]> {
    const found = await this.find({ withDeleted: true });
    return found;
  }

  async getOne(id: number): Promise<Album> {
    const found = await this.findOne({ where: { id } });

    if (!found) {
      throw new NotFoundException(`Album with ID ${id} not found`);
    }

    return found;
  }

  async createAlbum(
    albumCredentials: AlbumCredentialsDto,
    user: Auth
  ): Promise<AlbumRoDto> {
    const { title, description } = albumCredentials;
    const album = new Album();
    album.title = title;
    description && (album.description = description);
    album.user_id = user.id;
    album.user_profile_id = user.user_profile_id

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
    user: Auth
  ): Promise<AlbumRoDto> {
    const { title, description, preview } = albumCredentials;
    const album = await this.getOne(album_id);
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
    user: Auth /*, handler: (album: Album) => Promise<void>*/
  ): Promise<void> {
    const result = await this.getOne(id);
    result.deleted_at = new Date();

    try {
      // await handler(result);
      await result.save();
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}
