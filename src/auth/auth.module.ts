import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';

import { AuthService } from './auth.service';
import { LocalStrategy } from './local.strategy';
import { LocalSerializer } from './local.serializer';

@Module({
  imports: [
    PassportModule.register({ session: true }),
    TypeOrmModule.forFeature([Users]),
    // UsersModule 유저 모듈에서 exports에 서비스를 추가했기 때문에 유저 서비스를 쓰기위해서 이런식으로 가져옴
  ],
  providers: [AuthService, LocalStrategy, LocalSerializer],
})
export class AuthModule {}
