import { CreateUserDto } from 'src/user/dto/create-user.dto';

import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { Public } from './decorator/public-route.decorator';
import { LocalAuthGuard } from './guard/local-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signUp')
  async signUp(@Body() createUserDto: CreateUserDto) {
    const { email, password, firstName, lastName, invitedCode } = createUserDto;
    return await this.authService.createUser(
      email,
      password,
      firstName,
      lastName,
      invitedCode,
    );
  }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/signIn')
  async signIn(@Req() req) {
    return req.user;
  }

  @Get('/profile')
  async getUser(@Req() req) {
    return req.user;
  }
}
