import { Repository, EntityRepository } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Photo, User, Album } from '@photobook/entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { IFileData } from '../file/file.service';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {
  async getAll(): Promise<PhotoRoDto[]> {
    const photos = await this.find({relations: ['user']});
    // const photos = await this.find({relations: ['user'], take: 10, skip: 10});
    return photos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getAllAlbumPhoto(album_id: number): Promise<PhotoRoDto[]> {
    const photos = await this.find({ where: { album_id } });
    return photos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getOne(photo_id: number): Promise<PhotoRoDto> {
    const photo = await this.getById(photo_id);
    return plainToClass(PhotoRoDto, photo);
  }

  async getById(id: number) {
    const photo = this.findOne(id, {relations: ['user']});
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  async getUserPhotoById(id: number, user: User) {
    const photo = this.findOne({ where: { id, user_id: user.id } });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  async createPhoto(
    imageData: IFileData,
    album: Album,
    user: User
  ): Promise<PhotoRoDto> {
    const photo = new Photo();
    photo.user = user;
    photo.album = album;
    photo.image = imageData.imageUrl;
    photo.image_name = imageData.fileName;

    try {
      await photo.save();
      return plainToClass(PhotoRoDto, photo);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(`Photo with name "${imageData.fileName}" already exists`);
      } else {
        throw new InternalServerErrorException(error);
      }
    }
  }

  async updatePhoto(
    photo_id: number,
    photoCredentials: PhotoCredentialsDto,
    user: User
  ): Promise<PhotoRoDto> {
    const { title, description } = photoCredentials;
    const photo = await this.getUserPhotoById(photo_id, user);
    photo.title = title;
    photo.description = description;

    try {
      await photo.save();
      return plainToClass(PhotoRoDto, photo);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deletePhoto(photo_id: number, user: User): Promise<void> {
    const photo = await this.getUserPhotoById(photo_id, user);
    photo.deleted_at = new Date();

    try {
      await photo.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
