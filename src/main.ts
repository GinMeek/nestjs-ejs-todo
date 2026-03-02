import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import session from 'express-session';
import expressLayouts from 'express-ejs-layouts';
import { join } from 'path';
import { AppModule } from './app.module';
import { User } from './user/user.entity';
import { FlashInterceptor } from './common/interceptors/flash.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const port = process.env.PORT ?? 3000;

  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');

  // Enable layouts
  app.set('layout', 'layouts/layout'); // Use 'layouts/layout.ejs' as the default layout
  app.use(expressLayouts);

  app.use(
    session({
      name: 'TODO_SESSION_ID',
      secret: 'your-secret-key',
      resave: false,
      saveUninitialized: false,
      cookie: {
        maxAge: 3600000 * 24, // 1 day
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
      }, // Optional cookie settings
    }),
  );

  app.use(passport.initialize());
  app.use(passport.session());

  app.useGlobalInterceptors(new FlashInterceptor());

  app.use((req: Request, res: Response, next: NextFunction) => {
    res.locals.currentUser = (req.user as Partial<User>) || null;
    res.locals.activeLink = req.path;
    next();
  });

  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
