import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UserService } from '../../user/user.service';
import { UserPayload } from '../../common/interfaces/user-payload.interface';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('USER_SERVICE') private readonly userService: UserService,
  ) {
    super();
  }

  // Called on login: stores minimal user data (e.g. ID) in the session
  serializeUser(
    user: UserPayload,
    done: (err: Error | null, id: number) => void,
  ) {
    done(null, user.id);
  }

  // Called on every subsequent request: retrieves the full user data from the stored ID
  async deserializeUser(
    payload: UserPayload,
    done: (err: Error | null, user?: UserPayload | null) => void,
  ) {
    const user = await this.userService.findById(payload.id);
    if (!user) {
      done(new Error('User not found'), null);
      return;
    }
    done(null, user); // Attach user object to req.user
  }
}
