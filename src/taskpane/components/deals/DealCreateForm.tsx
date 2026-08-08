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
    <Stack spacing={1.3}>
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
        label="Deal Name"
        value={form.dealname}
        onChange={updateField("dealname")}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        size="small"
        fullWidth
        type="number"
        label="Amount"
        value={form.amount}
        onChange={updateField("amount")}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        select
        size="small"
        fullWidth
        label="Pipeline"
        value={form.pipeline}
        onChange={handlePipelineChange}
        disabled={pipelines.length === 0}
        sx={{ bgcolor: "#fff" }}
      >
        <MenuItem value="">Select pipeline</MenuItem>

        {pipelines.map((pipeline) => (
          <MenuItem key={pipeline.id} value={pipeline.id}>
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
        sx={{ bgcolor: "#fff" }}
      >
        <MenuItem value="">Select stage</MenuItem>

        {stages.map((stage) => (
          <MenuItem key={stage.id} value={stage.id}>
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
          inputLabel: {
            shrink: true,
          },
        }}
        sx={{ bgcolor: "#fff" }}
      />

      <TextField
        size="small"
        fullWidth
        multiline
        minRows={3}
        label="Description"
        value={form.description}
        onChange={updateField("description")}
        sx={{ bgcolor: "#fff" }}
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
          alignSelf: "flex-start",
          textTransform: "none",
          borderRadius: "4px",
          bgcolor: "#F5714E",
          fontSize: "13px",
          fontWeight: 600,
          boxShadow: "none",
          "&:hover": {
            bgcolor: "#e65f3d",
            boxShadow: "none",
          },
        }}
      >
        {loading ? "Saving..." : "Save"}
      </Button>
    </Stack>
  );
}
