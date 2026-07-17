export type UserRole =
  | "SUPER_ADMIN"
  | "ADMIN"
  | "COORDINATOR"
  | "STUDENT";

export type StudentClass = "6" | "7" | "8" | "9" | "10";

export type StudentStatus = "Pending" | "Approved" | "Rejected";

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: { field?: string; msg?: string; message?: string }[] | null;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages?: number;
  } | null;
}

export interface AuthUser {
  id: string;
  name?: string;
  email?: string;
  mobile?: string;
  role: UserRole;
  registrationNumber?: string;
}

export interface Notice {
  _id: string;
  title: string;
  titleHindi?: string;
  description?: string;
  type?: string;
  published?: boolean;
  createdAt?: string;
}

export interface GalleryItem {
  _id: string;
  title: string;
  imageUrl: string;
  category?: string;
  description?: string;
}
