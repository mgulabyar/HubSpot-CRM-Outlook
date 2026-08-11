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
        Edit Deal
      </DialogTitle>

      <DialogContent
        sx={{
          px: 1.5,
          pb: 1.5,
        }}
      >
        <Stack spacing={2.2} sx={{ pt: 1.5 }}>
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
