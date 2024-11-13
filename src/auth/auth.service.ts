import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entity';
import { UserService } from 'src/user/user.service';

import { ConflictException, Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async createUser(
    email: string,
    pass: string,
    firstName: string,
    lastName: string,
    invitedCode?: string,
  ): Promise<void> {
    const userExistWithEmail = await this.userService.findByEmail(email);

    if (userExistWithEmail) {
      throw new ConflictException('Email already exist.');
    }

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(pass, salt);

    await this.userService.create(
      email,
      hashedPassword,
      firstName,
      lastName,
      invitedCode ? invitedCode : '',
    );
  }

  async validateUser(
    usernameOrEmail: string,
    password: string,
  ): Promise<User | null> {
    const user = await this.userService.findByEmail(usernameOrEmail);
    if (!user) return null;
    const isMatch = await bcrypt.compare(password, user.getPassword());
    if (isMatch) return user;
  }
}
