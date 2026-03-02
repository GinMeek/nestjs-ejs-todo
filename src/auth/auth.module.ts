import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { LocalStrategy } from './utils/local.strategy';
import { SessionSerializer } from './utils/session.serializer';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/user.entity';
import { UserService } from '../user/user.service';
import { FlashModule } from '../flash/flash.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), FlashModule],
  providers: [
    { provide: 'AUTH_SERVICE', useClass: AuthService },
    { provide: 'USER_SERVICE', useClass: UserService },
    LocalStrategy,
    SessionSerializer,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
