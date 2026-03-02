import 'express-session';

declare module 'express-session' {
  interface SessionData {
    flash: {
      success?: string[];
      error?: string[];
      info?: string[];
      warning?: string[];
      [key: string]: string[] | undefined;
    };
  }
}
