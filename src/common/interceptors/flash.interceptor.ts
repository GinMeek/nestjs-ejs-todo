import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class FlashInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const http = context.switchToHttp();
    const request: Request = http.getRequest();
    const response: Response = http.getResponse();

    // Merge actual session flash into the defaults
    response.locals.messages = {
      success: request.session.flash?.success || [],
      error: request.session.flash?.error || [],
      info: request.session.flash?.info || [],
      warning: request.session.flash?.warning || [],
    };

    // Clear session
    delete request.session.flash;

    return next.handle();
  }
}
