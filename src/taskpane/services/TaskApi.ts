import axios from "axios";
import { API_BASE_URL } from "../config/api";

import type {
  OwnerListResponse,
  OwnerRecord,
  TaskApiResponse,
  TaskFormValues,
  TaskListResponse,
  TaskRecord,
} from "../types/TaskModels";

const taskApi = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

function cleanTaskPayload(
  payload: TaskFormValues
) {
  const result: Record<string, string> = {};

  const allowedFields = [
    "hs_task_subject",
    "hs_task_body",
    "hs_timestamp",
    "hs_task_status",
    "hs_task_priority",
    "hs_task_type",
    "hubspot_owner_id",
    "associatedObjectType",
    "associatedObjectId",
  ];

  allowedFields.forEach((field) => {
    const value =
      payload[
        field as keyof TaskFormValues
      ];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ""
    ) {
      result[field] = String(value).trim();
    }
  });

  if (result.hubspot_owner_id) {
    result.hubspot_owner_id =
      result.hubspot_owner_id
        .replace(/\s+/g, "")
        .trim();
  }

  if (result.associatedObjectId) {
    result.associatedObjectId =
      result.associatedObjectId
        .replace(/\s+/g, "")
        .trim();
  }

  if (
    result.hs_timestamp &&
    !result.hs_timestamp.endsWith("Z") &&
    !/[+-]\d{2}:\d{2}$/.test(
      result.hs_timestamp
    )
  ) {
    const parsedDate = new Date(
      result.hs_timestamp
    );

    if (!Number.isNaN(parsedDate.getTime())) {
      result.hs_timestamp =
        parsedDate.toISOString();
    }
  }

  return result;
}

function getTaskErrorMessage(
  error: unknown
): string {
  if (!axios.isAxiosError(error)) {
    if (error instanceof Error) {
      return error.message;
    }

    return "Task request failed.";
  }

  const responseData = error.response?.data;

  console.error(
    "[TaskApi] status:",
    error.response?.status
  );

  console.error(
    "[TaskApi] response:",
    responseData
  );

  if (
    typeof responseData?.message === "string" &&
    responseData.message.trim()
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

  if (Array.isArray(responseData?.errors)) {
    const firstError = responseData.errors[0];

    if (
      firstError &&
      typeof firstError.message === "string"
    ) {
      return firstError.message;
    }
  }

  if (error.response?.status) {
    return `Task request failed with status ${error.response.status}.`;
  }

  return error.message || "Task request failed.";
}

function throwTaskError(error: unknown): never {
  const message = getTaskErrorMessage(error);

  console.error(
    "[TaskApi] final error:",
    message
  );

  throw new Error(message);
}

export const fetchTasks = async (
  limit = 20
): Promise<TaskListResponse> => {
  try {
    const response = await taskApi.get<
      TaskApiResponse<TaskListResponse>
    >("/hubspot/tasks", {
      params: {
        limit,
      },
    });

    return response.data.data;
  } catch (error) {
    throwTaskError(error);
  }
};

export const fetchTaskOwners = async (): Promise<
  OwnerRecord[]
> => {
  try {
    const response = await taskApi.get<
      TaskApiResponse<OwnerListResponse>
    >("/hubspot/owners");

    console.log(
      "[TaskApi] owners response:",
      response.status,
      response.data
    );

    return response.data.data.results || [];
  } catch (error) {
    throwTaskError(error);
  }
};

export const fetchTask = async (
  taskId: string
): Promise<TaskRecord> => {
  try {
    const cleanId = String(taskId).trim();

    if (!cleanId) {
      throw new Error("Task ID is missing.");
    }

    const response = await taskApi.get<
      TaskApiResponse<TaskRecord>
    >(
      `/hubspot/tasks/${encodeURIComponent(cleanId)}`
    );

    return response.data.data;
  } catch (error) {
    throwTaskError(error);
  }
};

export const createNewTask = async (
  payload: TaskFormValues
): Promise<TaskRecord> => {
  try {
    const cleanPayload =
      cleanTaskPayload(payload);

    if (!cleanPayload.hs_task_subject) {
      throw new Error(
        "Task subject is required."
      );
    }

    if (!cleanPayload.hs_timestamp) {
      cleanPayload.hs_timestamp =
        new Date().toISOString();
    }

    if (!cleanPayload.hs_task_status) {
      cleanPayload.hs_task_status =
        "NOT_STARTED";
    }

    if (!cleanPayload.hs_task_priority) {
      cleanPayload.hs_task_priority =
        "MEDIUM";
    }

    if (!cleanPayload.hs_task_type) {
      cleanPayload.hs_task_type = "TODO";
    }

    console.log(
      "[TaskApi] create payload:",
      cleanPayload
    );

    const response = await taskApi.post<
      TaskApiResponse<TaskRecord>
    >(
      "/hubspot/tasks",
      cleanPayload
    );

    console.log(
      "[TaskApi] create response:",
      response.status,
      response.data
    );

    return response.data.data;
  } catch (error) {
    throwTaskError(error);
  }
};

export const updateExistingTask = async (
  taskId: string,
  payload: TaskFormValues
): Promise<TaskRecord> => {
  try {
    const cleanId = String(taskId).trim();

    if (!cleanId) {
      throw new Error("Task ID is missing.");
    }

    const cleanPayload =
      cleanTaskPayload(payload);

    delete cleanPayload.associatedObjectType;
    delete cleanPayload.associatedObjectId;

    if (
      Object.keys(cleanPayload).length === 0
    ) {
      throw new Error(
        "At least one task field is required."
      );
    }

    const response = await taskApi.patch<
      TaskApiResponse<TaskRecord>
    >(
      `/hubspot/tasks/${encodeURIComponent(cleanId)}`,
      cleanPayload
    );

    return response.data.data;
  } catch (error) {
    throwTaskError(error);
  }
};

export const removeTask = async (
  taskId: string
) => {
  try {
    const cleanId = String(taskId).trim();

    if (!cleanId) {
      throw new Error("Task ID is missing.");
    }

    const response = await taskApi.delete(
      `/hubspot/tasks/${encodeURIComponent(cleanId)}`
    );

    return {
      status: response.status,
      data: response.data,
    };
  } catch (error) {
    throwTaskError(error);
  }
};