import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findByUsername(username);
    if (!user) {
      return null;
    }
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      // return user without password
      const { password, ...result } = user;
      return result;
    }

    return null;
  }
}
