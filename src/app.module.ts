import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TodoModule } from './todo/todo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { Todo } from './todo/todo.entity';
import { User } from './user/user.entity';
import { AuthModule } from './auth/auth.module';
import { PassportModule } from '@nestjs/passport';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { SessionEntity } from './typeorm/session/Session';
import { ClientLocalsMiddleware } from './middlewares/clientLocals.middleware';
import { FlashInterceptor } from './common/interceptors/flash.interceptor';

@Module({
  imports: [
    // TypeOrmModule.forFeature([SessionEntity]),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: 'db.sqlite',
      entities: [Todo, User, SessionEntity],
      synchronize: true, // dev only
    }),
    PassportModule.register({ session: true }),
    TodoModule,
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    { provide: APP_INTERCEPTOR, useClass: FlashInterceptor },
    AppService,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ClientLocalsMiddleware).forRoutes('*');
  }
}
