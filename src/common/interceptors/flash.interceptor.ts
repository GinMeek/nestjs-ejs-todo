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
    const ctx = context.switchToHttp();
    const request: Request = ctx.getRequest();
    const response: Response = ctx.getResponse();

    // Default structure to avoid frontend errors
    const defaultFlash = { success: [], error: [], info: [] };

    // Merge actual session flash into the defaults
    response.locals.messages = { ...defaultFlash, ...request.session.flash };

    // Clear session
    delete request.session.flash;

    return next.handle();
  }
}
