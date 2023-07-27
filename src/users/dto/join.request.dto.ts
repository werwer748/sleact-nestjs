import { PickType } from '@nestjs/swagger';
import { Users } from '../../entities/Users';

// export default 를 안씀, interface 보다 class => class는 타입역할도 하고 js로 컴파일 되어도 남아있음
// export class JoinRequestDto { // 이런식으로 작성이 기본이지만 중복되는 코드가 entities에 있으므로 PickType을 사용한다.
//   @ApiProperty({
//     example: 'hugo@gmail.com',
//     description: '이메일',
//     required: true,
//   })
//   public email: string;

//   @ApiProperty({
//     example: '휴고',
//     description: '닉네임',
//     required: true,
//   })
//   public nickname: string;

//   @ApiProperty({
//     example: 'password',
//     description: '비밀번호',
//     required: true,
//   })
//   public password: string;
// }
export class JoinRequestDto extends PickType(Users, [
  'email',
  'nickname',
  'password',
] as const) {}
