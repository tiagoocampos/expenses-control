import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';

@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) { }

  async create(createExpenseDto: CreateExpenseDto, userId: number) {
    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) throw new NotFoundException('Usuário não encontrado');

    const { groupId, ...expenseData } = createExpenseDto;

    if (!groupId) {
      // gasto pessoal, sem grupo, sem split
      return this.prisma.expense.create({
        data: { ...expenseData, userId },
      });
    }

    const group = await this.prisma.group.findUnique({
      where: { id: groupId },
      include: { members: true },
    });

    if (!group) throw new NotFoundException('Grupo não encontrado');
    if (!group.members.some((m) => m.userId === userId)) {
      throw new ForbiddenException('Você não é membro deste grupo');
    }

    // divisão igual entre todos os membros
    const splitAmount = Number((expenseData.amount / group.members.length).toFixed(2));

    return this.prisma.expense.create({
      data: {
        ...expenseData,
        userId,
        groupId,
        splits: {
          create: group.members.map((member) => ({
            userId: member.userId,
            amount: splitAmount,
            isPaid: member.userId === userId, // quem pagou já está "quitado" com a própria parte
          })),
        },
      },
      include: { splits: true },
    });
  }

  findAll(userId: number) {
    return this.prisma.expense.findMany({
      where: {
        OR: [
          { userId, groupId: null },
          { group: { members: { some: { userId } } } },
        ],
      },
      include: { category: true, splits: true },
      orderBy: { date: 'desc' },
    });
  }

  async findOne(id: number, userId: number) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { category: true, splits: true, group: { include: { members: true } } },
    });

    if (!expense) throw new NotFoundException('Gasto não encontrado');

    const isOwner = expense.userId === userId;
    const isGroupMember = expense.group?.members.some((m) => m.userId === userId) ?? false;

    if (!isOwner && !isGroupMember) {
      throw new NotFoundException('Gasto não encontrado');
    }

    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    try {
      const { groupId, ...data } = updateExpenseDto;
      return await this.prisma.expense.update({ where: { id }, data });
    } catch {
      throw new NotFoundException('Gasto não encontrado');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.expense.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Gasto não encontrado');
    }
  }

  async getTotal(userId: number) {
    const result = await this.prisma.expense.aggregate({
      where: { userId },
      _sum: { amount: true },
    });
    return { total: result._sum.amount ?? 0 };
  }

  async getByCategory(userId: number) {
    const expenses = await this.prisma.expense.findMany({
      where: { userId },
      include: { category: true },
      orderBy: { category: { name: 'asc' } },
    });

    const grouped = new Map<number, { category_id: number; category_name: string; total: number; expenses: unknown[] }>();

    for (const expense of expenses) {
      if (!grouped.has(expense.categoryId)) {
        grouped.set(expense.categoryId, {
          category_id: expense.categoryId,
          category_name: expense.category.name,
          total: 0,
          expenses: [],
        });
      }

      const group = grouped.get(expense.categoryId)!;
      group.expenses.push({ id: expense.id, title: expense.title, amount: expense.amount, date: expense.date });
      group.total += Number(expense.amount);
    }

    return Array.from(grouped.values());
  }
}