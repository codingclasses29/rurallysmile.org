import api, { buildApiUrl } from "@/lib/api";
import type { ApiResponse } from "@/types";

export type AdminStudent = {
  _id: string;
  name: string;
  fatherName?: string;
  mobile?: string;
  email?: string;
  class?: string;
  schoolName?: string;
  district?: string;
  center?: string;
  centre?: string;
  registrationNumber?: string;
  rollNumber?: string;
  status?: "Pending" | "Approved" | "Rejected";
  photo?: string;
  createdAt?: string;
  rejectionReason?: string;
};

export type DashboardStats = {
  totalStudents: number;
  pendingStudents: number;
  approvedStudents: number;
  rejectedStudents: number;
  registrationsToday: number;
  registrationsLast7Days: number;
  totalAdmitCards: number;
  totalResults: number;
  publishedResults: number;
  pendingResults: number;
  approvedWithoutAdmit: number;
  totalNotices: number;
  totalGallery: number;
  totalCenters: number;
  totalSubjects: number;
  totalAdmins: number;
  byStatus?: Record<string, number>;
  byClass?: Array<{ _id: string; count: number }>;
};

export type StudentListParams = {
  status?: string;
  class?: string;
  dateFrom?: string;
  dateTo?: string;
  centre?: string;
  center?: string;
  search?: string;
  page?: number;
  limit?: number;
  sort?: string;
};

export type StudentImportRow = {
  row: number;
  status: "ready" | "invalid" | "created" | "failed";
  name?: string;
  mobile?: string;
  email?: string | null;
  class?: string;
  studentId?: string;
  registrationNumber?: string;
  errors?: string[];
};

export type StudentImportPreview = {
  sheetName: string;
  total: number;
  valid: number;
  invalid: number;
  rows: StudentImportRow[];
  limits?: Record<string, number>;
};

export type StudentImportReport = {
  sheetName: string;
  total: number;
  created: number;
  failed: number;
  rows: StudentImportRow[];
};

export type BulkAdmitReport = {
  requested: number;
  matched: number;
  created: number;
  existing: number;
  failed: number;
  truncated?: boolean;
  rows: Array<{
    studentId: string;
    registrationNumber?: string;
    status: "created" | "existing" | "failed";
    admitCardId?: string | null;
    error?: string;
  }>;
};

export type PublishReport = {
  matchedCount: number;
  modifiedCount: number;
  merit?: unknown;
};

export type MeritRecalculationReport = {
  classes?: string[];
  updated?: number;
  [key: string]: unknown;
};

export type NoticeAdmin = {
  _id: string;
  title: string;
  titleHindi?: string;
  description?: string;
  type?: string;
  published?: boolean;
  createdAt?: string;
};

export type ExamCenter = {
  _id: string;
  centerCode?: string;
  centerName?: string;
  name?: string;
  address?: string;
  district?: string;
  state?: string;
  capacity?: number;
  isActive?: boolean;
  reportingTime?: string;
};

export type ResultRow = {
  _id: string;
  student?: AdminStudent | string;
  hindi?: number;
  math?: number;
  gk?: number;
  gs?: number;
  marks?: number;
  total?: number;
  maxMarks?: number;
  percentage?: number;
  grade?: string;
  status?: string;
  published?: boolean;
};

export type AdmitCardRow = {
  _id: string;
  student?: AdminStudent | string;
  examCenter?: ExamCenter | string;
  examDate?: string;
  examTime?: string;
  reportingTime?: string;
  seatNumber?: string;
  roomNumber?: string;
  qrCode?: string;
  downloadCount?: number;
  generatedAt?: string;
  updatedAt?: string;
  createdAt?: string;
};

export type ImportReport = {
  source?: "excel" | "google";
  filename?: string;
  sheetName?: string;
  sheetUrl?: string;
  sheetId?: string;
  total: number;
  valid?: number;
  success?: number;
  created?: number;
  updated?: number;
  failed: number;
  duplicate: number;
  missing: number;
  published?: boolean;
  lastSync?: string;
  preview?: Array<{
    rollNumber: string;
    marks: number;
    studentName?: string;
    studentClass?: string;
    status?: string;
  }>;
  meritPreview?: Array<{
    rollNumber: string;
    marks: number;
    studentName?: string;
  }>;
  errors?: Array<{
    row?: number;
    rollNumber?: string;
    error: string;
  }>;
};

