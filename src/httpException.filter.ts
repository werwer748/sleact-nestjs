import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as
      | { message: any; statusCode: number }
      | { error: string; statusCode: 400; message: string[] }; //? class-validator 형식

    // console.log(status, err);
    if (typeof err !== 'string' && err.statusCode === 400) {
      // * class-validator가 발생시킨 에러
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }

    response.status(status).json({
      // * 직접 작성한 에러
      success: false,
      code: status,
      data: err,
    });

    //? 어쩌다보니 사실 if가 필요없게 되었지만 여기서 에러를 어떻게 던져주는지 포멧팅이 가능하다 정도로 알고 넘어가자.
    //TODO intercepter는 다른곳에 활용하고 이런 데이터 체크에서는 validator를 활용하자
  }
}
