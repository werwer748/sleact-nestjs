import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable() //Injectable붙으면 거의 provider(서비스, 가드, 인터셉터)
export class LocalAuthGuard extends AuthGuard('local') {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const can = await super.canActivate(context);
    if (can) {
      const request = context.switchToHttp().getRequest();
      console.log('login for cookie');
      await super.logIn(request);
    }

    return true;
  }
}
