import axios from "axios";
import { API_BASE_URL } from "../config/api";

import type {
  DealApiResponse,
  DealFormValues,
  DealListResponse,
  DealPipelineListResponse,
  DealRecord,
  DealStageListResponse,
} from "../types/DealModels";

const dealApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function cleanDealPayload(payload: DealFormValues) {
  const result: Record<string, string> = {};

  const keys = Object.keys(payload) as Array<keyof DealFormValues>;

  keys.forEach((key) => {
    const value = payload[key];

    if (value !== undefined && value !== null && String(value).trim() !== "") {
      result[String(key)] = String(value).trim();
    }
  });
// 
  if (result.closedate && /^\d{4}-\d{2}-\d{2}$/.test(result.closedate)) {
    result.closedate = `${result.closedate}T00:00:00.000Z`;
  }

  return result;
}

function getDealErrorMessage(error: unknown): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Deal request failed.";
  }

  const responseData = error.response?.data;

  console.error("[DealApi] status:", error.response?.status);

  console.error("[DealApi] response:", responseData);

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
    return `Deal request failed with status ${error.response.status}.`;
  }

  return error.message || "Deal request failed.";
}

function throwDealError(error: unknown): never {
  const message = getDealErrorMessage(error);

  console.error("[DealApi] final error:", message);

  throw new Error(message);
}

export const fetchDeals = async (limit = 20): Promise<DealListResponse> => {
  try {
    const response = await dealApi.get<DealApiResponse<DealListResponse>>("/hubspot/deals", {
      params: {
        limit,
      },
    });

    console.log("[DealApi] deals response:", response.status, response.data);

    return response.data.data;
  } catch (error) {
    throwDealError(error);
  }
};

export const fetchDeal = async (dealId: string): Promise<DealRecord> => {
  try {
    const cleanId = String(dealId).trim();

    if (!cleanId) {
      throw new Error("Deal ID is missing.");
    }

    const response = await dealApi.get<DealApiResponse<DealRecord>>(
      `/hubspot/deals/${encodeURIComponent(cleanId)}`
    );

    return response.data.data;
  } catch (error) {
    throwDealError(error);
  }
};

export const fetchDealPipelines = async (): Promise<DealPipelineListResponse> => {
  try {
    const response = await dealApi.get<DealApiResponse<DealPipelineListResponse>>(
      "/hubspot/pipelines/deals"
    );

    console.log("[DealApi] pipelines response:", response.status, response.data);

    return response.data.data;
  } catch (error) {
    throwDealError(error);
  }
};

export const fetchDealStages = async (pipelineId: string): Promise<DealStageListResponse> => {
  try {
    const cleanId = String(pipelineId).trim();

    if (!cleanId) {
      throw new Error("Pipeline ID is missing.");
    }

    const response = await dealApi.get<DealApiResponse<DealStageListResponse>>(
      `/hubspot/pipelines/deals/${encodeURIComponent(cleanId)}/stages`
    );

    return response.data.data;
  } catch (error) {
    throwDealError(error);
  }
};

export const createNewDeal = async (payload: DealFormValues): Promise<DealRecord> => {
  try {
    const cleanPayload = cleanDealPayload(payload);

    if (!cleanPayload.dealname) {
      throw new Error("Deal name is required.");
    }

    if (!cleanPayload.pipeline) {
      throw new Error("Deal pipeline is required.");
    }

    if (!cleanPayload.dealstage) {
      throw new Error("Deal stage is required.");
    }

    console.log("[DealApi] creating deal:", cleanPayload);

    const response = await dealApi.post<DealApiResponse<DealRecord>>(
      "/hubspot/deals",
      cleanPayload
    );

    return response.data.data;
  } catch (error) {
    throwDealError(error);
  }
};

export const updateExistingDeal = async (
  dealId: string,
  payload: DealFormValues
): Promise<DealRecord> => {
  try {
    const cleanId = String(dealId).trim();

    if (!cleanId) {
      throw new Error("Deal ID is missing.");
    }

    const cleanPayload = cleanDealPayload(payload);

    if (Object.keys(cleanPayload).length === 0) {
      throw new Error("At least one deal field is required.");
    }

    console.log("[DealApi] updating deal:", cleanId, cleanPayload);

    const response = await dealApi.patch<DealApiResponse<DealRecord>>(
      `/hubspot/deals/${encodeURIComponent(cleanId)}`,
      cleanPayload
    );

    return response.data.data;
  } catch (error) {
    throwDealError(error);
  }
};

export const removeDeal = async (dealId: string) => {
  try {
    const cleanId = String(dealId).trim();

    if (!cleanId) {
      throw new Error("Deal ID is missing.");
    }

    console.log("[DealApi] deleting deal:", cleanId);

    const response = await dealApi.delete(`/hubspot/deals/${encodeURIComponent(cleanId)}`);

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    throwDealError(error);
  }
};
