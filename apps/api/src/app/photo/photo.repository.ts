import { Repository, EntityRepository } from 'typeorm';
import {
  NotFoundException,
  InternalServerErrorException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';

import { Photo, Auth } from '../entities';
import { PhotoCredentialsDto, PhotoRoDto } from '@photobook/dto';

import { IFileData, PhotoInfoType } from '../file/file.service';
import { GetPhotosQueryDto, PhotoQueryDto } from './dto/get-photo-query.dto';
import { LikeEnum, PhotoRoI } from '@photobook/data';

@EntityRepository(Photo)
export class PhotoRepository extends Repository<Photo> {
  async getAll({ take, skip }: GetPhotosQueryDto): Promise<PhotoRoDto[]> {
    const photos = await this.createQueryBuilder('photo')
      .where('photo.deleted_at IS NULL')
      .orderBy('photo.id', 'DESC')
      .leftJoinAndSelect('photo.album', 'album')
      .leftJoinAndSelect('photo.user_profile', 'user_profile')
      .leftJoinAndSelect(
        'photo.comments',
        'comment',
        'comment.deleted_at IS NULL'
      )
      .leftJoinAndSelect('photo.likes', 'like', 'like.status = :like_status', {
        like_status: LikeEnum.liked,
      })
      .take(take)
      .skip(skip)
      .getMany();

    return photos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getAllAlbumPhoto(
    album_id: number,
    getPhotosQuery: GetPhotosQueryDto = {}
  ): Promise<PhotoRoDto[]> {
    const { take, skip } = getPhotosQuery;
    const query = this.createQueryBuilder('photo');
    query
      .where('photo.deleted_at IS NULL')
      .orderBy('photo.id', 'DESC')
      .leftJoinAndSelect('photo.album', 'album')
      .leftJoinAndSelect('photo.user_profile', 'user_profile')
      .leftJoinAndSelect(
        'photo.comments',
        'comment',
        'comment.deleted_at IS NULL'
      )
      .leftJoinAndSelect('photo.likes', 'like', 'like.status = :like_status', {
        like_status: LikeEnum.liked,
      })
      .where({ album_id });

    if (take) {
      query.take(take);
    }

    if (skip) {
      query.skip(skip);
    }

    const photos = await query.getMany();
    return photos.map((photo) => plainToClass(PhotoRoDto, photo));
  }

  async getOne(photo_id: number): Promise<PhotoRoDto> {
    const photo = await this.createQueryBuilder('photo')
      .where('photo.deleted_at IS NULL')
      .leftJoinAndSelect('photo.album', 'album')
      .leftJoinAndSelect('photo.user_profile', 'user_profile')
      .leftJoinAndSelect(
        'photo.comments',
        'comment',
        'comment.deleted_at IS NULL'
      )
      .leftJoinAndSelect('photo.likes', 'like', 'like.status = :like_status', {
        like_status: LikeEnum.liked,
      })
      .where({ id: photo_id })
      .getOne();

    if (!photo) {
      throw new NotFoundException(`Photo with ID ${photo_id} not found`);
    }

    return plainToClass(PhotoRoDto, photo);
  }

  async getNext(
    photo_id: number,
    photoQuery: PhotoQueryDto
  ): Promise<PhotoRoDto | null> {
    const { album_id } = photoQuery;
    let photo: PhotoRoI;
    const query = this.createQueryBuilder('photo');

    query
      .orderBy('photo.id', 'DESC')
      .where('photo.id < :photo_id', { photo_id })
      .andWhere('photo.deleted_at IS NULL');

    if (album_id) {
      query.andWhere('photo.album_id = :album_id', { album_id });
    }

    query
      .leftJoinAndSelect('photo.album', 'album')
      .leftJoinAndSelect('photo.user_profile', 'user_profile')
      .leftJoinAndSelect(
        'photo.comments',
        'comment',
        'comment.deleted_at IS NULL'
      )
      .leftJoinAndSelect('photo.likes', 'like', 'like.status = :like_status', {
        like_status: LikeEnum.liked,
      });

    try {
      photo = await query.getOne();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    if (!photo) {
      return null;
    }

    return plainToClass(PhotoRoDto, photo);
  }

  async getPrev(
    photo_id: number,
    photoQuery: PhotoQueryDto
  ): Promise<PhotoRoDto | null> {
    const { album_id } = photoQuery;
    let photo: PhotoRoI;
    const query = this.createQueryBuilder('photo');

    query
      .orderBy('photo.id', 'ASC')
      .where('photo.id > :photo_id', { photo_id })
      .andWhere('photo.deleted_at IS NULL');

    if (album_id) {
      query.andWhere('photo.album_id = :album_id', { album_id });
    }

    query
      .leftJoinAndSelect('photo.album', 'album')
      .leftJoinAndSelect('photo.user_profile', 'user_profile')
      .leftJoinAndSelect(
        'photo.comments',
        'comment',
        'comment.deleted_at IS NULL'
      )
      .leftJoinAndSelect('photo.likes', 'like', 'like.status = :like_status', {
        like_status: LikeEnum.liked,
      });

    try {
      photo = await query.getOne();
    } catch (err) {
      throw new InternalServerErrorException(err);
    }

    if (!photo) {
      return null;
    }

    return plainToClass(PhotoRoDto, photo);
  }

  private async _getById(id: number) {
    const photo = this.findOne(id, { relations: ['user_profile'] });
    if (!photo) {
      throw new NotFoundException(`Photo with ID ${id} not found`);
    }

    return photo;
  }

  async createPhoto(
    imageData: IFileData,
    imagePreview: string,
    album_id: number,
    user: Auth
  ): Promise<PhotoRoDto> {
    const newPhoto = new Photo();
    newPhoto.user_id = user.id;
    newPhoto.album_id = album_id;
    newPhoto.user_profile_id = user.user_profile_id;
    newPhoto.image = imageData.imageUrl;
    newPhoto.filename = imageData.fileName;
    newPhoto.width = imageData.width;
    newPhoto.height = imageData.height;
    newPhoto.ratio = imageData.ratio;
    newPhoto.dimension = imageData.dimension;
    newPhoto.preview = imagePreview;

    try {
      await newPhoto.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }

    return await this.getOne(newPhoto.id);
  }

  async updatePhoto(
    album_id: number,
    photo_id: number,
    photoCredentials: PhotoCredentialsDto
  ): Promise<PhotoRoDto> {
    const { title, description } = photoCredentials;
    const photo = await this.findOne({ where: { id: photo_id, album_id } });

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
    const photo = await this.findOne({ where: { id: photo_id, album_id } });

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

  async deleteAlbumPhotos(album_id: number): Promise<void> {
    const photos = await this.createQueryBuilder('photo')
      .where('photo.deleted_at IS NULL')
      .orderBy('photo.id', 'DESC')
      .where({ album_id })
      .getMany();

    await Promise.all(
      photos.map(async (photo) => {
        photo.deleted_at = new Date();

        try {
          await photo.save();
        } catch (error) {
          throw new InternalServerErrorException(error);
        }
      })
    );
  }

  async patchPhotoInfo(
    photo: Photo,
    photoInfo: PhotoInfoType,
    filename: string,
    imagePreview?: string
  ): Promise<void> {
    if (!photo.height) {
      photo.height = photoInfo.height;
    }
    if (!photo.width) {
      photo.width = photoInfo.width;
    }
    if (!photo.ratio) {
      photo.ratio = photoInfo.ratio;
    }
    if (!photo.dimension) {
      photo.dimension = photoInfo.dimension;
    }

    if (!photo.preview) {
      photo.preview = imagePreview;
    }

    if (!photo.filename) {
      photo.filename = filename;
    }

    try {
      await photo.save();
      console.log(photo.id, ': image info updated successfully');
    } catch (error) {
      console.log(photo.id, ': image info updated falure');
      throw new InternalServerErrorException(error);
    }
  }
}
