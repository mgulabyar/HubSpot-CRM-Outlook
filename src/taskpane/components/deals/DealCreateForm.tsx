import React, { useEffect, useState } from "react";
import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import type { DealFormValues, DealPipeline, DealStage } from "../../types/DealModels";

type Props = {
  loading: boolean;
  pipelines: DealPipeline[];
  stages: DealStage[];
  onPipelineChange: (pipelineId: string) => Promise<void>;
  onSubmit: (values: DealFormValues) => Promise<boolean>;
};

const initialValues: DealFormValues = {
  dealname: "",
  amount: "",
  pipeline: "",
  dealstage: "",
  closedate: "",
  description: "",
};

export default function DealCreateForm({
  loading,
  pipelines,
  stages,
  onPipelineChange,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<DealFormValues>(initialValues);

  const [error, setError] = useState("");

  useEffect(() => {
    if (pipelines.length > 0 && !form.pipeline) {
      void onPipelineChange(pipelines[0].id);

      setForm((previous) => ({
        ...previous,
        pipeline: pipelines[0].id,
      }));
    }
  }, [pipelines, form.pipeline, onPipelineChange]);

  useEffect(() => {
    if (stages.length > 0 && !form.dealstage) {
      setForm((previous) => ({
        ...previous,
        dealstage: stages[0].id,
      }));
    }
  }, [stages, form.dealstage]);

  const updateField =
    (field: keyof DealFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));

      setError("");
    };

  const handlePipelineChange = async (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const pipelineId = event.target.value;

    setForm((previous) => ({
      ...previous,
      pipeline: pipelineId,
      dealstage: "",
    }));

    setError("");

    await onPipelineChange(pipelineId);
  };

  const handleSubmit = async () => {
    if (!form.dealname.trim()) {
      setError("Deal name is required.");
      return;
    }

    if (!form.pipeline) {
      setError("Select a pipeline.");
      return;
    }

    if (!form.dealstage) {
      setError("Select a deal stage.");
      return;
    }

    const successful = await onSubmit({
      ...form,
      dealname: form.dealname.trim(),
      amount: form.amount.trim(),
      description: form.description.trim(),
    });

    if (successful) {
      setForm({
        ...initialValues,
        pipeline: pipelines[0]?.id || "",
        dealstage: stages[0]?.id || "",
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
            color: "#92400e",
            borderColor: "rgba(217, 119, 6, 0.35)",
            bgcolor: "rgba(251, 191, 36, 0.1)",
            "& .MuiAlert-icon": {
              color: "#d97706",
            },
          }}
        >
          {error}
        </Alert>
      )}

      <TextField
        size="small"
        fullWidth
        label="Deal Name"
        value={form.dealname}
        onChange={updateField("dealname")}
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
        type="number"
        label="Amount"
        value={form.amount}
        onChange={updateField("amount")}
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
        label="Pipeline"
        value={form.pipeline}
        onChange={handlePipelineChange}
        disabled={pipelines.length === 0}
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
        <MenuItem value="" sx={{ fontSize: "13px" }}>
          Select pipeline
        </MenuItem>
        {pipelines.map((pipeline) => (
          <MenuItem key={pipeline.id} value={pipeline.id} sx={{ fontSize: "13px" }}>
            {pipeline.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        select
        size="small"
        fullWidth
        label="Deal Stage"
        value={form.dealstage}
        onChange={updateField("dealstage")}
        disabled={stages.length === 0}
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
        <MenuItem value="" sx={{ fontSize: "13px" }}>
          Select stage
        </MenuItem>
        {stages.map((stage) => (
          <MenuItem key={stage.id} value={stage.id} sx={{ fontSize: "13px" }}>
            {stage.label}
          </MenuItem>
        ))}
      </TextField>

      <TextField
        size="small"
        fullWidth
        type="date"
        label="Close Date"
        value={form.closedate}
        onChange={updateField("closedate")}
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
        label="Description"
        value={form.description}
        onChange={updateField("description")}
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

      <Button
        type="button"
        variant="contained"
        disabled={loading}
        startIcon={
          <SaveIcon
            sx={{
              fontSize: "16px !important",
            }}
          />
        }
        onClick={() => {
          void handleSubmit();
        }}
        sx={{
          width: "100%",
          textTransform: "none",
          borderRadius: "6px",
          bgcolor: "#F5714E",
          fontSize: "13px",
          fontWeight: 600,
          py: 0.9,
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#e05e3b",
            boxShadow: "none",
          },
          "&.Mui-disabled": {
            bgcolor: "rgba(245, 113, 78, 0.3)",
            color: "rgba(248, 250, 252, 0.4)",
          },
        }}
      >
        {loading ? "Saving..." : "Save Deal"}
      </Button>
    </Stack>
  );
}
