import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { IS_PUBLIC_KEY } from '../decorator/public-route.decorator';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
  constructor(private readonly reflectorPublic: Reflector) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const isPublic = this.reflectorPublic.getAllAndOverride<boolean>(
      IS_PUBLIC_KEY,
      [context.getHandler(), context.getClass()],
    );
    if (isPublic) return true;
    const request = context.switchToHttp().getRequest();
    return request.isAuthenticated();
  }
}
