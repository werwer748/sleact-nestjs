import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const response = ctx.switchToHttp().getResponse();
    console.log('token.decorator.ts', response.locals.jwt);
    return response.locals.jwt;
  },
);
