import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from 'src/common/decorators/user.decorator';
import { UserDto } from 'src/common/dto/user.dto';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';

@ApiTags('USER')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {
    //! 의존성 주입을 위해
  }

  @ApiResponse({
    status: 200,
    description: '정보조회 성공',
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: '정보조회 실패 - 서버 에러',
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get() //^ GET - /api/users
  getUsers(@User() user) {
    //(@Req() req) { <= 커스텀 데코레이터 적용 전 코드
    //! 여기서도 쓰긴했지만 (어쩔수없이?) 진짜 안쓰는게 좋음 추후 숨기는거 보여준다고 함.
    //! 커스텀 데코레이터를 사용하여 req를 안써도 user를 가져 올 수 있게 한다.
    return user; //req.user; <= 커스텀 데코레이터 적용 전 코드
    // res.locals.jwt <- 보통 여서 토큰 많이 써는데 res, req가 꼭 필요함
    // 하지만 이런거는 안써주는게 좋기때문에 커스텀 데코레이터라는걸 쓴다.
  }

  @ApiOperation({ summary: '회원가입' })
  @Post() //^ POST - /users @Body: express의 body-parser같은 역할
  postUsers(@Body() body: JoinRequestDto) {
    //* 회원가입에서 받아야하는 값들. Dto? 데이터 트랜스포 오브젝트: 데이터를 전달하는 오브젝트
    this.usersService.postUsers(body.email, body.nickname, body.password);
    //* this.userService를 위해 의존성 주입을 해야함.
  }

  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login') //^ POST - /users/login
  login(@User() user) {
    //TODO 패스포트 붙일예정
    return user;
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout') //^ POST - /users/logout
  logOut(@Req() req, @Res() res) {
    /*
     * 웬만하면 이렇게 안쓰는게 좋다 (controller는 요청, 응답에 대해 모르는게 테스트 할 때 좋다. - 서비스는 아에 알면안되고!)
     * 의존성주입 안됨 결합성이 너무 강해지기 때문에 방해가된다?
     * 그렇지만 로그아웃 같은 경우는 어쩔수 없는 듯.
     * request, response는 express 에 결합이 되어버림.
     */
    req.logOut();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok'); // 이 메서드들이 express를 그대로 따라감 => 그러니까 위 설명부터 종합적으로 express처럼 작성되어 버린게 문제인듯?...
  }
}
