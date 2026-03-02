// flash.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const Flash = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const session = request.session;

    // Initialize flash object if it doesn't exist
    if (!session.flash) {
      session.flash = {};
    }

    // If a specific key is requested (e.g., @Flash('error'))
    if (data) {
      const message = session.flash[data];
      delete session.flash[data]; // Clear it after reading
      return message;
    }

    // Otherwise, return all messages and clear the whole object
    const allMessages = { ...session.flash };
    session.flash = {};
    return allMessages;
  },
);
