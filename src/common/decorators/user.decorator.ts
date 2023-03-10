import { createParamDecorator, ExecutionContext } from '@nestjs/common';

//* User라는 데코레이터를 직접 만들어 준 것.
//* request.user를 가져올 수 있다.
export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.user();
  },
);
