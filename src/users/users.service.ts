import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import bcrypt from 'bcrypt';

import { Users } from '../entities/Users';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    private dataSource: DataSource,
  ) {}
  getUsers() {
    console.log('getUsers!');
  }
  async join({ email, nickname, password }: JoinRequestDto) {
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
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // 트랜잭션 시작
    /*
    queryRunner 방식으로 트랜잭션을 사용할 때는
    this.usersRepository 이렇게 this를 통해서 불러오면 트랜잭션을 사용할 수 없다.
    앱 모듈에 연결한 TypeOrmModule.forRoot()를 사용하게 되기 때문인데 해당 요청에서
    직접 DB에 연결했기 때문에 this를 사용하지 않고 직접 연결하여 사용한다.
    */
    // const user = await this.usersRepository.findOne({
    //   where: { email: data.email },
    // }); => queryRunner.manager.getRepository(Users) 이렇게 사용해야한다.
    const user = await queryRunner.manager
      .getRepository(Users)
      .findOne({ where: { email } });
    if (user) {
      throw new UnauthorizedException('이미 존재하는 사용자입니다.');
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    try {
      const returned = await queryRunner.manager.getRepository(Users).save({
        email,
        nickname,
        password: hashedPassword,
      });

      // await this.workspaceMembersRepository.save({
      //   UserId: returned.id,
      //   WorkspaceId: 1,
      // }); // 기본적인 데이터 맵핑 방식의 레포지토리 사용법
      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMembers)
        .create();
      workspaceMember.UserId = returned.id;
      workspaceMember.WorkspaceId = 1;
      await queryRunner.manager
        .getRepository(WorkspaceMembers)
        .save(workspaceMember);

      await queryRunner.manager.getRepository(ChannelMembers).save({
        ChannelId: 1,
        UserId: returned.id,
      });
      await queryRunner.commitTransaction(); // 에러가 없으면 커밋
      return true;
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction(); // 에러가 발생하면 롤백
    } finally {
      await queryRunner.release(); // 트랜잭션 종료
    }
  }
}
