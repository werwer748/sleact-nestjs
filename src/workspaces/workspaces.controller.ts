import { Body, Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WorkspacesService } from './workspaces.service';
import { Users } from '../entities/Users';
import { User } from '../common/decoratos/user.decorator';
import { CreateWorkspaceDto } from './dto/create-workspace.dto';

@ApiTags('WORKSPACES')
@Controller('api/workspaces')
export class WorkspacesController {
  constructor(private workspacesService: WorkspacesService) {}

  // @Get('/:myId')
  // getMyWorkspaces(@Param('myId', ParseIntPipe) myId: number) {
  //   // param은 기본적으로 string이다. ParseIntPipe를 통해 number로 바꿔준다.
  //   return this.workspacesService.findMyWorkspaces(myId);
  // } // 이런방법도 있다. nest에서 Req, Res 등을 바로쓰는게 좋은 설계가 아니기때문에 요런식의 처리도 알아두자.
  @Get() // Req, Res 등을 바로쓰는게 좋은 설계가 아니기때문에 커스텀 데코레이터를 만들어서 사용한다.
  getMyWorkspaces(@User() user: Users) {
    return this.workspacesService.findMyWorkspaces(user.id);
  }

  @Post()
  createWorkspace(@User() user: Users, @Body() body: CreateWorkspaceDto) {
    return this.workspacesService.createWorkspace(
      body.workspace,
      body.url,
      user.id,
    );
  }

  @Get(':url/members')
  getAllMembersFromWorkspace(@Param('url') url: string) {
    return this.workspacesService.getWorkspaceMembers(url);
  }

  @Post(':url/members')
  inviteMembersToWorkspace() {
    console.log('inviteMembersToWorkspace');
  }

  @Delete(':url/members/:id')
  kickMemberFromWorkspace() {
    console.log('kickMemberFromWorkspace');
  }

  @Get(':url/members/:id')
  getMemberInfoInWorkspace(@Param() param) {
    return this.workspacesService.getWorkspaceMember(param.url, param.id);
  }

  @Get(':url/users/:id')
  DEPRECATED_getMemberInfoInWorkspace(@Param() param) {
    this.getMemberInfoInWorkspace(param);
  }
}
