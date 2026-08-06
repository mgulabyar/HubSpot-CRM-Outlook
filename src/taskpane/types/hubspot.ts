export type HubSpotProperties = Record<string, string | null>;

export interface HubSpotRecord {
  id: string;
  properties: HubSpotProperties;
  createdAt: string;
  updatedAt: string;
  archived: boolean;
  url?: string;
}

export interface HubSpotListResponse<T> {
  results: T[];
  total?: number;
  paging?: {
    next?: {
      after: string;
      link?: string;
    };
  };
}

export interface HubSpotApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface ContactFormData {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  company: string;
}

export interface CompanyFormData {
  name: string;
  domain: string;
  phone: string;
  city: string;
  country: string;
}

export interface DealFormData {
  dealname: string;
  amount: string;
  dealstage: string;
  pipeline: string;
  closedate: string;
  description: string;
}