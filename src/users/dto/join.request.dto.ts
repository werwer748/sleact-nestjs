import { ApiProperty } from '@nestjs/swagger';

// export default 를 안씀, interface 보다 class => class는 타입역할도 하고 js로 컴파일 되어도 남아있음
export class JoinRequestDto {
  @ApiProperty({
    example: 'hugo@gmail.com',
    description: '이메일',
    required: true,
  })
  public email: string;

  @ApiProperty({
    example: '휴고',
    description: '닉네임',
    required: true,
  })
  public nickname: string;

  @ApiProperty({
    example: 'password',
    description: '비밀번호',
    required: true,
  })
  public password: string;
}
