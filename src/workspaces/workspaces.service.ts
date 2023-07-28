import { DataSource, In, Repository } from 'typeorm';
import { Workspaces } from '../entities/Workspaces';
import { Channels } from '../entities/Channels';
import { WorkspaceMembers } from '../entities/WorkspaceMembers';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Users } from '../entities/Users';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

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
    return this.usersRepository
      .createQueryBuilder('user')
      .innerJoin('user.WorkspaceMembers', 'members')
      .innerJoin('members.Workspace', 'workspace', 'workspace.url = :url', {
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
}
