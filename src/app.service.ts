import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from './users/users.service';

/**
 * 서비스 컨트롤러 분리의 이유:
 * 서비스는 요청, 응답에 대해서는 모른다.
 * 서비스 로직의 재사용 가능, 테스트시 편리함
 * nest에서 구조를 강제하기도 함
 */
@Injectable()
export class AppService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {}

  getHello(): string {
    this.usersService.getUsers();
    return this.configService.get('SECRET');
  }
}
