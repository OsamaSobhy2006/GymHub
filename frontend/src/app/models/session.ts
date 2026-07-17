export interface SessionUser {
  id: string;
  fullname: string;
  email: string;
  role: string;
  status: string;
  profileImage: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  title: string;
  description: string;
  date: string;
  startTime: string;
  endTime: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  member: SessionUser;
  trainer: SessionUser;
}

export interface SessionsResponse {
  success: boolean;
  message: string;
  data: Session[];
}