import { authorizationToLoginPayload } from "@/utils/base-64-converter";
import { createParamDecorator, ExecutionContext } from "@nestjs/common";

export const UserId = createParamDecorator(
    (_, ctx: ExecutionContext) => {
        const { authorization } = ctx.switchToHttp().getRequest().headers;
        const loginPayload=authorizationToLoginPayload(authorization);

        return loginPayload?.id;
    }
);