export const adminService = {
  dashboard: async () => {
    const { data } = await api.get<
      ApiResponse<DashboardStats | { stats: DashboardStats }>
    >(
      "/admin/dashboard"
    );
    const payload = data.data;
    return {
      ...data,
      data:
        payload && "stats" in payload
          ? payload.stats
          : (payload as DashboardStats | null),
    };
  },

  students: async (params?: StudentListParams) => {
    const { data } = await api.get<ApiResponse<AdminStudent[]>>(
      "/student",
      { params }
    );
    return data;
  },

  approveStudent: async (id: string) => {
    const { data } = await api.patch<ApiResponse>(
      `/admin/students/${id}/approve`
    );
    return data;
  },

  rejectStudent: async (id: string, reason?: string) => {
    const { data } = await api.patch<ApiResponse>(
      `/admin/students/${id}/reject`,
      { reason }
    );
    return data;
  },

  restoreStudent: async (id: string) => {
    const { data } = await api.put<ApiResponse<{ student: AdminStudent }>>(
      `/student/${id}/restore`
    );
    return data;
  },

  notices: async () => {
    const { data } = await api.get<
      ApiResponse<{ notices: NoticeAdmin[] } | NoticeAdmin[]>
    >("/notice/manage");
    return data;
  },

  aiStatus: async () => {
    const { data } = await api.get<
      ApiResponse<{ configured: boolean; model: string }>
    >("/ai/status");
    return data;
  },

  generateNoticeDraft: async (payload: {
    topic: string;
    language?: "bilingual" | "hindi" | "english";
    tone?: "official" | "simple" | "urgent";
  }) => {
    const { data } = await api.post<
      ApiResponse<{
        draft: {
          title: string;
          titleHindi: string;
          description: string;
          model: string;
        };
      }>
    >("/ai/notice-draft", payload);
    return data;
  },

  createNotice: async (payload: {
    title: string;
    description?: string;
    titleHindi?: string;
    type?: string;
    published?: boolean;
  }) => {
    const { data } = await api.post<ApiResponse>("/notice", payload);
    return data;
  },

  updateNotice: async (id: string, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResponse>(`/notice/${id}`, payload);
    return data;
  },

  deleteNotice: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/notice/${id}`);
    return data;
  },

  centers: async () => {
    const { data } = await api.get<
      ApiResponse<ExamCenter[] | { centers: ExamCenter[] }>
    >("/center", { params: { all: "1" } });
    return data;
  },

  createCenter: async (payload: Record<string, unknown>) => {
    const { data } = await api.post<ApiResponse>("/center", payload);
    return data;
  },

  updateCenter: async (id: string, payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResponse>(`/center/${id}`, payload);
    return data;
  },

  deleteCenter: async (id: string) => {
    const { data } = await api.delete<ApiResponse>(`/center/${id}`);
    return data;
  },

  results: async (params?: Record<string, string | number>) => {
    const { data } = await api.get<ApiResponse<ResultRow[]>>("/result", {
      params,
    });
    return data;
  },

  publishResult: async (id: string, published = true) => {
    const { data } = await api.post<ApiResponse>(`/result/${id}/publish`, {
      published,
    });
    return data;
  },

  settings: async () => {
    const { data } = await api.get<ApiResponse>("/settings");
    return data;
  },

  updateSettings: async (payload: Record<string, unknown>) => {
    const { data } = await api.put<ApiResponse>("/settings", payload);
    return data;
  },

  generateAdmit: async (studentId: string) => {
    const { data } = await api.post<ApiResponse>("/admit/generate", {
      studentId,
    });
    return data;
  },

  generateAdmitsBulk: async (
    payload:
      | { studentIds: string[] }
      | { filters: Omit<StudentListParams, "page" | "limit" | "sort"> }
  ) => {
    const { data } = await api.post<ApiResponse<{ report: BulkAdmitReport }>>(
      "/admit/generate/bulk",
      payload
    );
    return data;
  },

  previewStudentImport: async (excel: File, mediaZip: File) => {
    const form = new FormData();
    form.append("excel", excel);
    form.append("mediaZip", mediaZip);
    const { data } = await api.post<ApiResponse<StudentImportPreview>>(
      "/student/import/preview",
      form,
      { headers: { "Content-Type": undefined as unknown as string } }
    );
    return data;
  },

  importStudents: async (excel: File, mediaZip: File) => {
    const form = new FormData();
    form.append("excel", excel);
    form.append("mediaZip", mediaZip);
    const { data } = await api.post<
      ApiResponse<{ report: StudentImportReport }>
    >("/student/import", form, {
      headers: { "Content-Type": undefined as unknown as string },
    });
    return data;
  },

  lookupResult: async (params: {
    rollNumber?: string;
    registrationNumber?: string;
    studentId?: string;
  }) => {
    const { data } = await api.get<
      ApiResponse<{
        student: AdminStudent & {
          motherName?: string;
          dob?: string;
        };
        result: ResultRow | null;
      }>
    >("/result/lookup", { params });
    return data;
  },

  lookupAdmit: async (params: {
    rollNumber?: string;
    registrationNumber?: string;
    studentId?: string;
  }) => {
    const { data } = await api.get<
      ApiResponse<{
        student: AdminStudent;
        admitCard: AdmitCardRow | null;
      }>
    >("/admit/lookup", { params });
    return data;
  },

  listAdmits: async (params?: Record<string, string | number>) => {
    const { data } = await api.get<
      ApiResponse<{
        admits: AdmitCardRow[];
        stats: { total: number; downloads: number };
      }>
    >("/admit", { params });
    return data;
  },

  regenerateAdmit: async (id: string) => {
    const { data } = await api.put<ApiResponse>(`/admit/regenerate/${id}`);
    return data;
  },

  createResult: async (payload: {
    rollNumber: string;
    marks?: number;
    total?: number;
    hindi?: number;
    math?: number;
    gk?: number;
    gs?: number;
  }) => {
    const { data } = await api.post<ApiResponse<{ result: ResultRow }>>(
      "/result",
      payload
    );
    return data;
  },

  getImportConfig: async () => {
    const { data } = await api.get<
      ApiResponse<{
        sheetUrl: string;
        lastSync: string | null;
        defaultSheetUrl: string;
        auth?: {
          serviceAccount: boolean;
          serviceAccountEmail: string | null;
          apiKey: boolean;
          mode: string;
          free: boolean;
          setupHint: string;
        };
      }>
    >("/result/import/config");
    return data;
  },

  previewExcelImport: async (file: File) => {
    const form = new FormData();
    form.append("file", file);
    const { data } = await api.post<ApiResponse<ImportReport>>(
      "/result/import/excel/preview",
      form,
      {
        headers: { "Content-Type": undefined as unknown as string },
      }
    );
    return data;
  },

  importExcelResults: async (file: File, publish = false) => {
    const form = new FormData();
    form.append("file", file);
    form.append("publish", String(publish));
    const { data } = await api.post<ApiResponse<ImportReport>>(
      "/result/import/excel",
      form,
      {
        headers: { "Content-Type": undefined as unknown as string },
      }
    );
    return data;
  },

  previewGoogleSheet: async (sheetUrl: string) => {
    const { data } = await api.post<ApiResponse<ImportReport>>(
      "/result/import/google/preview",
      { sheetUrl }
    );
    return data;
  },

  syncGoogleSheet: async (payload: {
    sheetUrl: string;
    publish?: boolean;
    saveUrl?: boolean;
  }) => {
    const { data } = await api.post<ApiResponse<ImportReport>>(
      "/result/import/google/sync",
      payload
    );
    return data;
  },

  publishResults: async (
    payload:
      | { published: boolean; class: string }
      | { published: boolean; studentIds: string[] }
      | { published: boolean; all: true }
  ) => {
    const { data } = await api.post<ApiResponse<PublishReport>>(
      "/result/publish",
      payload
    );
    return data;
  },

  publishAllResults: async () =>
    adminService.publishResults({ published: true, all: true }),

  recalculateMerit: async (className?: string) => {
    const { data } = await api.post<
      ApiResponse<{ report: MeritRecalculationReport }>
    >("/result/merit/recalculate", className ? { class: className } : {});
    return data;
  },

  sampleResultExcelUrl: () => buildApiUrl("/result/import/sample"),
  sampleStudentExcelUrl: () => buildApiUrl("/student/import/sample"),
  sampleStudentMediaUrl: () => buildApiUrl("/student/import/media-sample"),

  admitPdfUrl: (id: string) => buildApiUrl(`/admit/download/${id}`),

  marksheetPdfUrl: (id: string) =>
    buildApiUrl(`/marksheet/admin/download/${id}`),

  fetchPdfBlobUrl: async (path: string) => {
    const res = await api.get(path, { responseType: "blob" });
    return URL.createObjectURL(res.data as Blob);
  },
};
