import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import type { OwnerRecord, TaskFormValues, TaskRecord } from "../../types/TaskModels";

type Props = {
  open: boolean;
  task: TaskRecord | null;
  owners: OwnerRecord[];
  loading: boolean;
  onClose: () => void;
  onSave: (values: TaskFormValues) => Promise<boolean>;
};

const emptyForm: TaskFormValues = {
  hs_task_subject: "",
  hs_task_body: "",
  hs_timestamp: "",
  hs_task_status: "NOT_STARTED",
  hs_task_priority: "MEDIUM",
  hs_task_type: "TODO",
  hubspot_owner_id: "",
  associatedObjectType: "",
  associatedObjectId: "",
};

function cleanNumericId(value: string) {
  return value.replace(/\s+/g, "").trim();
}

function formatDateForInput(value?: string | null) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

export default function TaskEditModal({ open, task, owners, loading, onClose, onSave }: Props) {
  const [form, setForm] = useState<TaskFormValues>(emptyForm);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) {
      setForm(emptyForm);
      return;
    }

    setForm({
      hs_task_subject: task.properties.hs_task_subject || "",
      hs_task_body: task.properties.hs_task_body || "",
      hs_timestamp: formatDateForInput(task.properties.hs_timestamp),
      hs_task_status:
        (task.properties.hs_task_status as TaskFormValues["hs_task_status"]) || "NOT_STARTED",
      hs_task_priority:
        (task.properties.hs_task_priority as TaskFormValues["hs_task_priority"]) || "MEDIUM",
      hs_task_type: task.properties.hs_task_type || "TODO",
      hubspot_owner_id: task.properties.hubspot_owner_id || "",
      associatedObjectType: "",
      associatedObjectId: "",
    });

    setError("");
  }, [task]);

  const updateField =
    (field: keyof TaskFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value;

      if (field === "hubspot_owner_id") {
        value = cleanNumericId(value);
      }

      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setError("");
    };

  const handleSave = async () => {
    const ownerId = cleanNumericId(form.hubspot_owner_id);

    if (ownerId && !/^[0-9]+$/.test(ownerId)) {
      setError("Please select a valid HubSpot owner.");

      return;
    }

    const payload: TaskFormValues = {
      ...form,
      hs_task_subject: form.hs_task_subject.trim(),
      hs_task_body: form.hs_task_body.trim(),
      hubspot_owner_id: ownerId,
    };

    const successful = await onSave(payload);

    if (successful) {
      setForm(emptyForm);
      setError("");
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "#ffffff",
            backgroundImage: "none",
            borderRadius: "8px",
            border: "1px solid #e2e8f0",
            mx: 1.5,
            width: "calc(100% - 24px)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#1e293b",
          fontWeight: 500,
          fontSize: "14.5px",
          pt: 2,
          px: 1.5,
          pb: 0.5,
        }}
      >
        Edit Task
      </DialogTitle>

      <DialogContent
        sx={{
          px: 1.5,
          pb: 1.5,
        }}
      >
        <Stack spacing={2.2} sx={{ pt: 1.5 }}>
          {error && (
            <Alert
              severity="warning"
              variant="outlined"
              onClose={() => setError("")}
              sx={{
                borderRadius: "6px",
                fontSize: "12px",
                color: "#fef08a",
                borderColor: "rgba(234, 179, 8, 0.3)",
                bgcolor: "rgba(234, 179, 8, 0.06)",
                "& .MuiAlert-icon": {
                  color: "#eab308",
                },
              }}
            >
              {error}
            </Alert>
          )}

          <TextField
            size="small"
            fullWidth
            label="Task Subject"
            value={form.hs_task_subject}
            onChange={updateField("hs_task_subject")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          />

          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            label="Task Description"
            value={form.hs_task_body}
            onChange={updateField("hs_task_body")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          />

          <TextField
            size="small"
            fullWidth
            type="datetime-local"
            label="Due Date and Time"
            value={form.hs_timestamp}
            onChange={updateField("hs_timestamp")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          />

          <TextField
            select
            size="small"
            fullWidth
            label="Status"
            value={form.hs_task_status}
            onChange={updateField("hs_task_status")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          >
            <MenuItem value="NOT_STARTED" sx={{ fontSize: "13px" }}>
              Not Started
            </MenuItem>
            <MenuItem value="IN_PROGRESS" sx={{ fontSize: "13px" }}>
              In Progress
            </MenuItem>
            <MenuItem value="COMPLETED" sx={{ fontSize: "13px" }}>
              Completed
            </MenuItem>
            <MenuItem value="WAITING" sx={{ fontSize: "13px" }}>
              Waiting
            </MenuItem>
            <MenuItem value="DEFERRED" sx={{ fontSize: "13px" }}>
              Deferred
            </MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            fullWidth
            label="Priority"
            value={form.hs_task_priority}
            onChange={updateField("hs_task_priority")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          >
            <MenuItem value="LOW" sx={{ fontSize: "13px" }}>
              Low
            </MenuItem>
            <MenuItem value="MEDIUM" sx={{ fontSize: "13px" }}>
              Medium
            </MenuItem>
            <MenuItem value="HIGH" sx={{ fontSize: "13px" }}>
              High
            </MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            fullWidth
            label="Task Type"
            value={form.hs_task_type}
            onChange={updateField("hs_task_type")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          >
            <MenuItem value="TODO" sx={{ fontSize: "13px" }}>
              To-do
            </MenuItem>
            <MenuItem value="CALL" sx={{ fontSize: "13px" }}>
              Call
            </MenuItem>
            <MenuItem value="EMAIL" sx={{ fontSize: "13px" }}>
              Email
            </MenuItem>
            <MenuItem value="MEETING" sx={{ fontSize: "13px" }}>
              Meeting
            </MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            fullWidth
            label="HubSpot Owner"
            value={form.hubspot_owner_id}
            onChange={updateField("hubspot_owner_id")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={{
              "& .MuiInputLabel-root": {
                color: "#64748b",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#ffffff",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#1e293b",
                fontSize: "13px",
                bgcolor: "#fff",
                borderRadius: "6px",
                transition: "background-color 150ms ease",
                "& fieldset": { borderColor: "#cbd5e1" },
                "&:hover fieldset": { borderColor: "#94a3b8" },
                "&.Mui-focused": { bgcolor: "#ffffff" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#1e293b" },
              },
            }}
          >
            <MenuItem value="">Unassigned</MenuItem>
            {owners.map((owner) => {
              const ownerName =
                [owner.firstName, owner.lastName].filter(Boolean).join(" ") ||
                owner.email ||
                owner.id;

              return (
                <MenuItem key={owner.id} value={owner.id} sx={{ fontSize: "13px" }}>
                  {ownerName} — {owner.id}
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 1.5, pb: 2, gap: 1 }}>
        <Button
          type="button"
          onClick={onClose}
          disabled={loading}
          sx={{
            flex: 1,
            textTransform: "none",
            fontSize: "12px",
            fontWeight: 600,
            bgcolor: "#f1f5f9",
            color: "#1e293b",
            borderRadius: "6px",
            py: 0.9,
            border: "1px solid #e2e8f0",
            "&:hover": {
              bgcolor: "#e2e8f0",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(241, 245, 249, 0.6)",
              color: "rgba(30, 41, 59, 0.4)",
            },
          }}
        >
          Cancel
        </Button>

        <Button
          type="button"
          variant="contained"
          disabled={loading}
          onClick={() => {
            void handleSave();
          }}
          sx={{
            flex: 1,
            textTransform: "none",
            bgcolor: "#F5714E",
            color: "#fff",
            fontSize: "12px",
            fontWeight: 600,
            borderRadius: "6px",
            py: 0.9,
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#e05e3b",
              boxShadow: "none",
            },
            "&.Mui-disabled": {
              bgcolor: "rgba(245, 113, 78, 0.3)",
              color: "rgba(255, 255, 255, 0.7)",
            },
          }}
        >
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
