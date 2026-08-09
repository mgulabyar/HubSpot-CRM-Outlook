import React, {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";

import TaskCreateForm from "./TaskCreateForm";
import TaskEditModal from "./TaskEditModal";
import TaskCards from "./TaskCards";

import {
  createNewTask,
  fetchTaskOwners,
  fetchTasks,
  removeTask,
  updateExistingTask,
} from "../../services/TaskApi";

import type {
  OwnerRecord,
  TaskFormValues,
  TaskRecord,
} from "../../types/TaskModels";

import { getApiErrorMessage } from "../../utils/apiError";

type ToastSeverity =
  | "success"
  | "error"
  | "info"
  | "warning";

export default function TasksSection() {
  const [tasks, setTasks] =
    useState<TaskRecord[]>([]);

  const [owners, setOwners] =
    useState<OwnerRecord[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [editingTask, setEditingTask] =
    useState<TaskRecord | null>(null);

  const [editOpen, setEditOpen] =
    useState(false);

  const [pendingDelete, setPendingDelete] =
    useState<TaskRecord | null>(null);

  const [toast, setToast] = useState<{
    open: boolean;
    message: string;
    severity: ToastSeverity;
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const showToast = useCallback(
    (
      message: string,
      severity: ToastSeverity
    ) => {
      setToast({
        open: true,
        message,
        severity,
      });
    },
    []
  );

  const closeToast = () => {
    setToast((previous) => ({
      ...previous,
      open: false,
    }));
  };

  const loadTaskData = useCallback(
    async () => {
      try {
        setLoading(true);

        const [
          tasksResponse,
          ownersResponse,
        ] = await Promise.all([
          fetchTasks(20),
          fetchTaskOwners(),
        ]);

        setTasks(tasksResponse.results || []);
        setOwners(ownersResponse || []);
      } catch (error) {
        console.error(
          "[TasksSection] load failed:",
          error
        );

        showToast(
          getApiErrorMessage(error),
          "error"
        );
      } finally {
        setLoading(false);
      }
    },
    [showToast]
  );

  useEffect(() => {
    void loadTaskData();
  }, [loadTaskData]);

  const handleCreate = async (
    values: TaskFormValues
  ): Promise<boolean> => {
    try {
      setSaving(true);

      await createNewTask(values);
      await loadTaskData();

      showToast(
        "Task created successfully.",
        "success"
      );

      return true;
    } catch (error) {
      console.error(
        "[TasksSection] create failed:",
        error
      );

      showToast(
        getApiErrorMessage(error),
        "error"
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleOpenEdit = (
    taskId: string
  ) => {
    const selectedTask = tasks.find(
      (task) =>
        String(task.id) === String(taskId)
    );

    if (!selectedTask) {
      showToast(
        "Task not found.",
        "error"
      );

      return;
    }

    setEditingTask(selectedTask);
    setEditOpen(true);
  };

  const handleCloseEdit = () => {
    if (saving) {
      return;
    }

    setEditOpen(false);
    setEditingTask(null);
  };

  const handleUpdate = async (
    values: TaskFormValues
  ): Promise<boolean> => {
    if (!editingTask) {
      showToast(
        "No task selected.",
        "error"
      );

      return false;
    }

    try {
      setSaving(true);

      await updateExistingTask(
        String(editingTask.id),
        values
      );

      await loadTaskData();

      setEditOpen(false);
      setEditingTask(null);

      showToast(
        "Task updated successfully.",
        "success"
      );

      return true;
    } catch (error) {
      console.error(
        "[TasksSection] update failed:",
        error
      );

      showToast(
        getApiErrorMessage(error),
        "error"
      );

      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleRequestDelete = async (
    taskId: string
  ): Promise<void> => {
    const selectedTask = tasks.find(
      (task) =>
        String(task.id) === String(taskId)
    );

    if (!selectedTask) {
      showToast(
        "Task not found.",
        "error"
      );

      return;
    }

    setPendingDelete(selectedTask);
  };

  const handleCancelDelete = () => {
    if (deletingId) {
      return;
    }

    setPendingDelete(null);
  };

  const handleConfirmDelete = async () => {
    if (!pendingDelete) {
      return;
    }

    const cleanId = String(
      pendingDelete.id
    ).trim();

    try {
      setDeletingId(cleanId);

      await removeTask(cleanId);

      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) =>
            String(task.id) !== cleanId
        )
      );

      showToast(
        "Task deleted successfully.",
        "success"
      );
    } catch (error) {
      console.error(
        "[TasksSection] delete failed:",
        error
      );

      showToast(
        getApiErrorMessage(error),
        "error"
      );
    } finally {
      setDeletingId(null);
      setPendingDelete(null);
    }
  };

  const taskName =
    pendingDelete?.properties?.hs_task_subject ||
    "this task";

  return (
    <>
      <Stack spacing={2}>
        <Box>
          <Typography
            sx={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: "16px",
            }}
          >
            Tasks
          </Typography>

          <Typography
            sx={{
              color: "#94a3b8",
              fontSize: "11px",
              mt: 0.4,
            }}
          >
            Manage HubSpot tasks from Outlook.
          </Typography>
        </Box>

        <Stack
          direction="row"
          spacing={1}
          sx={{
            flexWrap: "wrap",
            gap: 1,
          }}
        >
          <Chip
            label="CRM Connected"
            size="small"
            sx={{
              color: "#F5714E",
              bgcolor:
                "rgba(245, 113, 78, 0.08)",
              fontSize: "11px",
              fontWeight: 600,
            }}
          />

          <Chip
            label={`${tasks.length} Tasks`}
            size="small"
            sx={{
              color: "#cbd5e1",
              bgcolor:
                "rgba(203, 213, 225, 0.08)",
              fontSize: "11px",
              fontWeight: 600,
            }}
          />

          <Chip
            label={`${owners.length} Owners`}
            size="small"
            sx={{
              color: "#cbd5e1",
              bgcolor:
                "rgba(203, 213, 225, 0.08)",
              fontSize: "11px",
              fontWeight: 600,
            }}
          />
        </Stack>

        <Divider
          sx={{
            borderColor: "#334155",
          }}
        />

        <TaskCreateForm
          loading={saving}
          owners={owners}
          onSubmit={handleCreate}
        />

        <Divider
          sx={{
            borderColor: "#334155",
          }}
        />

        <Box>
          <Typography
            sx={{
              color: "#f8fafc",
              fontWeight: 700,
              fontSize: "14px",
              mb: 1.2,
            }}
          >
            Recent Tasks
          </Typography>

          <TaskCards
            tasks={tasks}
            loading={loading}
            deletingId={deletingId}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
          />
        </Box>
      </Stack>

      <TaskEditModal
        open={editOpen}
        task={editingTask}
        owners={owners}
        loading={saving}
        onClose={handleCloseEdit}
        onSave={handleUpdate}
      />

      <Dialog
        open={Boolean(pendingDelete)}
        onClose={
          deletingId
            ? undefined
            : handleCancelDelete
        }
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle
          sx={{
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          Delete task
        </DialogTitle>

        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "13px",
            }}
          >
            Are you sure you want to delete{" "}
            <strong>{taskName}</strong>?
          </DialogContentText>
        </DialogContent>

        <DialogActions
          sx={{
            px: 3,
            pb: 2,
          }}
        >
          <Button
            type="button"
            disabled={Boolean(deletingId)}
            onClick={handleCancelDelete}
            sx={{
              textTransform: "none",
            }}
          >
            Cancel
          </Button>

          <Button
            type="button"
            variant="contained"
            color="error"
            disabled={Boolean(deletingId)}
            onClick={() => {
              void handleConfirmDelete();
            }}
            sx={{
              textTransform: "none",
            }}
          >
            {deletingId ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={toast.open}
        autoHideDuration={3500}
        onClose={closeToast}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <Alert
          severity={toast.severity}
          variant="filled"
          onClose={closeToast}
          sx={{
            width: "100%",
            fontSize: "12px",
            borderRadius: "4px",
          }}
        >
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}