import { ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';

export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext) {
    const result = (await super.canActivate(context)) as boolean;
    const request: Request = context.switchToHttp().getRequest();

    console.log('before login:', result);
    if (!request.user) {
      return false;
    }

    await super.logIn(request);

    console.log('after login', result);

    return result;
  }

  handleRequest(err: any, user: any, info: any, context: ExecutionContext) {
    const request: Request = context.switchToHttp().getRequest();
    const response: Response = context.switchToHttp().getResponse();

    console.log('inside handle request');

    if (err || !user) {
      if (!request.session.flash) {
        request.session.flash = {};
      }
      if (!request.session.flash.error) {
        request.session.flash.error = [];
      }

      const message =
        err instanceof Error
          ? err.message
          : 'An error occurred during authentication';
      request.session.flash.error.push(message);

      // request.flash('error', message);
      console.log(message);

      return response.redirect('login');
    }

    return user;
  }
}
