export interface AuthUser {

    id: string;

    fullname: string;

    email: string;

    role: 'ADMIN' | 'TRAINER' | 'MEMBER';

    status: 'ACTIVE' | 'INACTIVE';

    profileImage: string;

    createdAt: string;

    updatedAt: string;

}