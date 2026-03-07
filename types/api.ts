export type EventStatus =
  | 'draft'
  | 'coming_soon'
  | 'published'
  | 'cancelled'
  | 'completed';

export interface Event {
  id: number;
  name: string;
  description: string | null;
  capacity: number;
  booked_count: number;
  remaining_spots: number;
  status: EventStatus;
  event_start_at: string | null;
  event_end_at: string | null;
  booking_opens_at: string | null;
  booking_closes_at: string | null;
  created_at: string;
}

export interface Booking {
  id: number;
  event_id: number;
  user_id: number;
  ticket_count: number;
  status: 'confirmed' | 'cancelled';
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  email: string;
  name: string | null;
}

export interface AuthResponse {
  user: User;
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface ApiError {
  code: string;
  message: string;
  details: Record<string, unknown> | null;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiError;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data?: T[];
  pagination?: Pagination;
  error?: ApiError;
}
