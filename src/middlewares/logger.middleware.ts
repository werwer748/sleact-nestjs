import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

/*
    nest자체적인 logger기능 소개를 위해 구현.
    하지만 morgan이 사용가능하다고 하니 나중에 구현해볼생각
*/

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  // implements를 쓰면 강제사항이 생긴다? 써야되는 규칙을 강제해준다? 같은 느낌
  private logger = new Logger('HTTP'); // context를 써준것. 로그가 쌓이면 보기가 힘든데 HTTP관련 요청은 따로 표시를 해주게끔

  //이 미들웨어는 라우터보다 먼저 실행된다.
  use(request: Request, response: Response, next: NextFunction): void {
    //리퀘스트에 대한거 먼저 기록
    const { ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || '';

    //라우터 끝날때에 기록함.
    response.on('finish', () => {
      // router끝나고(finish되고 나서) 처리되기때문에 비동기 on이 들어감
      const { statusCode } = response;
      const contentLength = response.get('content-length');
      //* Logger.log( <= 컨택스트 사용 안할 시 and nest에서는 console.log보다 Logger 많이 씀
      this.logger.log(
        `${method} ${originalUrl} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
      );
    });

    //라우터로 감. 여기서 끝나고 .on('finish')로 간다.
    next();
  }
}
