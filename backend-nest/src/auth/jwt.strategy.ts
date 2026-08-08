import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';
import { PrismaService } from '../prisma/prisma.service.js';

export interface JwtPayload {
    sub: number;
    email: string;
    name: string;
}

export interface AuthenticatedUser {
    userId: number;
    email: string;
    name: string;
}

@Injectable()
export class JwtStrategy {
    constructor(private prisma: PrismaService) { }

    async validate(token: string): Promise<AuthenticatedUser> {
        try {
            const payload = jwt.verify(
                token,
                process.env.JWT_SECRET ?? 'secret',
            ) as JwtPayload;

            const user = await this.prisma.user.findUnique({ where: { id: payload.sub } });
            if (!user) {
                throw new UnauthorizedException('Usuário não encontrado');
            }

            return { userId: user.id, email: user.email, name: user.name };
        } catch {
            throw new UnauthorizedException('Token inválido ou expirado');
        }
    }
}
