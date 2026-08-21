export type ContactSubmissionStatus = "pending" | "in_progress" | "resolved";

export interface ContactSubmission {
  id: string;
  created_at: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: ContactSubmissionStatus;
  user_id?: string | null;
  resolved_at?: string | null;
}

export interface UpdateContactSubmissionDto {
  status?: ContactSubmissionStatus;
  resolved_at?: string | null;
}

export interface ContactSubmissionQueryParams {
  search?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface ContactSubmissionsResponse {
  items: ContactSubmission[];
  total: number;
  page: number;
  limit: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
}
