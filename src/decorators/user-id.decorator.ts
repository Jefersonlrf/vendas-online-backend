import { authorizationToLoginPayload } from '@/utils/base-64-converter';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Request } from 'express';

export const UserId = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): number | undefined => {
    const req = ctx.switchToHttp().getRequest<Request>();

    const authorization = req.headers.authorization;

    if (!authorization) return undefined;

    const loginPayload = authorizationToLoginPayload(authorization);

    return loginPayload?.id;
  },
);
