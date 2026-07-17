export interface MemebershipPlans {
    id: string;

    name: string;

    description: string;

    price: number;

    durationInDays: number;

    isActive: boolean;

    createdAt: Date;

    updatedAt: Date;
}

export interface Member {
  id: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
  profileImage: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  startDate: string;
  endDate: string;
  status: 'ACTIVE' | 'EXPIRED';

  createdAt: string;
  updatedAt: string;

  member: Member;

  membershipPlan: MemebershipPlans;
}

export interface MembershipPlansResponse {
    success: boolean;

    message: string;

    data: MemebershipPlans[]
}

export interface MembershipResponse {
  success: boolean;
  message: string;
  data: Membership[];
}