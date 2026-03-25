import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../user/user.entity';

@Injectable()
export class ClientLocalsMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    // res.locals makes these variables available in all EJS views automatically
    res.locals.currentUser = (req.user as Partial<User>) || null;
    res.locals.activeLink = req.path;
    next();
  }
}
