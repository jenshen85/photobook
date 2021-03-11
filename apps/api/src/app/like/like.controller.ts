import { Controller, Delete, Param, ParseIntPipe, Post, UseGuards } from "@nestjs/common";
import { LikeRoDto } from "@photobook/dto";
import { Auth } from "../entities";
import { GetUser } from "../shared/decorators/get-user.decorator";
import { JwtAuthGuard } from "../shared/guards/jwt-auth.guard";
import { LikeService } from "./like.service";

@Controller('like')
@UseGuards(JwtAuthGuard)
export class LikeController {
  constructor(private readonly _likeService: LikeService) {}

  @Post(':photo_id')
  like(
    @Param('photo_id', ParseIntPipe) photo_id: number,
    @GetUser() user: Auth
  ): Promise<LikeRoDto> {
    return this._likeService.like(user.user_profile_id, photo_id);
  }

  @Delete(':photo_id')
  unLike(
    @Param('photo_id', ParseIntPipe) photo_id: number,
    @GetUser() user: Auth
  ): Promise<LikeRoDto> {
    return this._likeService.unLike(user.user_profile_id, photo_id);
  }
}