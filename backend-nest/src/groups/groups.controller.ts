import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe, UseGuards } from '@nestjs/common';
import { GroupsService } from './groups.service.js';
import { JoinGroupDto } from './dto/join-group.dto.js';
import { UpdateGroupDto } from './dto/update-group.dto.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) { }

  @Post('join')
  join(@Body() joinGroupDto: JoinGroupDto, @CurrentUser('userId') userId: number) {
    return this.groupsService.joinByShareCode(joinGroupDto, userId);
  }

  @Get()
  findAll(@CurrentUser('userId') userId: number) {
    return this.groupsService.findAll(userId);
  }

  @Get(':id/expenses')
  findExpenses(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.groupsService.findExpenses(id, userId);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser('userId') userId: number) {
    return this.groupsService.findOne(id, userId);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() updateGroupDto: UpdateGroupDto) {
    return this.groupsService.update(id, updateGroupDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.groupsService.remove(id);
  }
}