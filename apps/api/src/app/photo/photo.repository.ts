import { Repository, EntityRepository } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Photo, Auth } from '../entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { IFileData } from '../file/file.service';
import { GetPhotosQueryDto } from './dto/get-photo-query.dto';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {

  async getAll({take = 0 , skip = 0}: GetPhotosQueryDto): Promise<PhotoRoDto[]> {
    const photos = await this.createQueryBuilder('photo')
      .where('photo.deleted_at IS NULL')
      .orderBy('photo.created_at', 'DESC')
      .leftJoinAndSelect('photo.album', 'album', 'album.deleted_at IS NULL')
      .leftJoinAndSelect('photo.user_profile', 'user_profile', 'user_profile.deleted_at IS NULL')
      .leftJoinAndSelect('photo.comments', 'comment', 'comment.deleted_at IS NULL')
      .leftJoinAndSelect('photo.likes', 'like')
      .take(take)
      .skip(skip)
      .getMany();

    const resultPhotos = photos.filter((photo) => photo.album && photo.user_profile);
    return resultPhotos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getAllAlbumPhoto(album_id: number): Promise<PhotoRoDto[]> {
    const photos = await this.createQueryBuilder('photo')
      .where('photo.deleted_at IS NULL')
      .leftJoinAndSelect('photo.album', 'album', 'album.deleted_at IS NULL')
      .leftJoinAndSelect('photo.user_profile', 'user_profile', 'user_profile.deleted_at IS NULL')
      .leftJoinAndSelect('photo.comments', 'comment', 'comment.deleted_at IS NULL')
      .leftJoinAndSelect('photo.likes', 'like')
      .where({ album_id })
      .getMany();

    const resultPhotos = photos.filter((photo) => photo.album && photo.user_profile);
    return resultPhotos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getOne(photo_id: number): Promise<PhotoRoDto> {
    const photo = await this.createQueryBuilder('photo')
      .where('photo.deleted_at IS NULL')
      .leftJoinAndSelect('photo.album', 'album', 'album.deleted_at IS NULL')
      .leftJoinAndSelect('photo.user_profile', 'user_profile', 'user_profile.deleted_at IS NULL')
      .leftJoinAndSelect('photo.comments', 'comment', 'comment.deleted_at IS NULL')
      .leftJoinAndSelect('photo.likes', 'like')
      .where({ id: photo_id })
      .getOne();

    if (!photo || (!photo.album && !photo.user_profile)) {
      throw new NotFoundException(`Photo with ID ${photo_id} not found`);
    }

    return plainToClass(PhotoRoDto, photo);
  }

  private async _getById(id: number) {
    const photo = this.findOne(id, {relations: ['user_profile']});
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  async createPhoto(
    imageData: IFileData,
    album_id: number,
    user: Auth
  ): Promise<PhotoRoDto> {
    const photo = new Photo();
    photo.user_id = user.id;
    photo.album_id = album_id;
    photo.user_profile_id = user.user_profile_id;
    photo.image = imageData.imageUrl;
    photo.image_name = imageData.fileName;

    try {
      await photo.save();
      return plainToClass(PhotoRoDto, photo);
    } catch (error) {
      console.log(error);
      if (error.code === '23505') {
        throw new ConflictException(`Photo with name "${imageData.fileName}" already exists`);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async updatePhoto(
    album_id: number,
    photo_id: number,
    photoCredentials: PhotoCredentialsDto
  ): Promise<PhotoRoDto> {
    const { title, description } = photoCredentials;
    const photo = await this.findOne({where: { id: photo_id, album_id }});

    if (!photo) {
      throw new NotFoundException(`Photo with ID ${photo_id} not found`);
    }

    photo.title = title;
    photo.description = description;

    try {
      await photo.save();
      return plainToClass(PhotoRoDto, photo);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deletePhoto(album_id: number, photo_id: number): Promise<void> {
    const photo = await this.findOne({where: { id: photo_id, album_id }});

    if (!photo) {
      throw new NotFoundException(`Photo with ID ${photo_id} not found`);
    }

    photo.deleted_at = new Date();

    try {
      await photo.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
