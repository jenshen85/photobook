import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { EntityRepository, Repository } from 'typeorm';
import { plainToClass } from 'class-transformer';

import { CommentCredentialsDto, CommentRoDto } from '@photobook/dto';
import { Comment } from '../entities/comment.entity';

@EntityRepository(Comment)
export class CommentRepository extends Repository<Comment> {
  async getAll(photo_id: number): Promise<CommentRoDto[]> {
    const comments = await this.createQueryBuilder('comment')
      .where('comment.deleted_at IS NULL')
      .leftJoinAndSelect(
        'comment.user_profile',
        'user_profile',
        'user_profile.deleted_at IS NULL'
      )
      .where('comment.photo_id = :photo_id', { photo_id })
      .getMany();

    const resultComments = comments.filter((comment) => comment.user_profile);
    return resultComments.map((comment) => plainToClass(CommentRoDto, comment));
  }

  async getComment(
    photo_id: number,
    comment_id: number
  ): Promise<CommentRoDto> {
    const comment = await this.createQueryBuilder('comment')
      .where('comment.deleted_at IS NULL')
      .leftJoinAndSelect(
        'comment.user_profile',
        'user_profile',
        'user_profile.deleted_at IS NULL'
      )
      .where({ id: comment_id })
      .andWhere('comment.photo_id = :photo_id', { photo_id })
      .getOne();

    return plainToClass(CommentRoDto, comment);
  }

  async createComment(
    commentCredentilas: CommentCredentialsDto,
    user_profile_id: number,
    photo_id: number
  ): Promise<CommentRoDto> {
    const comment = new Comment();
    comment.text = commentCredentilas.text;
    comment.photo_id = photo_id;
    comment.user_profile_id = user_profile_id;

    try {
      await comment.save();
      return await this.getComment(photo_id, comment.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async updateComment(
    commentCredentilas: CommentCredentialsDto,
    user_profile_id: number,
    comment_id: number
  ): Promise<CommentRoDto> {
    const comment = await this.findOne({
      where: { id: comment_id, user_profile_id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${comment_id} not found`);
    }

    comment.text = commentCredentilas.text;

    try {
      await comment.save();
      return await this.getComment(comment.photo_id, comment.id);
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async deleteComment(
    user_profile_id: number,
    comment_id: number
  ): Promise<void> {
    const comment = await this.findOne({
      where: { id: comment_id, user_profile_id },
    });

    if (!comment) {
      throw new NotFoundException(`Comment with ID ${comment_id} not found`);
    }

    comment.deleted_at = new Date();

    try {
      await comment.save();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
