import { Repository, EntityRepository } from 'typeorm';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Photo, Auth, Album } from '../entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { IFileData } from '../file/file.service';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {

  async getAll(): Promise<PhotoRoDto[]> {
    const photos = await this.createQueryBuilder('photo')
      .leftJoinAndSelect('photo.album', 'album')
      .leftJoinAndSelect('photo.user_profile', 'user_profile')
      .getMany()
    // const photos = await this.find({relations: ['user'], take: 10, skip: 10});
    return photos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getAllAlbumPhoto(album_id: number): Promise<PhotoRoDto[]> {
    const photos = await this.find({ where: { album_id } });
    return photos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getOne(photo_id: number): Promise<PhotoRoDto> {
    const photo = await this._getById(photo_id);
    return plainToClass(PhotoRoDto, photo);
  }

  private async _getById(id: number) {
    const photo = this.findOne(id, {relations: ['user']});
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  // private async _getUserPhotoById(id: number, user: User) {
  //   const photo = this.findOne({ where: { id, user_id: user.id } });
  //   if (!photo) {
  //     throw new NotFoundException(`Photo with ID ${id} not found`);
  //   }

  //   return photo;
  // }

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
    photo_id: number,
    photoCredentials: PhotoCredentialsDto
  ): Promise<PhotoRoDto> {
    const { title, description } = photoCredentials;
    const photo = await this._getById(photo_id);
    photo.title = title;
    photo.description = description;

    try {
      await photo.save();
      return plainToClass(PhotoRoDto, photo);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deletePhoto(photo_id: number): Promise<void> {
    const photo = await this._getById(photo_id);
    photo.deleted_at = new Date();

    try {
      await photo.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
