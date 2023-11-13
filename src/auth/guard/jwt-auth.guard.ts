import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/skip-auth.decorator';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtAuthGuard extends AuthGuard(['jwt', 'refresh']) implements CanActivate {
  constructor(
    private reflector: Reflector,
    // private readonly authService: AuthService,
  ) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic ? true : super.canActivate(context)) {
      // const req = context.switchToHttp().getRequest();
      // const res = context.switchToHttp().getResponse();
      // const userDTO = req.user;

      // if (!req.cookies.jwt) {
      //   // Access token is expired
      //   // TODO: Actually check instead of just checking existance
      //   const access = await this.authService.getAccessTokenAndOptions(userDTO);
      //   const refresh = await this.authService.getRefreshTokenAndOptions(userDTO);

      //   // TODO: Update refresh token in db
      //   res.cookie('jwt', access.token, access.options);
      // }
      return true;
    }
    return false;
  }
}
