import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { UsersModule } from './users/users.module';
import { WorkspacesModule } from './workspaces/workspaces.module';
import { ChannelsModule } from './channels/channels.module';
import { DmsModule } from './dms/dms.module';

import { ChannelChats } from './entities/ChannelChats';
import { ChannelMembers } from './entities/ChannelMembers';
import { Channels } from './entities/Channels';
import { DMs } from './entities/DMs';
import { Mentions } from './entities/Mentions';
import { Users } from './entities/Users';
import { WorkspaceMembers } from './entities/WorkspaceMembers';
import { Workspaces } from './entities/Workspaces';
import { AuthModule } from './auth/auth.module';
import { EventsModule } from './events/events.module';

// const getEnv = () => {
//   // env를 외부에서 가져왔을 때 함수로 만들고 load에 넣어준다.
//   return {
//     SECRET: '블라블라',
//     NAME: '캉캉캉',
//   };
// };

// express에서 router를 app.js(ts)에 등록해 사용했던 것처럼 여기에 모듈을 등록해 사용한다.
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '127.0.0.1',
      port: 3306,
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
      synchronize: false,
      logging: true,
      keepConnectionAlive: true,
      charset: 'utf8mb4_general_ci',
    }),
    // TypeOrmModule.forFeature([Users, WorkspaceMembers]), // forFeature는 특정 모듈에서만 사용할 수 있게 해준다.
    AuthModule,
    UsersModule,
    WorkspacesModule,
    ChannelsModule,
    DmsModule,
    EventsModule,
  ],
  // imports: [ConfigModule.forRoot({ isGlobal: true, load: [getEnv] })], // env를 외부에서 가져왔을 때 연결방법
  controllers: [AppController],
  providers: [AppService, ConfigService],
  // 여기에 UsersServices연결했더니 에러가 발생. UsersModule쪽하고 중복호출분제일꺼같기도...
  // 아마 UsersService를 UsersModule에서 exports에 포함해서 뭔가 충돌난거같다.
  /*
  providers: [AppService]
  => 원형: providers: [{ provide: AppService, useClass: AppService }] 같은 형태임. 이걸알아야 custom provider를 만들 수 있다.
  provide는 고유한 키인데 injectable한 class를 쓰면 그 class명을 고유한 키로 사용한다.
  useClass는 provide에 해당하는 class를 사용한다는 의미이다.
  useValue는 provide에 해당하는 값을 사용한다는 의미이다.
  useFactory는 provide에 해당하는 factory(함수)를 사용한다는 의미이다.
  */
  // exports: [] 도 있음
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
