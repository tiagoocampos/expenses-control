import { Injectable, NotFoundException, ConflictException, Inject } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Prisma } from '../generated/prisma/client.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateUserDto } from './dto/create-user.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { nanoid } from 'nanoid';

const SALT_ROUNDS = 10;

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject('EMAIL_SERVICE') private emailClient: ClientProxy,
  ) { }

  async create(createUserDto: CreateUserDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: createUserDto.email } });
    if (existing) throw new ConflictException('Já existe um usuário com esse email');

    const hashedPassword = await bcrypt.hash(createUserDto.password, SALT_ROUNDS);
    const shareCode = nanoid(6)
    try {
      const user = await this.prisma.user.create({
        data: { ...createUserDto, password: hashedPassword, shareCode },
      });

      const token = jwt.sign(
        { sub: user.id, purpose: 'email-verification' },
        process.env.JWT_SECRET!,
        { expiresIn: '1d' },
      );

      this.emailClient.emit('user.registered', {
        name: user.name,
        email: user.email,
        verifyUrl: `${process.env.FRONTEND_URL}/verificar-email?token=${token}`,
      });

      return this.excludePassword(user);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
        throw new ConflictException('Já existe um usuário com esse email');
      }
      throw error;
    }
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