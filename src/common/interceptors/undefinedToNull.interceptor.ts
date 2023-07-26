import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

/*
* interceptor?
* AOP(Aspect Oriented Programming)의 한 종류로써, 메소드의 호출과 그 반환값을
* 가로채서 원하는 작업을 수행할 수 있게 해준다.

* interceptor를 사용하는 이유?
* 컨트롤러 실행 전 후 해서 특정 동작을 넣어줄 수 있다.
*/

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 전 부분
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data)));
    // data => 컨트롤러에서 리턴해주는 데이터
    // 강사의 경우 보통 컨트롤러에서 리턴해주는 데이터를 가공하는데 interceptor를 사용한다.
  }
}
