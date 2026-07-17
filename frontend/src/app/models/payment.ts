export interface PaymentUser {
  id: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface MembershipPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  durationInDays: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: string;
  startDate: string;
  endDate: string;
  status: string;
  membershipPlan: MembershipPlan;
}


export interface Payment {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
  type: 'MEMBERSHIP'
  stripeSessionId?: string;
  stripePaymentIntentId?: string;
  paidAt?: string;
  createdAt: string;
  updatedAt: string;
  member: PaymentUser;
  membership?: Membership;
}

export interface PaymentsResponse {
  success: boolean;
  message: string;
  data: Payment[];
}