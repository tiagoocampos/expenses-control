import { ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateAuthDto } from './dto/create-auth.dto.js';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    if (!user.isEmailVerified) {
      throw new ForbiddenException('Confirme seu email antes de fazer login. Verifique sua caixa de entrada.');
    }

    const payload = { sub: user.id, email: user.email, name: user.name };
    const access_token = jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? '1d',
    });

    return {
      access_token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    };
  }

  async verifyEmail(token: string) {
    let payload: { sub: number; purpose: string };

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET!) as { sub: number; purpose: string };
    } catch {
      throw new UnauthorizedException('Link de verificação inválido ou expirado');
    }

    if (payload.purpose !== 'email-verification') {
      throw new UnauthorizedException('Token inválido para esta ação');
    }

    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { isEmailVerified: true },
    });

    return { message: 'Email verificado com sucesso' };
  }
}
