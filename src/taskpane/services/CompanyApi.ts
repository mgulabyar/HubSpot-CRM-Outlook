import axios from "axios";
import { API_BASE_URL } from "../config/api";

import type {
  CompanyApiResponse,
  CompanyFormValues,
  CompanyListResponse,
  CompanyRecord,
} from "../types/CompanyModels";

const companyApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function cleanCompanyPayload(payload: CompanyFormValues) {
  const result: Record<string, string> = {};

  const keys = Object.keys(payload) as Array<keyof CompanyFormValues>;

  keys.forEach((key) => {
    const value = payload[key];

    const cleanValue = String(value ?? "").trim();

    if (cleanValue) {
      result[String(key)] = cleanValue;
    }
  });

  return result;
}

function getCompanyErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Company request failed.";
  }

  const responseData = error.response?.data;

  console.error("[CompanyApi] status:", error.response?.status);

  console.error("[CompanyApi] response:", responseData);

  if (typeof responseData?.message === "string" && responseData.message.trim()) {
    return responseData.message;
  }

  if (typeof responseData?.raw?.message === "string") {
    return responseData.raw.message;
  }

  if (typeof responseData?.error?.message === "string") {
    return responseData.error.message;
  }

  if (Array.isArray(responseData?.errors)) {
    const firstError = responseData.errors[0];

    if (firstError && typeof firstError.message === "string") {
      return firstError.message;
    }
  }

  if (error.response?.status) {
    return `Company request failed with status ${error.response.status}.`;
  }

  return error.message || "Company request failed.";
}

function throwCompanyError(error: unknown): never {
  const message = getCompanyErrorMessage(error);

  console.error("[CompanyApi] final error:", message);

  throw new Error(message);
}

export const fetchCompanies = async (limit = 20): Promise<CompanyListResponse> => {
  try {
    console.log("[CompanyApi] fetching companies...");

    const response = await companyApi.get<CompanyApiResponse<CompanyListResponse>>(
      "/hubspot/companies",
      {
        params: {
          limit,
        },
      }
    );

    console.log("[CompanyApi] companies response:", response.status, response.data);

    return response.data.data;
  } catch (error) {
    throwCompanyError(error);
  }
};

export const fetchCompany = async (companyId: string): Promise<CompanyRecord> => {
  try {
    const cleanId = String(companyId).trim();

    if (!cleanId) {
      throw new Error("Company ID is missing.");
    }

    const response = await companyApi.get<CompanyApiResponse<CompanyRecord>>(
      `/hubspot/companies/${encodeURIComponent(cleanId)}`
    );

    return response.data.data;
  } catch (error) {
    throwCompanyError(error);
  }
};

export const createNewCompany = async (payload: CompanyFormValues): Promise<CompanyRecord> => {
  try {
    const cleanPayload = cleanCompanyPayload(payload);

    if (!cleanPayload.name) {
      throw new Error("Company name is required.");
    }

    console.log("[CompanyApi] creating company:", cleanPayload);

    const response = await companyApi.post<CompanyApiResponse<CompanyRecord>>(
      "/hubspot/companies",
      cleanPayload
    );

    console.log("[CompanyApi] company created:", response.status, response.data);

    return response.data.data;
  } catch (error) {
    throwCompanyError(error);
  }
};

export const updateExistingCompany = async (
  companyId: string,
  payload: CompanyFormValues
): Promise<CompanyRecord> => {
  try {
    const cleanId = String(companyId).trim();

    if (!cleanId) {
      throw new Error("Company ID is missing.");
    }

    const cleanPayload = cleanCompanyPayload(payload);

    if (Object.keys(cleanPayload).length === 0) {
      throw new Error("At least one company field is required.");
    }

    console.log("[CompanyApi] updating company:", cleanId, cleanPayload);

    const response = await companyApi.patch<CompanyApiResponse<CompanyRecord>>(
      `/hubspot/companies/${encodeURIComponent(cleanId)}`,
      cleanPayload
    );

    console.log("[CompanyApi] company updated:", response.status, response.data);

    return response.data.data;
  } catch (error) {
    throwCompanyError(error);
  }
};

export const removeCompany = async (companyId: string) => {
  try {
    const cleanId = String(companyId).trim();

    if (!cleanId) {
      throw new Error("Company ID is missing.");
    }

    console.log("[CompanyApi] deleting company:", cleanId);

    const response = await companyApi.delete(`/hubspot/companies/${encodeURIComponent(cleanId)}`);

    console.log("[CompanyApi] company deleted:", response.status, response.data);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    throwCompanyError(error);
  }
};
