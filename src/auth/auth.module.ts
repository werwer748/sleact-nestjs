import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';

@Module({
  imports: [
    // 다른 모듈을 가져다 쓸때는 import를 해줘야 한다.
    PassportModule.register({ session: true }), // token쓸꺼면 false
    TypeOrmModule.forFeature([Users]),
    //UsersModule: auth에서 UsersService를 사용할 수 있게 해준다.
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer], // Injectable 붙은 것들
  // controllers는 컨트롤러
  // exports는 providers들을 다른 모듈에서 사용할 수 있게 해준다.
})
export class AuthModule {}
