import { DataSource, Repository } from 'typeorm';
import { Workspaces } from '../entities/Workspaces';
import { Channels } from '../entities/Channels';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class WorkspacesService {
  constructor(
    // 이 클래스를 상속받아쓸때 DI가 되지않는경우 constructor 없이 상속값을 쓴다.
    @InjectRepository(Workspaces)
    private workspacesRepository: Repository<Workspaces>,
    @InjectRepository(Channels)
    private channelsRepository: Repository<Channels>,
    @InjectRepository(WorkspaceMembers)
    private workspaceMembersRepository: Repository<WorkspaceMembers>,
    @InjectRepository(ChannelMembers)
    private channelMembersRepository: Repository<ChannelMembers>,
    @InjectRepository(Users)
    private usersRepository: Repository<Users>,
    private dataSource: DataSource,
  ) {}

  async findById(id: number) {
    // return this.workspacesRepository.findByIds([id]);
    return this.workspacesRepository.findOne({ where: { id } });
  }

  async findMyWorkspaces(myId: number) {
    return this.workspacesRepository.find({
      where: {
        WorkspaceMembers: [{ UserId: myId }],
      },
    });
  }

  async createWorkspace(name: string, url: string, myId: number) {
    /*
    const workspace = this.workspacesRepository.create({
      // create시 엔티티 객체를 만드는거지 실제 DB에 저장하는게 아니다.
      name,
      url,
      OwnerId: myId,
    });
    const returned = await this.workspacesRepository.save(workspace); // 실제 DB에 저장하는 부분

    const workspaceMember = new WorkspaceMembers();
    workspaceMember.UserId = myId;
    workspaceMember.WorkspaceId = returned.id;
    await this.workspaceMembersRepository.save(workspaceMember);
    const channel = new Channels();
    channel.name = '일반';
    channel.WorkspaceId = returned.id;
    const channelReturned = await this.channelsRepository.save(channel);
    const channelMember = new ChannelMembers();
    channelMember.UserId = myId;
    channelMember.ChannelId = channelReturned.id;
    await this.channelMembersRepository.save(channelMember);
    */
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction(); // 트랜잭션 시작
    try {
      const workspace = queryRunner.manager.getRepository(Workspaces).create({
        name,
        url,
        OwnerId: myId,
      });
      const returned = await queryRunner.manager
        .getRepository(Workspaces)
        .save(workspace);

      const workspaceMember = queryRunner.manager
        .getRepository(WorkspaceMembers)
        .create({
          UserId: myId,
          WorkspaceId: returned.id,
        });
      const channel = queryRunner.manager.getRepository(Channels).create({
        name: '일반',
        WorkspaceId: returned.id,
      });

      const [_, channelReturned] = await Promise.all([
        queryRunner.manager
          .getRepository(WorkspaceMembers)
          .save(workspaceMember),
        queryRunner.manager.getRepository(Channels).save(channel),
      ]);

      const channelMember = queryRunner.manager
        .getRepository(ChannelMembers)
        .create({
          UserId: myId,
          ChannelId: channelReturned.id,
        });
      await queryRunner.manager
        .getRepository(ChannelMembers)
        .save(channelMember);
    } catch (error) {
      console.error(error);
      await queryRunner.rollbackTransaction(); // 에러가 발생하면 롤백
    } finally {
      queryRunner.release();
    }
  }

  async getWorkspaceMembers(url: string) {
    // queryBuilder는 쿼리와 최대한 비슷하게 작성할 수 있게 해준다.
    return this.usersRepository
      .createQueryBuilder('user') // user라는 별칭을 준다.(user는 Users 엔티티)
      .innerJoin('user.WorkspaceMembers', 'members') // 다대다 관계를 잘 맺어 놨다면 이 줄은 생략이 가능
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        // :url은 파라미터, {}는 파라미터로 넘길 값
        url,
      })
      .getMany();
    /*
    ID, EMAIL, PASSWORD, Workspace.NAME, Workspace.URL => getRawMany() 사용
    {
        id: '',
        email: '',
        password: '',
        'Workspace.name': '',
        'Workspace.url': '', // 이런식으로 나온다.
    }
    */
    /*
    getMany() 사용시
    {
        id: '',
        email: '',
        password: '',
        Workspace: {
            name': '',
            url': '',
        }
    }
    */
  }

  async createWorkspaceMembers(url: string, email: string) {
    const workspace = await this.workspacesRepository.findOne({
      where: { url },
      // relations: ['Channels'], // 아래 join과 같은 역할을 한다. 둘 중에 하나만 써야 됨
      join: {
        alias: 'workspace',
        innerJoinAndSelect: {
          // innerJoinAndSelect는 select * from 한 것처럼 죠인한 테이블 정보까지 가져온다.
          channels: 'workspace.Channels',
        },
        /*
        leftJoin도 사용 가능함.
        innerJoin은 양쪽에 데이터가 있는것들을 합칠 때 사용
        leftJoin은 한쪽이 비어있으면 비어있는데(null)로 데이터를 가져다 합침
        outerJoin은 양쪽에 데이터가 없어도 데이터를 합침
        */
      },
    });
    // this.workspacesRepository.createQueryBuilder('workspace').innerJoinAndSelect('workspace.Channels', 'channels').getOne();
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('존재하지 않는 사용자입니다.');
    }
    const workspaceMember = new WorkspaceMembers();
    workspaceMember.WorkspaceId = workspace.id;
    workspaceMember.UserId = user.id;
    await this.workspaceMembersRepository.save(workspaceMember);
    const channelMember = new ChannelMembers();
    channelMember.ChannelId = workspace.Channels.find(
      (v) => v.name === '일반',
    ).id;
    channelMember.UserId = user.id;
    await this.channelMembersRepository.save(channelMember);
  }

  async getWorkspaceMember(url: string, id: number) {
    return this.usersRepository
      .createQueryBuilder('user')
      .where('user.id = :id', { id })
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
        url,
      })
      .getOne();
  }
}
