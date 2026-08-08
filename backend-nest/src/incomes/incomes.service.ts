import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIncomeDto } from './dto/create-income.dto.js';
import { UpdateIncomeDto } from './dto/update-income.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class IncomesService {
  constructor(private prisma: PrismaService) { }

  async create(createIncomeDto: CreateIncomeDto, userId: number) {
    const userExists = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!userExists) throw new NotFoundException('Usuário não encontrado');

    return this.prisma.income.create({
      data: { ...createIncomeDto, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.income.findMany({ where: { userId } });
  }

  async findOne(id: number) {
    const income = await this.prisma.income.findUnique({ where: { id } });
    if (!income) throw new NotFoundException('Receita não encontrada');
    return income;
  }

  async update(id: number, updateIncomeDto: UpdateIncomeDto) {
    try {
      return await this.prisma.income.update({ where: { id }, data: updateIncomeDto });
    } catch {
      throw new NotFoundException('Receita não encontrada');
    }
  }

  async remove(id: number) {
    try {
      return await this.prisma.income.delete({ where: { id } });
    } catch {
      throw new NotFoundException('Receita não encontrada');
    }
  }
}