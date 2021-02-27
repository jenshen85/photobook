import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Auth } from '../../entities';

export const GetUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): Auth => {
    const request = ctx.switchToHttp().getRequest();
    return request.user;
  },
);
