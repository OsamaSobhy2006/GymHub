import { Role } from "../enums/role.enum";

export interface JwtPayload {
    sub: string;
    email: string;
    fullname: string;
    role: Role;
    iat?: number;
    exp?: number;
}