import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();
    const err = exception.getResponse() as  //   | { message: any; statusCode: number }
      | { message: any; statusCode: 400 }
      | { error: string; statusCode: 400; message: string[] }; // class-validator를 사용하면 이런식,,

    // console.log(status, err);
    if (typeof err !== 'string' && err.statusCode === 400) {
      // class-validator가 발생시켜준 에러
      return response.status(status).json({
        success: false,
        code: status,
        data: err.message,
      });
    }

    response.status(status).json({
      // 내가 직접 발생시킨 에러
      success: false,
      code: status,
      data: err.message,
    });
  }
}
