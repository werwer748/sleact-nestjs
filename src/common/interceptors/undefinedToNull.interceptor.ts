import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class UndefinedToNullInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler<any>,
  ): Observable<any> | Promise<Observable<any>> {
    // 컨트롤러 전
    return next
      .handle()
      .pipe(map((data) => (data === undefined ? null : data))); // 컨트롤러 후
    /*
     * { data: user, code: 'SUCCESS' } 이런식으로 묶여지게끔
     * 근데 여기는 undefined를 거르기 위한 용도니까 상기 코드 확인
     */
  }
}

//& AOP?

// A -> B -> C -> D

// A -> E -> D

// A -> G -> H -> D

// A -> I -> D

// * 상기된 네개의 컨트롤러? 혹은 라우터 네개의 순서 중 공통된 순서가 존재
// * 이때 express같은 경우는 middleware로 처리 <- 이게 AOP의 전반적인 개념?
// * 그러니까, 공통된 로직을 적용하는 방법인듯?
