import multer from 'multer';
import path from 'path';
import fs from 'fs';
import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiCookieAuth, ApiTags } from '@nestjs/swagger';
import { FilesInterceptor } from '@nestjs/platform-express';
import { LoggedInGuard } from '../auth/logged-in.guard';
import { ChannelsService } from './channels.service';
import { User } from '../common/decoratos/user.decorator';
import { PostChatDto } from './dto/post-chat.dto';

try {
  fs.readdirSync('uploads');
} catch (error) {
  console.error('uploads 폴더가 없어 uploads 폴더를 생성합니다.');
  fs.mkdirSync('uploads');
}

@ApiTags('CHANNEL')
@ApiCookieAuth('connect.sid')
@UseGuards(LoggedInGuard)
@Controller('api/workspaces/:url/channels')
export class ChannelsController {
  constructor(private channelsService: ChannelsService) {}
  @Get()
  getAllChannels(@Param('url') url: string, @User() user) {
    return this.channelsService.getWorkspaceChannels(url, user.id);
  }

  @Post()
  createChannels() {
    console.log('나중에...');
  }

  @Get(':name')
  getSpecificChannel(@Param('name') name: string) {
    console.log('나중에...');
  }

  @Get(':name/chats')
  getChats(@Query() query, @Param() param) {
    //   getChat(@Query('perPage') perPage, @Query('page') page) {
    console.log(query.perPage, query.page);
    console.log(param.id, param.url);
    return this.channelsService.getWorkspaceChannelChats(
      param.url,
      param.name,
      query.perPage,
      query.page,
    );
  }

  @Post(':name/chats')
  postChat(
    @Param('url') url: string,
    @Param('name') name: string,
    @Body() body: PostChatDto,
    @User() user,
  ) {
    return this.channelsService.postChat({
      url,
      content: body.content,
      name,
      myId: user.id,
    });
  }

  @UseInterceptors(
    FilesInterceptor('image', 10, {
      storage: multer.diskStorage({
        destination(req, file, cb) {
          cb(null, 'uploads/');
        },
        filename(req, file, cb) {
          const ext = path.extname(file.originalname);
          cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
        },
      }),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  @Post(':name/images')
  postImages(
    @Param() param,
    @User() user,
    @UploadedFiles() files: Express.Multer.File[],
  ) {
    return this.channelsService.createWorkspaceChannelImages(
      param.url,
      param.name,
      files,
      user.id,
    );
  }

  @Get(':name/unreads')
  getUnreads(
    @Param('url') url: string,
    @Param('name') name: string,
    @Query('after') after: number,
  ) {
    return this.channelsService.getChannelUnreadsCount(url, name, after);
  }

  @Get(':name/members')
  getAllMembers(@Param() param) {
    return this.channelsService.getWorkspaceChannelMembers(
      param.url,
      param.name,
    );
  }

  @Post(':name/members')
  inviteMembers() {
    throw new HttpException('Forbidden', 403);
  }
}
