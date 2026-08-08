import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if (existing) throw new ConflictException('Já existe um usuário com esse email');

    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);

    const user = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword },
    });

    return this.excludePassword(user);
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((u) => this.excludePassword(u));
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return this.excludePassword(user);
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const data = { ...updateUserDto };

    if (data.password) {
      data.password = await bcrypt.hash(data.password, SALT_ROUNDS);
    }

    try {
      const user = await this.prisma.user.update({ where: { id }, data });
      return this.excludePassword(user);
    } catch {
      throw new NotFoundException('Usuário não encontrado');
    }
  }

  async remove(id: number) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      return this.excludePassword(user);
    } catch {
      throw new NotFoundException('Usuário não encontrado');
    }
  }



  private excludePassword(user: { password: string;[key: string]: unknown }) {
    const { password, ...rest } = user;
    return rest;
  }
}