import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export type FlashType = {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
  warning: (message: string) => void;
  save: (callback?: () => void) => void;
};

export const Flash = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request: Request = ctx.switchToHttp().getRequest();
    const session = request.session;

    // Helper to ensure category exists
    const ensureCategory = (cat: string) => {
      if (!session.flash) session.flash = {};
      if (!session.flash[cat]) session.flash[cat] = [];
    };

    return {
      success: (msg: string) => {
        ensureCategory('success');
        session.flash?.success?.push(msg);
      },
      error: (msg: string) => {
        ensureCategory('error');
        session.flash?.error?.push(msg);
      },
      info: (msg: string) => {
        ensureCategory('info');
        session.flash?.info?.push(msg);
      },
      warning: (msg: string) => {
        ensureCategory('warning');
        session.flash?.warning?.push(msg);
      },
      save: (cb?: () => void) => session.save(cb),
    };
  },
);
