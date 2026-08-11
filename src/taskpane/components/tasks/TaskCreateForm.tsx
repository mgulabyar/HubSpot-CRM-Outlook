import React, { useState } from "react";
import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import type { OwnerRecord, TaskFormValues } from "../../types/TaskModels";

type Props = {
  loading: boolean;
  owners: OwnerRecord[];
  onSubmit: (values: TaskFormValues) => Promise<boolean>;
};

function getDefaultDateTime() {
  const date = new Date();

  const offset = date.getTimezoneOffset() * 60000;

  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function cleanNumericId(value: string) {
  return value.replace(/\s+/g, "").trim();
}

const initialValues: TaskFormValues = {
  hs_task_subject: "",
  hs_task_body: "",
  hs_timestamp: getDefaultDateTime(),
  hs_task_status: "NOT_STARTED",
  hs_task_priority: "MEDIUM",
  hs_task_type: "TODO",
  hubspot_owner_id: "",
  associatedObjectType: "",
  associatedObjectId: "",
};

export default function TaskCreateForm({ loading, owners, onSubmit }: Props) {
  const [form, setForm] = useState<TaskFormValues>(initialValues);

  const [error, setError] = useState("");

  const updateField =
    (field: keyof TaskFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value;

      if (field === "hubspot_owner_id" || field === "associatedObjectId") {
        value = cleanNumericId(value);
      }

      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setError("");
    };

  const handleSubmit = async () => {
    const ownerId = cleanNumericId(form.hubspot_owner_id);

    const associatedId = cleanNumericId(form.associatedObjectId);

    if (!form.hs_task_subject.trim()) {
      setError("Task subject is required.");
      return;
    }

    if (ownerId && !/^[0-9]+$/.test(ownerId)) {
      setError("Please select a valid HubSpot owner.");
      return;
    }

    if (form.associatedObjectType && !associatedId) {
      setError("Associated record ID is required.");
      return;
    }

    if (associatedId && !/^[0-9]+$/.test(associatedId)) {
      setError("Associated record ID must contain numbers only.");
      return;
    }

    const payload: TaskFormValues = {
      ...form,
      hs_task_subject: form.hs_task_subject.trim(),
      hs_task_body: form.hs_task_body.trim(),
      hubspot_owner_id: ownerId,
      associatedObjectId: associatedId,
    };

    console.log("[TaskCreateForm] submitting:", payload);

    const successful = await onSubmit(payload);

    if (successful) {
      setForm({
        ...initialValues,
        hs_timestamp: getDefaultDateTime(),
      });

      setError("");
    }
  };

  return (
    <Stack spacing={2.2}>
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

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 1.5,
        }}
      >
        <TextField
          select
          size="small"
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
          <MenuItem value="NOT_STARTED">Not Started</MenuItem>
          <MenuItem value="IN_PROGRESS">In Progress</MenuItem>
          <MenuItem value="COMPLETED">Completed</MenuItem>
          <MenuItem value="WAITING">Waiting</MenuItem>
          <MenuItem value="DEFERRED">Deferred</MenuItem>
        </TextField>

        <TextField
          select
          size="small"
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
          <MenuItem value="LOW">Low</MenuItem>
          <MenuItem value="MEDIUM">Medium</MenuItem>
          <MenuItem value="HIGH">High</MenuItem>
        </TextField>
      </Box>

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
        <MenuItem value="TODO">To-do</MenuItem>
        <MenuItem value="CALL">Call</MenuItem>
        <MenuItem value="EMAIL">Email</MenuItem>
        <MenuItem value="MEETING">Meeting</MenuItem>
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
            [owner.firstName, owner.lastName].filter(Boolean).join(" ") || owner.email || owner.id;

          return (
            <MenuItem key={owner.id} value={owner.id}>
              {ownerName} — {owner.id}
            </MenuItem>
          );
        })}
      </TextField>

      <TextField
        select
        size="small"
        fullWidth
        label="Associated Object Type"
        value={form.associatedObjectType}
        onChange={updateField("associatedObjectType")}
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
        <MenuItem value="">No association</MenuItem>
        <MenuItem value="contacts">Contact</MenuItem>
        <MenuItem value="companies">Company</MenuItem>
        <MenuItem value="deals">Deal</MenuItem>
      </TextField>

      {form.associatedObjectType && (
        <TextField
          size="small"
          fullWidth
          label="Associated Record ID"
          value={form.associatedObjectId}
          onChange={updateField("associatedObjectId")}
          helperText="Only numeric record ID is allowed"
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
      )}

      <Button
        type="button"
        variant="contained"
        disabled={loading}
        startIcon={<SaveIcon sx={{ fontSize: "15px !important" }} />}
        onClick={() => {
          void handleSubmit();
        }}
        sx={{
          flex: 1,
          textTransform: "none",
          borderRadius: "6px",
          bgcolor: "#F5714E",
          color: "#fff",
          fontSize: "12px",
          fontWeight: 600,
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
        {loading ? "Saving..." : "Save Task"}
      </Button>
    </Stack>
  );
}
