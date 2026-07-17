import { AuthUser } from "./auth-user";

export interface RegisterResponse {

    message: string;

    accessToken: string;

    user: AuthUser;

}