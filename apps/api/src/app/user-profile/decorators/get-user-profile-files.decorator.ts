import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IProfileFiles } from '../user-profile.service';

export const GetUserProfileFiles = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IProfileFiles => {
    const request = ctx.switchToHttp().getRequest();
    const files = request.files
    return files;
  }
);
