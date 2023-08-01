import { Module } from '@nestjs/common';
import { ChannelsService } from './channels.service';
import { ChannelsController } from './channels.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Channels } from '../entities/Channels';
import { ChannelMembers } from '../entities/ChannelMembers';
import { Workspaces } from '../entities/Workspaces';
import { ChannelChats } from '../entities/ChannelChats';
import { Users } from '../entities/Users';
import { EventsModule } from '../events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Channels,
      ChannelMembers,
      Workspaces,
      ChannelChats,
      Users,
    ]),
    EventsModule, // EventsGateway를 EventsModule에 담고있으므로 EventsModule을 임포트
  ],
  providers: [ChannelsService], //EventsGateway를 이곳에 추가하면 여러가지 사이드이펙트가 생길수있음.
  controllers: [ChannelsController],
})
export class ChannelsModule {}
