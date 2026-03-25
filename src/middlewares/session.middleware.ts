import { DataSource } from 'typeorm';
import { TypeormStore } from 'connect-typeorm';
import session from 'express-session';
import passport from 'passport';
import { NestExpressApplication } from '@nestjs/platform-express';
import { SessionEntity } from '../typeorm/session/Session';

export function sessionMiddleware(app: NestExpressApplication) {
  const dataSource = app.get(DataSource);
  const sessionRepository = dataSource.getRepository(SessionEntity);

  app.use(
    session({
      name: 'SESSION_ID',
      secret: 'my-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000 * 24,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
      },
      store: new TypeormStore({
        cleanupLimit: 2,
      }).connect(sessionRepository),
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());
}
