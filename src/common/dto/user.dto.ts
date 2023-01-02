import { ApiProperty } from '@nestjs/swagger';
import { JoinRequestDto } from 'src/users/dto/join.request.dto';

export class UserDto extends JoinRequestDto {
  //validation라이브러리를 사용하면 class로 만드는 이유를 하나 더 늘릴수 있다. 검증을 바디 받으면서 할수있다고 함.
  @ApiProperty({
    required: true,
    example: 1,
    description: '아이디',
  })
  id: number;

  //   @ApiProperty({
  //     required: true,
  //     example: 'hugo@sleact.com',
  //     description: '이메일',
  //   })
  //   email: string;
}
