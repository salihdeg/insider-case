import { SetMetadata } from "@nestjs/common";
import { Prisma, Role } from "@prisma/client";

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);