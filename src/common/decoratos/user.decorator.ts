import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const User = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // ctx: ExecutionContext? 서브의 실행컨택스트, http, rpc, ws 등등 이 있는데 이유는 한 서버 안에서 여러가지 프로토콜을 동시에 사용할 수 있기 때문
    const request = ctx.switchToHttp().getRequest();
    console.log('user.decorator.ts', request.user);
    return request.user;
  },
);
