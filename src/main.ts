import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import expressLayouts from 'express-ejs-layouts';
import { join } from 'path';
import { AppModule } from './app.module';
import { sessionMiddleware } from './middlewares/session.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // 1. Global Pipes & Interceptors
  app.useGlobalPipes(new ValidationPipe({ whitelist: true }));

  // 2. Assets & View Engine
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setViewEngine('ejs');
  app.use(expressLayouts);
  app.set('layout', 'layouts/layout');

  // 3. Session & Passport are configured in AppModule with custom middleware
  sessionMiddleware(app);

  // 4. Start Server
  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Application is running on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Error starting application:', err);
  process.exit(1);
});
