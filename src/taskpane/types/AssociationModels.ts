export type AssociationObjectType =
  | "contacts"
  | "companies"
  | "deals"
  | "tasks";

export interface AssociationFormValues {
  fromType: AssociationObjectType;
  fromId: string;
  toType: AssociationObjectType;
  toId: string;
}

export interface AssociationResult {
  toObjectId?: string;
  id?: string;
  associationTypes?: Array<{
    category?: string;
    typeId?: number;
    label?: string | null;
  }>;
}

export interface AssociationListResponse {
  results: AssociationResult[];
}

export interface AssociationApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  statusCode?: number;
  category?: string | null;
  errors?: unknown;
  raw?: unknown;
}