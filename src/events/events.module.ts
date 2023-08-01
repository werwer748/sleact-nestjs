import { Module } from '@nestjs/common';
import { EventsGateway } from './events.gateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
  // 이 모듈을 임포트했는데 providers까지 쓰고싶으면 exports에 추가해줘야함.
})
export class EventsModule {}
