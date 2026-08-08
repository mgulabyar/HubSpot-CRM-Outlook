export interface CompanyRecord {
  id: string;
  properties: Record<string, string | null | undefined>;
  createdAt?: string;
  updatedAt?: string;
  archived?: boolean;
}

export interface CompanyListResponse {
  results: CompanyRecord[];
  total?: number;
  paging?: {
    next?: {
      after: string;
      link?: string;
    };
  };
}

export interface CompanyFormValues {
  name: string;
  domain: string;
  phone: string;
  city: string;
  state: string;
  country: string;
  industry: string;
  numberofemployees: string;
}

export interface CompanyApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  category?: string | null;
  errors?: unknown;
  context?: unknown;
  raw?: unknown;
}
