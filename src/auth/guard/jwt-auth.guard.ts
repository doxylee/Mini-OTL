import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/skip-auth.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'refresh']) implements CanActivate {
  constructor(private reflector: Reflector) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      return (await super.canActivate(context)) === true || isPublic;
    } catch (e) {
      if (isPublic) return true;
      else throw e;
    }
  }
}
