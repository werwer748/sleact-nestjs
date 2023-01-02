import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
/*
 * 라이브러리를 쓰면 ex)dotenv 기존 라이브러리 설정대로 써도 설정을 잘하면 돌아가지만 기본적으로
 * nest의 모듈 시스템을 활용하여 nest의 모듈 처럼 만들어서 사용하는 것이 중요함.
 */
declare const module: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.PORT || 3000;

  const config = new DocumentBuilder()
    .setTitle('Sleact API')
    .setDescription('Sleact 개발을 위한 API 문서입니다.')
    .setVersion('1.0') //버전관리 중요함. 기존 사용자들에게 혼란을 초례할 수 있음.
    .addCookieAuth('connect.sid')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(port);

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }

  console.log(`서버 ${port}PORT에서 실행중`);
}
bootstrap();
