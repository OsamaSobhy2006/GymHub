export interface CreateMembershipPlanRequest {

  name: string;

  description: string;

  price: number;

  durationInDays: number;

}

export interface UpdateMembershipPlanRequest {

  name?: string;

  description?: string;

  price?: number;

  durationInDays?: number;

}