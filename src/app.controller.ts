import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';

/*
 * AppService의 역할?
 * 비즈니스 로직의 분리!
 */

@Controller() // ('abc') - 공통주소
export class AppController {
  //appService: AppService(DI)활용하여 넣어주면 바로 import해서 쓰는 것 보다 활용성 측면에 이득이 있다.
  //& providers에서 useValue사용시 appService: AppService 여기를 useValue값으로 쓰겠다는 뜻.(useFactory등의 다른걸 쓸경우 그게 된다.)
  constructor(
    private readonly appService: AppService, //? 커스텀 프로바이더 사용시 @Injectable('CUSTOM_KEY') private readonly customValue
  ) {}

  //? @ 데코레이터(에노케이션) - 함수라고?
  //IoC(제어의 역전) Inversion of Control

  //? 이렇게 작성하면 router를 만들어 준다.
  //@Get('user') // GET /abc/user 세부주소
  // getUser(@Res() res) 하면 express처럼 쓸 수 있으나 나중에 테스트할때 힘들다.
  /*
  getUser(): string {
    // TODO : 해당 요청이 들어오면? => app.service.ts 확인
    return this.appService.getUser();
  }

  @Post('user') // POST /abc/user
  postUser(): string {
    return this.appService.postUser();
  }
  */

  @Get()
  getHello() {
    return this.appService.getHello();
  }
}
