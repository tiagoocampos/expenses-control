import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

import { UpdateGroupDto } from './dto/update-group.dto.js';
import { JoinGroupDto } from './dto/join-group.dto.js';

@Injectable()
export class GroupsService {
  constructor(private prisma: PrismaService) { }

  async joinByShareCode(joinGroupDto: JoinGroupDto, currentUserId: number) {
    const targetUser = await this.prisma.user.findUnique({
      where: { shareCode: joinGroupDto.shareCode },
    });

    if (!targetUser) throw new NotFoundException('Código inválido');
    if (targetUser.id === currentUserId) {
      throw new BadRequestException('Você não pode usar seu próprio código');
    }


    const existingGroup = await this.prisma.group.findFirst({
      where: {
        AND: [
          { members: { some: { userId: currentUserId } } },
          { members: { some: { userId: targetUser.id } } },
        ],
      },
      include: { members: { include: { user: { select: { id: true, name: true } } } } },
    });

    if (existingGroup) return existingGroup;

    const currentUser = await this.prisma.user.findUnique({ where: { id: currentUserId } });

    const group = await this.prisma.group.create({
      data: {
        name: `${currentUser!.name} & ${targetUser.name}`,
        members: {
          create: [{ userId: currentUserId }, { userId: targetUser.id }],
        },
      },
      include: { members: { include: { user: { select: { id: true, name: true } } } } },
    });

    return group;
  }

  findAll(userId: number) {
    return this.prisma.group.findMany({
      where: { members: { some: { userId } } },
      include: { members: { include: { user: { select: { id: true, name: true } } } } },
    });
  }

  async findOne(id: number, userId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { members: { include: { user: { select: { id: true, name: true } } } } },
    });

    if (!group) throw new NotFoundException('Grupo não encontrado');
    if (!group.members.some((m) => m.userId === userId)) {
      throw new NotFoundException('Grupo não encontrado');
    }

    return group;
  }

  async findExpenses(id: number, userId: number) {
    await this.findOne(id, userId);

    return this.prisma.expense.findMany({
      where: { groupId: id },
      include: {
        category: true,
        splits: true,
        user: { select: { id: true, name: true } },
      },
      orderBy: { date: 'desc' },
    });
  }

  async update(id: number, updateGroupDto: UpdateGroupDto, userId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!group || !group.members.some((m) => m.userId === userId)) {
      throw new NotFoundException('Grupo não encontrado');
    }

    return this.prisma.group.update({ where: { id }, data: updateGroupDto });
  }

  async remove(id: number, userId: number) {
    const group = await this.prisma.group.findUnique({
      where: { id },
      include: { members: true },
    });

    if (!group || !group.members.some((m) => m.userId === userId)) {
      throw new NotFoundException('Grupo não encontrado');
    }

    return this.prisma.group.delete({ where: { id } });
  }
}