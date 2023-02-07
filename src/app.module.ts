import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; //dotenv 추가를 위한 라이브러리
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';
import { UsersService } from './users/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import { AuthModule } from './auth/auth.module';

/*
const getEnv = async () => {
   기본적으로 이렇게 씀으로 env처럼 사용할 수 있고, 활용하면 외부에 저장해둔 키값들을 가져올 수 있다.
 const response = await axios.get('/비밀키요청'); //? <= 활용예제
   return {
     DB_PASSWORD: 'hugosnodejs',
     NAME: '강준기천재',
   };
  return response.data;
};
*/
//TODO 위처럼 사용시 imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })], load에 추가시켜줘야함.

//TODO 프로바이더들은 이 모듈에 넣어줘야함(친절하게 providers가 있다).
//? providers 를 보고 의존성주입을 해준다. (controllers, providers 똑같음. nest가 알아서 연결해준다.)
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      // port: 3306,
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [
        ChannelChats,
        ChannelMembers,
        Channels,
        DMs,
        Mentions,
        Users,
        WorkspaceMembers,
        Workspaces,
      ],
      // autoLoadEntities: true,
      synchronize: false, //* entities를 직접 만들고 db로 올릴때 true로 하고 생성된 후에는 false로 해줘야 데이터 상실을 방지 가능
      logging: true, //* orm이 sql문으로 변환한 코드를 확인할 수 있다.(개발할때 해놓기)
      keepConnectionAlive: true, //* 핫 리로딩시 디비연결 끊김 방지
      charset: 'utf8mb4',
    }),
    TypeOrmModule.forFeature([Users]),
  ],
  //^ 모듈 가져다쓸때 연결하는 곳 보통은 그냥 집어넣으면 되는데 ConfigModule.forRoot() 같은게 붙는 경우 설정을 추가해 주기 위해 붙는것
  controllers: [AppController],
  providers: [AppService, ConfigService, UsersService],

  /*
  TODO: ConfigService 추가해 주면 process.env이런식으로 꺼내쓰지 않아도 된다.
  ? providers: [AppService]의 원형
  providers: [
   {
     provide: AppService, => 고유한 키이지만 Injectable한 class는 고유힌 키로 사용이 가능하다.
     useClass: AppService, => provide에 넣은 값으로 실제 키값으로 사용하겠다!
     useClass/useValue/useFactory => 의존성 주입할 값을 컨드톨하게 되는것
     useValue: '123'
     useFactory: () => {
     별의별작업
       return {
         a: 'b'
       }  
     }
   },
   {
    provide: 'CUSTOM_KEY'
    useValue: 'CUSTOM_VALUE'
   }
  ]
  */
})
export class AppModule implements NestModule {
  // implements를 씀으로해서(규칙이 강제되니까) 어차피 써야하는거 써주면 오타같은 실수를 방지할 수 있다.(kotlin할때 본거같음)
  // 타입스크립트가 오타나 함수이름 매개변수 리턴값의 정확한 타입검사를 해주는용도 정도로 생각하자
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
