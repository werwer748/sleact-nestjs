import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';

// const getEnv = () => {
//   // env를 외부에서 가져왔을 때 함수로 만들고 load에 넣어준다.
//   return {
//     SECRET: '블라블라',
//     NAME: '캉캉캉',
//   };
// };

// express에서 router를 app.js(ts)에 등록해 사용했던 것처럼 여기에 모듈을 등록해 사용한다.
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  // imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })], // env를 외부에서 가져왔을 때 연결방법
  controllers: [AppController],
  providers: [AppService, ConfigService],
  /*
  providers: [AppService]
  => 원형: providers: [{ provide: AppService, useClass: AppService }] 같은 형태임. 이걸알아야 custom provider를 만들 수 있다.
  provide는 고유한 키인데 injectable한 class를 쓰면 그 class명을 고유한 키로 사용한다.
  useClass는 provide에 해당하는 class를 사용한다는 의미이다.
  useValue는 provide에 해당하는 값을 사용한다는 의미이다.
  useFactory는 provide에 해당하는 factory(함수)를 사용한다는 의미이다.
  */
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
