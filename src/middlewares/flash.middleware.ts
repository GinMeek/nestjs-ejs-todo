import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

@Injectable()
export class FlashMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    // Default structure to avoid frontend errors
    const defaultFlash = { success: [], error: [], info: [], warning: [] };

    // Make messages available to all EJS templates
    res.locals.messages = { ...defaultFlash, ...req.session.flash };

    // clear from session after rendering so they persist
    delete req.session.flash;
    req.session.save(next);
  }
}
