import { Request } from 'express';
import { User } from '../../user/user.entity';

// Use the globally defined User interface
export type RequestWithUser = Request & {
  user: User; // User is guaranteed to be present and non-optional after the guard
};

export type FindTodoWhere = {
  user: Partial<User>;
  status: string;
  done: boolean;
};
