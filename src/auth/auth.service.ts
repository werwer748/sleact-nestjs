import { Injectable } from '@nestjs/common';
import bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from '../entities/Users';
import { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  //   constructor(private userService: UsersService) {}
  constructor(
    @InjectRepository(Users) private usersRepository: Repository<Users>, // 서비스 내부에서 서비스를 호출해도 되지만 테스트가 힘들어질수 있다. 레포지토리를 바로 불러 쓸수 있다면 적당히 쓰는것도 좋은 방법인듯
  ) {}

  async validateUser(email: string, password: string) {
    // const user = await this.userService.findByEmail(email);
    //? 귀찮으니까 직접 작성해보자.
    const user = await this.usersRepository.findOne({
      where: { email },
      select: ['email', 'password', 'id', 'nickname'],
    });
    if (!user) {
      return null;
    }
    console.log('authService', password, user);
    const result = await bcrypt.compare(password, user.password);
    if (result) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  }
}
