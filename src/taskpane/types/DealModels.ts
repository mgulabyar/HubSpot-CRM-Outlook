export interface DealRecord {
  id: string;
  properties: Record<string, string | null | undefined>;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export interface DealListResponse {
  results: DealRecord[];
  total?: number;
  paging?: {
    next?: {
      after: string;
      link?: string;
    };
  };
}

export interface DealStage {
  id: string;
  label: string;
  displayOrder?: number;
  metadata?: Record<string, string>;
}

export interface DealPipeline {
  id: string;
  label: string;
  displayOrder?: number;
  stages?: DealStage[];
}

export interface DealPipelineListResponse {
  results: DealPipeline[];
}

export interface DealStageListResponse {
  results: DealStage[];
}

export interface DealFormValues {
  dealname: string;
  amount: string;
  pipeline: string;
  dealstage: string;
  closedate: string;
  description: string;
}

export interface DealApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  raw?: unknown;
}
