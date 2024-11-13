import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly userService: UserService) {
    super();
  }

  serializeUser(user: User, done: (err, user: User) => void) {
    done(null, user);
  }

  async deserializeUser(user: User, done: (err, user: User) => void) {
    const userDb = await this.userService.findByEmail(user.getEmail());
    return userDb ? done(null, userDb) : done(null, null);
  }
}
