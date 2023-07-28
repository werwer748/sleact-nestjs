import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    // super로 import { AuthGuard } from '@nestjs/passport'; 여깃는거 꺼내왔다?
    if (can) {
      const request = context.switchToHttp().getRequest();
      await super.logIn(request);
    }
    return true;
  }
}
