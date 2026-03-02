import { Inject, Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {}

  async validateUser(username: string, pass: string) {
    console.log('Inside AuthService.validateUser');
    const user = await this.userService.findByUsername(username);
    if (!user) {
      console.log(`User not found: ${username}`);
      return null;
    }
    const match = await bcrypt.compare(pass, user.password);
    if (match) {
      // return user without password
      const { password, ...result } = user;
      return result;
    }
    console.log(`Invalid password for user: ${username}`);
    return null;
  }
}
