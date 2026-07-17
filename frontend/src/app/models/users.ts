export interface Users {
    id: string;
    fullname: string;
    email: string;
    profileImage: string;
    role: 'ADMIN' | 'TRAINER' | 'MEMBER';
    status: 'ACTIVE' | 'INACTIVE';
    createdAt: Date
}

export interface CreateUserRequest {
    fullname: string;
    email: string;
    password: string;
    role: 'MEMBER' | 'TRAINER';
}