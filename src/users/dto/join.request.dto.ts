import { ApiProperty, PickType } from '@nestjs/swagger';
import { Users } from 'src/entities/Users';

//? nest에서는 export default를 안씀 그래서 import {} 로 써준다.
//? class와 interface 가장 큰 차이 => interface는 typescript에만 존재하고 컴파일 후 사라진다. class는 javascript로 바뀐후에도 남아있다.
//? 그래서 class가 type역할도 해줌 javascript로 바뀐 후에도 type검증(validation)을 수행할 수 있다.
export class JoinRequestDto extends PickType(Users, [
  //? entities에서 잘 만들어놓으면 이런식으로 사용가능
  'email',
  'nickname',
  'password',
] as const) {
  // @ApiProperty({
  //   example: 'werwer748@sleact.com',
  //   description: '이메일',
  //   required: true,
  // })
  // public email: string;
  // @ApiProperty({
  //   example: '휴고강',
  //   description: '닉네임',
  //   required: true,
  // })
  // public nickname: string;
  // @ApiProperty({
  //   example: 'qwer1234',
  //   description: '비밀번호',
  //   required: true,
  // })
  // public password: string;
}
