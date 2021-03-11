import { InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { EntityRepository, Repository } from "typeorm";
import { Like } from "../entities/like.entity";
import { plainToClass } from "class-transformer";
import { LikeRoDto } from "@photobook/dto";
import { LikeEnum } from "@photobook/data";

@EntityRepository(Like)
export class LikeRepository extends Repository<Like> {
  async like(user_profile_id: number, photo_id: number): Promise<LikeRoDto> {
    let like = await this.findOne({where: { user_profile_id, photo_id }})

    if(like) {
      like.status = LikeEnum.liked;
    } else {
      like = new Like();
      like.status = LikeEnum.liked;
      like.user_profile_id = user_profile_id;
      like.photo_id = photo_id;
    }

    try {
      like.save();
      return plainToClass(LikeRoDto, like);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async unLike(user_profile_id: number, photo_id: number): Promise<LikeRoDto> {
    let like = await this.findOne({where: { user_profile_id, photo_id }})

    if(!like) {
      throw new NotFoundException();
    }

    like.status = LikeEnum.unliked;

    try {
      like.save();
      return plainToClass(LikeRoDto, like);
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }
}