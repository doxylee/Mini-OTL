import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorator/skip-auth.decorator';
import { JWTPayload, TokenRefreshPayload } from 'src/common/dto/auth/auth.dto';
import { RefreshTokenInvalidException } from '../refresh.exception';

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
      const authenticated = (await super.canActivate(context)) === true;
      if (authenticated) {
        const request = context.switchToHttp().getRequest() as { user: JWTPayload | TokenRefreshPayload };
        const response = context.switchToHttp().getResponse();
        console.log('request.user', request.user);
        if ('access' in request.user) {
          const { access, ...newPayload } = request.user;
          request.user = newPayload;
          response.cookie('jwt', access.token, access.options);
        }
        return true;
      } else return isPublic;
    } catch (e) {
      // TODO: Should remove refresh token from cookie?
      if (e instanceof RefreshTokenInvalidException) throw new UnauthorizedException(e.message);
      if (isPublic) return true;
      else throw e;
    }
  }
}
