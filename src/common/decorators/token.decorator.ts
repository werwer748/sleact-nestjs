import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    //? ExecutionContext: 한서버에서 websocket, http, Rpc 세가지가 돌아가는 경우가 있음
    //? 그럴경우 이 컨텍스트내 실행중인 것 중 어느 하나를 특정하여 관련 값을 가져올 수 있다.
    const response = ctx.switchToHttp().getResponse();
    return response.locals.jwt;
  },
);

/*
 * jwtToken 사용시 @Token token <- 이런식으로 사용 가능
 * 컨트롤러에서 request user, response token 을 쓰는것을 막아준다.
 * 중요한 이유: 컨트롤러에서 모두 작성하면 테스트하기가 힘들어진다, express에서 타 프레임워크로 넘어갈 때 고쳐야 할게 많아진다, 코드의 중복작성을 방지할 수 있다.
 */
