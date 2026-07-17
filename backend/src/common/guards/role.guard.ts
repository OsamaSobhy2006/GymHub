import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Role } from "../enums/role.enum";
import { ROLES_KEY } from "../decorators/roles.decorators";
import { Request } from "express";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private readonly reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()]
        );

        if(!requiredRoles) return true;

        const request = context.switchToHttp().getRequest<Request>();

        const user = request['user'];

        const hasRole = requiredRoles.includes(user.role)

        if(!hasRole) throw new ForbiddenException('You do not have permission to access this resource');

        return true;
    }
}