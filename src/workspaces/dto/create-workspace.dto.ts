import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateWorkspaceDto {
  //PickType을 적극 확용해서 중복코드를 줄여보자... 다음에
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '슬리액트',
    description: '워크스페이스명',
  })
  public workspace: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: 'sleact',
    description: 'url 주소',
  })
  public url: string;
}
