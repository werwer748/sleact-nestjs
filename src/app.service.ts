import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

//* 트랜젝션 단위로 짠다?
//* service는 요청, 응답은 모른다.
/*
@Injectable() //? Injectable() 로 묶이는 부분을 프로바이더 라고 부름
* Injectable: 디펜던시 인잭션(DI) DI 덕분에 만들어진 함수를 남이 이용하는것 처럼? 활용성이 커짐 ex) function a(a, b) { return a + b }; a(3, 5);
export class AppService {
  TODO : app.controller.ts에서 요청을 받으면 실제 비즈니스 로직인 서비스(이곳)으로 와서 DB 요청을 한다.
  async getUser(): string {
    const user = await User.findOne(); //* 순수하게 해야하는 동작만 수행하고 컨트롤러에게 돌려준다.
    return user;
  }

  async postUser(): string {
    const user = await User.create();
    return user;
  }

  async getHello() {
    return this.configService.get('NAME');
    //* process.env.NAME과 똑같음. 이렇게 쓰는 이유는 process.env가 외부객체(환경변수)이기 때문에 외부에서 불러오는 것 보다 내부적으로 nest가 모든걸 처리할 수 있게끔 하는것
    //* test시, 의존성 주입할때도 좋음

    ?그래서 정확히 this로 쓰게되면 뭐가 좋은데?
    * 객체를 내부에서 만들어서 객체에서 다른 객체에 의존하면 결합성이 강해지고 단일 책임분리가 어긋나게 된다.
    * 그래서 객체를 밖에서 만들어서 내부로 넘겨줌으로써 !결합성!을 낮추는 것!
  }
}
*/

@Injectable()
export class AppService {
  constructor(private readonly configService: ConfigService) {}

  async getHello() {
    return this.configService.get('NAME');
    //* process.env.NAME과 똑같음. 이렇게 쓰는 이유는 process.env가 외부객체(환경변수)이기 때문에 외부에서 불러오는 것 보다 내부적으로 nest가 모든걸 처리할 수 있게끔 하는것
    //* test시, 의존성 주입할때도 좋음
  }
}

/*
* 트랜젝션 이란?
* 더이상 분할이 불가능한 업무처리의 단위.
* 하나의 작업을 위해 더이상 분할될 수 없는 명령들의 모음! 즉, 한꺼번에 수행되어야 할 일련의 연산모음

*/
