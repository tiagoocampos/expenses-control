import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateExpenseDto } from './dto/create-expense.dto.js';
import { UpdateExpenseDto } from './dto/update-expense.dto.js';





@Injectable()
export class ExpensesService {
  constructor(private prisma: PrismaService) { }

  async create(createExpenseDto: CreateExpenseDto, userId: number) {
    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) throw new NotFoundException('Usuário não encontrado');
    return this.prisma.expense.create({
      data: { ...createExpenseDto, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.expense.findMany({
      where: { userId },
      include: { category: true }
    });
  }

  async findOne(id: number) {
    const expense = await this.prisma.expense.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!expense) throw new NotFoundException('Gasto não encontrado');
    return expense;
  }

  async update(id: number, updateExpenseDto: UpdateExpenseDto) {
    try {
      return await this.prisma.expense.update({ where: { id }, data: updateExpenseDto });
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