import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';
import bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
  ) {}
  getUsers() {
    console.log('getUsers!');
  }
  async join(data: JoinRequestDto) {
    // if (!data.email) {
    //   //throw new Error('이메일이 없습니다.'); // async 안에서는 throw new Error를 사용해도 서버가 죽지않는다.
    //   throw new BadRequestException('이메일이 없습니다.');
    //   // throw를 한경우 여기서 묻힌다. 컨트롤러에서 꺼내쓸때 async await으로 꺼내야 묻히지 않고 바깥으로 나감.
    // }
    // if (!data.nickname) {
    //   throw new BadRequestException('닉네임이 없습니다.');
    // }
    // if (!data.password) {
    //   throw new BadRequestException('비밀번호가 없습니다.');
    // } class-validator를 사용하면 이런식으로 안해도 된다.
    const user = await this.usersRepository.findOne({
      where: { email: data.email },
    });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(data.password, 12);
    await this.usersRepository.save({
      email: data.email,
      nickname: data.nickname,
      password: hashedPassword,
    });
  }
}
