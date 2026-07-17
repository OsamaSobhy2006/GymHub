export interface DashboardResponse {

  users: {
    total: number;
    members: number;
    trainers: number;
  };

  memberships: {
    total: number;
    active: number;
    expired: number;
    cancelled: number;
  };

  plans: number;

  sessions: {
    total: number;
    today: number;
    thisWeek: number;
    thisMonth: number;
  };

  payments: {
    total: number;
  };

  reviews: {
    total: number;
  };

}