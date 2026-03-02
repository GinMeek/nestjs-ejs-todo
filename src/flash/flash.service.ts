// flash.service.ts
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class FlashService {
  /**
   * Helper to push a message into the session's flash array
   */
  private addMessage(
    req: Request,
    type: 'success' | 'error' | 'info' | 'warning',
    message: string,
  ) {
    if (!req.session.flash) {
      req.session.flash = {};
    }

    if (!req.session.flash[type]) {
      req.session.flash[type] = [];
    }

    req.session.flash[type].push(message);
  }

  success(req: Request, message: string) {
    this.addMessage(req, 'success', message);
  }

  error(req: Request, message: string) {
    this.addMessage(req, 'error', message);
  }

  info(req: Request, message: string) {
    this.addMessage(req, 'info', message);
  }

  warning(req: Request, message: string) {
    this.addMessage(req, 'warning', message); // Bootstrap has 'text-bg-warning'
  }
}
