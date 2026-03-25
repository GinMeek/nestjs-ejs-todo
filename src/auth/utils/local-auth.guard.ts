import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request: Request = context.switchToHttp().getRequest();

    await super.logIn(request);

    return result;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    if (!request.session.flash) {
      request.session.flash = {};
    }
    if (!request.session.flash.error) {
      request.session.flash.error = [];
    }

    if (err || !user) {
      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred during authentication';
      request.session.flash.error.push(message);

      return response.redirect('login');
    }

    return user;
  }
}
