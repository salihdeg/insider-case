import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Role } from '@prisma/client';
import { DatabaseService } from 'src/database/database.service';
import { ROLES_KEY } from 'src/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(
        private readonly reflector: Reflector,
        private readonly databaseService: DatabaseService
    ) { }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY,
            [
                context.getHandler(),
                context.getClass()
            ]
        );

        if (!requiredRoles) return true;

        const { user } = context.switchToHttp().getRequest();

        const loginedUser = await this.databaseService.user.findUnique({ where: { email: user.email } });

        const userRoles = await this.databaseService.userRole.findMany({ where: { user_id: loginedUser.id } });
        if (!userRoles) return false;

        return this.matchRoles(requiredRoles, userRoles.map(userRole => userRole.role));
    }

    matchRoles(requiredRoles: Role[], userRoles: Role[]): boolean {
        return requiredRoles.some(role => userRoles.includes(role));
    }
}