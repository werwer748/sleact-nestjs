import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';

@Controller('api/workspaces/:url/dms')
export class DmsController {
  @Get(':id/chats') //api/workspaces/:url/dms/:id/chats
  getChat(@Query() query, @Param() param) {
    /*
    ?이렇게 작성도 가능함.
        @Query('perPage') perPage, @Query('page') page) {
        console.log(perPage, page); 
    */
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
  }

  @Post(':id/chats')
  postChat(@Body() body) {
    console.log(body);
  }
}
