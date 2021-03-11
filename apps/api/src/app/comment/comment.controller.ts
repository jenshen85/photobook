import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, UseGuards } from "@nestjs/common";
import { CommentCredentialsDto, CommentRoDto } from "@photobook/dto";
import { Auth } from "../entities";
import { GetUser } from "../shared/decorators/get-user.decorator";
import { JwtAuthGuard } from "../shared/guards/jwt-auth.guard";

import { CommentService } from './comment.service'

@Controller('comment')
@UseGuards(JwtAuthGuard)
export class CommentController {
  constructor(private readonly _commentService: CommentService) {}

  @Get(':photo_id')
  getAll( @Param('photo_id', ParseIntPipe) photo_id: number ): Promise<CommentRoDto[]> {
    return this._commentService.getAll(photo_id);
  }

  @Post(':photo_id')
  create(
    @Body() commentCredentilas: CommentCredentialsDto,
    @Param('photo_id', ParseIntPipe) photo_id: number,
    @GetUser() user: Auth
  ): Promise<CommentRoDto> {
    return this._commentService.createComment(commentCredentilas, user.user_profile_id, photo_id);
  }

  @Patch(':comment_id')
  update(
    @Body() commentCredentilas: CommentCredentialsDto,
    @Param('comment_id', ParseIntPipe) comment_id: number,
    @GetUser() user: Auth
  ): Promise<CommentRoDto> {
    return this._commentService.updateComment(commentCredentilas, user.user_profile_id, comment_id);
  }

  @Delete(':comment_id')
  delete(
    @Param('comment_id', ParseIntPipe) comment_id: number,
    @GetUser() user: Auth
  ) {
    return this._commentService.deleteComment(user.user_profile_id, comment_id);
  }
}