import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/Users';
import { Repository } from 'typeorm';

@Injectable() // provider는 서로를 호출하는 경우가 많다.
export class AuthService {
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.usersRepository.findOne({
      // service로 처리시 테스트에서 모킹(가짜객체로 테스트하는거)이 힘들다. 그래서 컨트롤러 > 서비스 > 레포지토리 > 엔티티 이런 규칙이 있으면 좋지만 꼭 지켜야할 필요는 없다.
      where: { email },
      select: ['id', 'email', 'password', 'nickname'],
    });
    console.log(email, password, user);
    if (!user) {
      console.log('유저정보 없음');
      return null;
    }
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      console.log('유저정보 있고 비밀번호 암호화?', result);
      const { password, ...userWithoutPassword } = user; //? rest문법 구조분해할당시 { 제외할키값, ...rest }를 통해 특정 키값을 분리할 수 있다.
      //* rest문법 모를 시 => delete user.password;
      return userWithoutPassword;
    }
    return null;
  }
}
