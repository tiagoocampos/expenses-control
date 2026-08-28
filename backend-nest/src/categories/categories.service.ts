import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) { }

  create(createCategoryDto: CreateCategoryDto, userId: number) {
    return this.prisma.category.create({
      data: { ...createCategoryDto, userId },
    });
  }

  findAll(userId: number) {
    return this.prisma.category.findMany({ where: { userId } });
  }

  async findOne(id: number, userId: number) {
    const category = await this.prisma.category.findUnique({ where: { id } });
    if (!category || category.userId !== userId) {
      throw new NotFoundException('Categoria não encontrada');
    }
    return category;
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto, userId: number) {
    const result = await this.prisma.category.updateMany({
      where: { id, userId },
      data: updateCategoryDto,
    });

    if (result.count === 0) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return this.prisma.category.findUnique({ where: { id } });
  }

  async remove(id: number, userId: number) {
    const result = await this.prisma.category.deleteMany({ where: { id, userId } });

    if (result.count === 0) {
      throw new NotFoundException('Categoria não encontrada');
    }

    return { message: 'Categoria removida com sucesso' };
  }
}