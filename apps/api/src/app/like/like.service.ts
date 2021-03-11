import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { LikeRoDto } from "@photobook/dto";
import { LikeRepository } from "./like.repository";

@Injectable()
export class LikeService {
  constructor(
    @InjectRepository(LikeRepository) private readonly _likeRepository: LikeRepository
  ) {}

  async like(user_profile_id: number, photo_id: number): Promise<LikeRoDto> {
    return await this._likeRepository.like(user_profile_id, photo_id);
  }

  async unLike(user_profile_id: number, photo_id: number): Promise<LikeRoDto> {
    return await this._likeRepository.unLike(user_profile_id, photo_id);
  }
}