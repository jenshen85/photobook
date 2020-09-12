import {
  Controller,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  // Post,
  // Body,
  Delete,
  // ValidationPipe,
} from '@nestjs/common';

import { UserRoDto } from '@photobook/dto';
import { User } from '@photobook/entities';

import { UserService } from './user.service';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { GetUser } from '../shared/decorators/get-user.decorator';

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly _userService: UserService) {}

  @Get()
  getUsers(): Promise<UserRoDto[]> {
    return this._userService.getUsers();
  }

  @Get('/:id')
  getUserById(@Param('id', ParseIntPipe) id: number): Promise<UserRoDto> {
    return this._userService.getUserById(id);
  }

  @Delete()
  deleteUser(@GetUser() user: User): Promise<void> {
    return this._userService.deleteUser(user);
  }
}
