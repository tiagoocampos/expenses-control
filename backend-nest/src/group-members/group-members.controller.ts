import { Controller, Delete, Param, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GroupMembersService } from './group-members.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('group-members')
export class GroupMembersController {
  constructor(private readonly groupMembersService: GroupMembersService) { }

  @Delete(':groupId')
  leave(@Param('groupId', ParseIntPipe) groupId: number, @CurrentUser('userId') userId: number) {
    return this.groupMembersService.leaveGroup(groupId, userId);
  }
}