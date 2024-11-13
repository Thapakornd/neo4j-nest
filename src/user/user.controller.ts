import { Public } from 'src/auth/decorator/public-route.decorator';

import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Public()
  @Get('/:id/children')
  async getChildren(@Param('id') id: string) {
    return await this.userService.getChildren(id);
  }
}
