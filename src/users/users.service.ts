import {
  BadRequestException,
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Users } from '../entities/Users';
//^ entitie = table
import bcrypt from 'bcrypt';

/*
 * Repository? 엔티티에 쿼리 날리는 class
 * 모둘 -> 컨트롤러 가 있고 컨트롤러는 서비스를 호출 함, 서비스(비즈니스 로직 담당)는 레포지토리를 통해서 엔티티에 쿼리를 날린다.
 * 테이블인 엔티티와 비즈니스로직을 담당하는 서비스를 이어주는게 레포지토리다 라고 이해하면 됨
 */
@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private userRepository: Repository<Users>,
  ) {} // DB도 DI(디펜던시 인젝션)을 해준다. 이걸로 테스트하거나 다른 디비에 데이터를 넣어볼때 용이하다.
  // getuser() {}

  async join(email: string, nickname: string, password: string) {
    // if (!email) {
    //   // throw new Error('이메일을 입력하세요.');
    //   throw new BadRequestException('이메일을 입력하세요.');
    // }
    // if (!nickname) {
    //   throw new BadRequestException('닉네임을 입력하세요.');
    // }
    // if (!password) {
    //   throw new BadRequestException('비밀번호를 입력하세요.');
    // }
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.'); //throw가 리턴기능도 수행함
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await this.userRepository.save({
      email,
      nickname,
      password: hashedPassword,
    });
  }
}
