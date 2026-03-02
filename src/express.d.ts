import 'express';

declare global {
  namespace Express {
    interface Request {
      flash(type?: string, message?: string | string[]): string | string[];
    }
  }
}
