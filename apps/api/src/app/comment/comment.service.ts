import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CommentCredentialsDto, CommentRoDto } from "@photobook/dto";

import { CommentRepository } from './comment.repository'

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(CommentRepository) private readonly _commentRepository: CommentRepository
  ) {}

  async getAll(photo_id: number): Promise<CommentRoDto[]> {
    return await this._commentRepository.getAll(photo_id);
  }

  async createComment(
    commentCredentilas: CommentCredentialsDto,
    user_profile_id: number,
    photo_id: number
  ): Promise<CommentRoDto> {
    return await this._commentRepository.createComment(commentCredentilas, user_profile_id, photo_id);
  }

  async updateComment(
    commentCredentilas: CommentCredentialsDto,
    user_profile_id: number,
    comment_id: number
  ): Promise<CommentRoDto> {
    return await this._commentRepository.updateComment(commentCredentilas, user_profile_id, comment_id);
  }

  async deleteComment(user_profile_id: number, comment_id: number): Promise<void> {
    return await this._commentRepository.deleteComment(user_profile_id, comment_id);
  }
}