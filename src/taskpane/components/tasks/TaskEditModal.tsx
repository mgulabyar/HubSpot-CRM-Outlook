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

import type {
  OwnerRecord,
  TaskFormValues,
  TaskRecord,
} from "../../types/TaskModels";

type Props = {
  open: boolean;
  task: TaskRecord | null;
  owners: OwnerRecord[];
  loading: boolean;
  onClose: () => void;
  onSave: (
    values: TaskFormValues
  ) => Promise<boolean>;
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

function formatDateForInput(
  value?: string | null
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  const offset =
    date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset)
    .toISOString()
    .slice(0, 16);
}

export default function TaskEditModal({
  open,
  task,
  owners,
  loading,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] =
    useState<TaskFormValues>(emptyForm);

  const [error, setError] = useState("");

  useEffect(() => {
    if (!task) {
      setForm(emptyForm);
      return;
    }

    setForm({
      hs_task_subject:
        task.properties.hs_task_subject || "",
      hs_task_body:
        task.properties.hs_task_body || "",
      hs_timestamp: formatDateForInput(
        task.properties.hs_timestamp
      ),
      hs_task_status:
        (task.properties.hs_task_status as TaskFormValues["hs_task_status"]) ||
        "NOT_STARTED",
      hs_task_priority:
        (task.properties.hs_task_priority as TaskFormValues["hs_task_priority"]) ||
        "MEDIUM",
      hs_task_type:
        task.properties.hs_task_type || "TODO",
      hubspot_owner_id:
        task.properties.hubspot_owner_id || "",
      associatedObjectType: "",
      associatedObjectId: "",
    });

    setError("");
  }, [task]);

  const updateField =
    (field: keyof TaskFormValues) =>
    (
      event: React.ChangeEvent<
        HTMLInputElement | HTMLTextAreaElement
      >
    ) => {
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
    const ownerId = cleanNumericId(
      form.hubspot_owner_id
    );

    if (
      ownerId &&
      !/^[0-9]+$/.test(ownerId)
    ) {
      setError(
        "Please select a valid HubSpot owner."
      );

      return;
    }

    const payload: TaskFormValues = {
      ...form,
      hs_task_subject:
        form.hs_task_subject.trim(),
      hs_task_body:
        form.hs_task_body.trim(),
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
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle
        sx={{
          color: "#1e2a3c",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        Edit Task
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          {error && (
            <Alert
              severity="warning"
              onClose={() => setError("")}
              sx={{
                borderRadius: "4px",
                fontSize: "12px",
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
            onChange={updateField(
              "hs_task_subject"
            )}
          />

          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            label="Task Description"
            value={form.hs_task_body}
            onChange={updateField(
              "hs_task_body"
            )}
          />

          <TextField
            size="small"
            fullWidth
            type="datetime-local"
            label="Due Date and Time"
            value={form.hs_timestamp}
            onChange={updateField(
              "hs_timestamp"
            )}
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            select
            size="small"
            fullWidth
            label="Status"
            value={form.hs_task_status}
            onChange={updateField(
              "hs_task_status"
            )}
          >
            <MenuItem value="NOT_STARTED">
              Not Started
            </MenuItem>

            <MenuItem value="IN_PROGRESS">
              In Progress
            </MenuItem>

            <MenuItem value="COMPLETED">
              Completed
            </MenuItem>

            <MenuItem value="WAITING">
              Waiting
            </MenuItem>

            <MenuItem value="DEFERRED">
              Deferred
            </MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            fullWidth
            label="Priority"
            value={form.hs_task_priority}
            onChange={updateField(
              "hs_task_priority"
            )}
          >
            <MenuItem value="LOW">Low</MenuItem>

            <MenuItem value="MEDIUM">
              Medium
            </MenuItem>

            <MenuItem value="HIGH">High</MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            fullWidth
            label="Task Type"
            value={form.hs_task_type}
            onChange={updateField("hs_task_type")}
          >
            <MenuItem value="TODO">
              To-do
            </MenuItem>

            <MenuItem value="CALL">
              Call
            </MenuItem>

            <MenuItem value="EMAIL">
              Email
            </MenuItem>

            <MenuItem value="MEETING">
              Meeting
            </MenuItem>
          </TextField>

          <TextField
            select
            size="small"
            fullWidth
            label="HubSpot Owner"
            value={form.hubspot_owner_id}
            onChange={updateField(
              "hubspot_owner_id"
            )}
          >
            <MenuItem value="">
              Unassigned
            </MenuItem>

            {owners.map((owner) => {
              const ownerName =
                [
                  owner.firstName,
                  owner.lastName,
                ]
                  .filter(Boolean)
                  .join(" ") ||
                owner.email ||
                owner.id;

              return (
                <MenuItem
                  key={owner.id}
                  value={owner.id}
                >
                  {ownerName} — {owner.id}
                </MenuItem>
              );
            })}
          </TextField>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button
          type="button"
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            color: "#2d3e50",
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
            textTransform: "none",
            bgcolor: "#F5714E",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#e65f3d",
              boxShadow: "none",
            },
          }}
        >
          {loading ? "Updating..." : "Update Task"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}