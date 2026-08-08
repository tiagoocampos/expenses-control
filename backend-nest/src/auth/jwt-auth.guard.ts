import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { JwtStrategy } from './jwt.strategy';

@Injectable()
export class JwtAuthGuard implements CanActivate {
    constructor(private jwtStrategy: JwtStrategy) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest<Request>();
        const authHeader = request.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new UnauthorizedException('Token não fornecido');
        }

        const token = authHeader.split(' ')[1];
        const user = await this.jwtStrategy.validate(token);

        (request as any).user = user;

        return true;
    }
}
