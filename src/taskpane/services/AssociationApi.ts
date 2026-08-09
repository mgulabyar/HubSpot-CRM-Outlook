import axios from "axios";
import { API_BASE_URL } from "../config/api";

import type {
  AssociationApiResponse,
  AssociationFormValues,
  AssociationListResponse,
} from "../types/AssociationModels";

const associationApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function cleanId(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function getAssociationErrorMessage(
  error: unknown
): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Association request failed.";
  }

  const responseData = error.response?.data;

  console.error(
    "[AssociationApi] status:",
    error.response?.status
  );

  console.error(
    "[AssociationApi] response:",
    responseData
  );

  if (
    typeof responseData?.message === "string"
  ) {
    return responseData.message;
  }

  if (
    typeof responseData?.raw?.message === "string"
  ) {
    return responseData.raw.message;
  }

  if (
    typeof responseData?.error?.message === "string"
  ) {
    return responseData.error.message;
  }

  if (error.response?.status) {
    return `Association request failed with status ${error.response.status}.`;
  }

  return error.message || "Association request failed.";
}

function throwAssociationError(
  error: unknown
): never {
  const message =
    getAssociationErrorMessage(error);

  console.error(
    "[AssociationApi] final error:",
    message
  );

  throw new Error(message);
}

export const fetchAssociations = async (
  fromType: string,
  fromId: string,
  toType: string
): Promise<AssociationListResponse> => {
  try {
    const cleanFromId = cleanId(fromId);

    const response = await associationApi.get<
      AssociationApiResponse<AssociationListResponse>
    >(
      `/hubspot/associations/${fromType}/${encodeURIComponent(
        cleanFromId
      )}/${toType}`
    );

    return response.data.data;
  } catch (error) {
    throwAssociationError(error);
  }
};

export const createAssociation = async (
  payload: AssociationFormValues
) => {
  try {
    const cleanPayload = {
      fromType: payload.fromType,
      fromId: cleanId(payload.fromId),
      toType: payload.toType,
      toId: cleanId(payload.toId),
    };

    if (
      !cleanPayload.fromId ||
      !cleanPayload.toId
    ) {
      throw new Error(
        "Both record IDs are required."
      );
    }

    const response = await associationApi.post(
      "/hubspot/associations",
      cleanPayload
    );

    return response.data;
  } catch (error) {
    throwAssociationError(error);
  }
};

export const deleteAssociation = async (
  payload: AssociationFormValues
) => {
  try {
    const cleanPayload = {
      fromType: payload.fromType,
      fromId: cleanId(payload.fromId),
      toType: payload.toType,
      toId: cleanId(payload.toId),
    };

    const response = await associationApi.delete(
      "/hubspot/associations",
      {
        data: cleanPayload,
      }
    );

    return response.data;
  } catch (error) {
    throwAssociationError(error);
  }
};