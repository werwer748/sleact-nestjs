import { Injectable } from '@nestjs/common';
import { JoinRequestDto } from './dto/join.request.dto';

@Injectable()
export class UsersService {
  getUsers() {
    console.log('getUsers!');
  }
  postUsers(data: JoinRequestDto) {
    console.log({ ...data });
  }
}
