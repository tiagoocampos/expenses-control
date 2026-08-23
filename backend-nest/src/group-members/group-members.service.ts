import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class GroupMembersService {
    constructor(private prisma: PrismaService) { }

    async leaveGroup(groupId: number, userId: number) {
        const membership = await this.prisma.groupMember.findUnique({
            where: { groupId_userId: { groupId, userId } },
        });

        if (!membership) {
            throw new NotFoundException('Você não é membro deste grupo');
        }

        await this.prisma.groupMember.delete({
            where: { groupId_userId: { groupId, userId } },
        });

        return { message: 'Você saiu do grupo' };
    }
}