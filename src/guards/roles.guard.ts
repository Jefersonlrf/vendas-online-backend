import { LoginPayload } from '@/auth/dto/loginPayload.dto';
import { ROLES_KEY } from '@/decorators/roles.decorator';
import { UserType } from '@/user/enum/user-type.enum';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { StringValue } from 'ms';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly jwtService: JwtService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<Request>();

    const authHeader = request.headers.authorization;

    if (typeof authHeader !== 'string') {
      return false;
    }

    const loginPayload = await this.jwtService
      .verifyAsync<LoginPayload>(authHeader, {
        secret: process.env.JWT_SECRET as StringValue,
      })
      .catch(() => undefined);

    if (!loginPayload) return false;

    return requiredRoles.some((role) => role === loginPayload.typeUser);
  }
}
