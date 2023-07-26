import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiTags, ApiResponse } from '@nestjs/swagger';
import { JoinRequestDto } from './dto/join.request.dto';
import { UsersService } from './users.service';
import { UserDto } from 'src/common/dto/user.dto';
import { User } from 'src/common/decoratos/user.decorator';
import { UndefinedToNullInterceptor } from 'src/common/interceptors/undefinedToNull.interceptor';

@UseInterceptors(UndefinedToNullInterceptor)
@ApiTags('USERS')
@Controller('api/users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiResponse({
    status: 500,
    description: '서버 에러',
  })
  @ApiOperation({ summary: '내 정보 조회' })
  @Get()
  getUsers(@User() user) {
    return user;
  }

  @ApiOperation({ summary: '회원가입' })
  @Post()
  postUsers(@Body() body: JoinRequestDto) {
    this.usersService.postUsers(body);
  }

  @ApiResponse({
    status: 200,
    description: '성공',
    type: UserDto,
  })
  @ApiOperation({ summary: '로그인' })
  @Post('login')
  login(@User() user) {
    return user; // 추후 passport 붙일 예정
  }

  @ApiOperation({ summary: '로그아웃' })
  @Post('logout')
  logout(@Req() req, @Res() res) {
    // 의존성이 강해지지만 logout같은 경우는 괜찮다고 생각함.
    req.logout();
    res.clearCookie('connect.sid', { httpOnly: true });
    res.send('ok');
    // req.session.destroy();
  }
}
