import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '../../user/user.entity';
import { Request } from 'express';

export const GetUser = createParamDecorator(
  (data: keyof User | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<Request>();
    const user: Partial<User> | undefined = request.user;

    // If a specific property is requested (e.g., @GetUser('email')), return only that
    return data ? user?.[data] : user;
  },
);
