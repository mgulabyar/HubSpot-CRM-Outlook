export type TaskStatus =
  | "NOT_STARTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "WAITING"
  | "DEFERRED";

export type TaskPriority =
  | "LOW"
  | "MEDIUM"
  | "HIGH";

export interface TaskRecord {
  id: string;
  properties: Record<
    string,
    string | null | undefined
  >;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export interface TaskListResponse {
  results: TaskRecord[];
  total?: number;
  paging?: {
    next?: {
      after: string;
      link?: string;
    };
  };
}

export interface OwnerRecord {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userId?: string;
  archived?: boolean;
}

export interface OwnerListResponse {
  results: OwnerRecord[];
}

export interface TaskFormValues {
  hs_task_subject: string;
  hs_task_body: string;
  hs_timestamp: string;
  hs_task_status: TaskStatus;
  hs_task_priority: TaskPriority;
  hs_task_type: string;
  hubspot_owner_id: string;
  associatedObjectType: string;
  associatedObjectId: string;
}

export interface TaskApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  warning?: string | null;
  statusCode?: number;
  raw?: unknown;
}