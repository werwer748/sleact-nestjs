import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiQuery, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('DM')
@Controller('api/workspace/:url/dms')
export class DmsController {
  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 아이디',
  })
  @ApiQuery({
    name: 'perPage',
    required: true,
    description: '한번에 가져오는 갯수',
  })
  @ApiQuery({
    name: 'page',
    required: true,
    description: '불러올 페이지',
  })
  @Get(':id/chats')
  getChat(@Query() query, @Param() param) {
    //   getChat(@Query('perPage') perPage, @Query('page') page) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @ApiParam({
    name: 'url',
    required: true,
    description: '워크스페이스 url',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: '사용자 아이디',
  })
  @Post(':id/chats')
  postChat(@Body() body) {
    console.log(body);
  }
}
