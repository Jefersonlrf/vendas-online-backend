import { UserTyoe } from "@/user/enum/user-type.enum";
import { SetMetadata } from "@nestjs/common";

export const ROLES_KEY= 'roles';
export const Roles=(...roles: UserTyoe[]) => SetMetadata(ROLES_KEY, roles);