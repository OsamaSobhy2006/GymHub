import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";
import { JwtPayload } from "../interfaces/jwt-payload.interface";

@Injectable()
export class JwtGuard implements CanActivate {
    constructor(private readonly jwtService: JwtService){}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request =  context.switchToHttp().getRequest<Request>();

        const authHeader = request.headers.authorization;

        if(!authHeader) throw new UnauthorizedException("Access Token is required")

        const token = authHeader.split(' ')[1];

        if(!token) throw new UnauthorizedException('Invalid Token')

        try {
            const payload = await this.jwtService.verifyAsync<JwtPayload>(token)

            request['user'] = payload

            return true;
        } catch (error) {
            console.log(error)
            throw new UnauthorizedException('Invalid or expired token')
        }
    }

}