import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';

@Injectable()
export class AdminGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const user: JWTPayload | undefined = context.switchToHttp().getRequest().user;
    return !!user?.isAdmin;
  }
}
