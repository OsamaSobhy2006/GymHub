export interface CreateSessionRequest {
  memberId: string;
  trainerId: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
}

export interface UpdateSessionRequest {
  memberId?: string;
  trainerId?: string;
  title?: string;
  description?: string;
  date?: string;
  startTime?: string;
  endTime?: string;
}