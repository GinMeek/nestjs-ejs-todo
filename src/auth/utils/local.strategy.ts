import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth.service';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject('AUTH_SERVICE') private authService: AuthService) {
    super(); // defaults to fields: username, password
  }

  async validate(username: string, password: string) {
    console.log('Inside LocalStrategy.validate');
    console.log(`Username: ${username}, Password: ${password}`);
    const user = await this.authService.validateUser(username, password);
    console.log('inside LocalStrategy.validate', user);

    if (!user) throw new UnauthorizedException('Invalid username or password');
    console.log(`User authenticated: ${username}`);
    return user; // attaches to req.user
  }
}
