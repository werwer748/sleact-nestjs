import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('CHANNEL')
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  @Get()
  getAllChannels() {}

  @Post()
  createChannels() {}

  @Get(':name')
  getSpecificChannel(@Param('name') name: string) {}

  @Get(':name/chats')
  getChat(@Query() query, @Param() param) {
    //   getChat(@Query('perPage') perPage, @Query('page') page) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':name/chats')
  postChat(@Body() body) {
    console.log(body);
  }

  @Get(':name/members')
  getAllMembers() {}

  @Post(':name/members')
  inviteMembers() {}
}
