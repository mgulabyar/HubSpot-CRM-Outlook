import React, { useEffect, useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Stack,
  TextField,
} from "@mui/material";

import type { DealFormValues, DealPipeline, DealRecord, DealStage } from "../../types/DealModels";

type Props = {
  open: boolean;
  deal: DealRecord | null;
  pipelines: DealPipeline[];
  stages: DealStage[];
  loading: boolean;
  onPipelineChange: (pipelineId: string) => Promise<void>;
  onClose: () => void;
  onSave: (values: DealFormValues) => Promise<boolean>;
};

const emptyForm: DealFormValues = {
  dealname: "",
  amount: "",
  pipeline: "",
  dealstage: "",
  closedate: "",
  description: "",
};

function formatDateForInput(value?: string | null) {
  if (!value) {
    return "";
  }

  return value.slice(0, 10);
}

export default function DealEditModal({
  open,
  deal,
  pipelines,
  stages,
  loading,
  onPipelineChange,
  onClose,
  onSave,
}: Props) {
  const [form, setForm] = useState<DealFormValues>(emptyForm);

  useEffect(() => {
    if (!deal) {
      setForm(emptyForm);
      return;
    }

    setForm({
      dealname: deal.properties.dealname || "",
      amount: deal.properties.amount || "",
      pipeline: deal.properties.pipeline || "",
      dealstage: deal.properties.dealstage || "",
      closedate: formatDateForInput(deal.properties.closedate),
      description: deal.properties.description || "",
    });
  }, [deal]);

  const updateField =
    (field: keyof DealFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
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

    await onPipelineChange(pipelineId);
  };

  const handleSave = async () => {
    const successful = await onSave(form);

    if (successful) {
      setForm(emptyForm);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          color: "#1e2a3c",
          fontWeight: 700,
          fontSize: "18px",
        }}
      >
        Edit Deal
      </DialogTitle>

      <DialogContent>
        <Stack spacing={1.5} sx={{ pt: 1 }}>
          <TextField
            size="small"
            fullWidth
            label="Deal Name"
            value={form.dealname}
            onChange={updateField("dealname")}
          />

          <TextField
            size="small"
            fullWidth
            type="number"
            label="Amount"
            value={form.amount}
            onChange={updateField("amount")}
          />

          <TextField
            select
            size="small"
            fullWidth
            label="Pipeline"
            value={form.pipeline}
            onChange={handlePipelineChange}
          >
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
          >
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
          />

          <TextField
            size="small"
            fullWidth
            multiline
            minRows={3}
            label="Description"
            value={form.description}
            onChange={updateField("description")}
          />
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
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
