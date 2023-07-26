import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

/**
 * @붙이는 것은 데코레이터라고 한다.
 * 이걸 읽어서 작동하게 만드는 것을 IoC(Inversion of Control: 제어의 역전)라고 한다.
 *
 *
 * 서비스, 컨트롤러 분리의 이유:
 * 컨트롤러는 요청, 응답에 대해서는 알고있다.
 * 서비스 로직의 재사용 가능, 테스트시 편리함
 * nest에서 구조를 강제하기도 함
 */

@Controller() // api의 엔트리 포인트를 정의하는 데 사용되는 데코레이터 첫번째 인수로 경로를 받는다.
export class AppController {
  constructor(private readonly appService: AppService) {}
  /*
   * 커스터마이징한 provider를 사용하려면 아래와 같이 사용한다.
   * constructor(
   * private readonly appService: AppService,
   * @Inject('provide에 지정한 키값') private readonly 수행할 내용
   * ) {}
   */
  /*
  ? 객체를 내부에서 만들어서 객체에서 다른 객체에 의존하면 결합성이 강해져서 단일 책임 분리(원칙)가 어긋나게 된다?
  그러니까 단일책임 원칙을 지키기위해서 개별적인 기능을 하는 객체를 만들고 의존성을 주입해서 유연한 틀처럼 사용해 이 문제를 해결한 것 같음.
  */

  @Get() // 인수로 경로를 받는다. ex) Controller('/a') Get('/b') => GET /a/b
  getHello(): string {
    // injectable해서 의존성을 주입했기 때문에 유동적으로(하나의 틀처럼) 사용이 가능하다.
    // constructor를 매개변수처럼 사용할 수 있다.
    return this.appService.getHello();
  }
}
