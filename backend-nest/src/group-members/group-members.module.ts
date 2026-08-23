import { Module } from '@nestjs/common';
import { GroupMembersService } from './group-members.service';
import { GroupMembersController } from './group-members.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [GroupMembersController],
  providers: [GroupMembersService],
})
export class GroupMembersModule { }
