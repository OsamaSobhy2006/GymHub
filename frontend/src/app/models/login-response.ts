import { AuthUser } from "./auth-user";

export interface LoginResponse {

    message: string;

    accessToken: string;

    user: AuthUser;

}