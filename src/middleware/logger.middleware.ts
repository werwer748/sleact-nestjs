import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/*
 * implements를 사용하는 이유
 * implements를 쓰면 class에 implements된 것들을 무조건 구현해 줘야 한다.
 * 어차피 구현해야하기 때문에 implements를 붙임.
 * implements를 붙이지 않으면 구현하지 않아도 에러가 나지 않는다.
 * implements를 사용함으로 인해서 의도치않은 실수를 방지한다. 에디터와 린트의 도움을 적극적으로 받을 수 있음.
 */

/*
 * Injectable?
 * DI , dependency injection(의존성 주입)에 관련된 내용.
 * Injectable한것들을 provider라고 한다.
 * 이 provider들은 module > providers에 등록되어야 한다.
 * nest가 의존성 주입을 할때 provider를 찾아서 주입해준다.
 */

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // 실무에서는 nest morgan을 사용할 것을 추천. 지금 방식은 미들웨어 연결 예시를 위한 방법임
  private logger = new Logger('HTTP'); // 'HTTP'는 context로 사용된다. context는 로그를 구분할 때 사용된다.

  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent') || '';

    res.on('finish', () => {
      const { statusCode } = res;
      const contentLength = res.get('content-length');
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}}`,
      );
    });
    next();
  }
}
