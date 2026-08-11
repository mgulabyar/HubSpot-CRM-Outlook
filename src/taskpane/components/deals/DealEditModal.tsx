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
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#1e293b",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#f8fafc",
                fontSize: "13px",
                bgcolor: "#0f172a",
                borderRadius: "6px",
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#475569" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& .MuiSelect-select": { color: "#f8fafc" },
                "& .MuiSvgIcon-root": { color: "#94a3b8" }, // Dropdown Arrow Fix
              },
            }}
          >
            {pipelines.map((pipeline) => (
              <MenuItem key={pipeline.id} value={pipeline.id} sx={{ fontSize: "13px" }}>
                {pipeline.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Deal Stage Selection Dropdown */}
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
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#1e293b",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#f8fafc",
                fontSize: "13px",
                bgcolor: "#0f172a",
                borderRadius: "6px",
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#475569" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& .MuiSelect-select": { color: "#f8fafc" },
                "& .MuiSvgIcon-root": { color: "#94a3b8" },
              },
            }}
          >
            {stages.map((stage) => (
              <MenuItem key={stage.id} value={stage.id} sx={{ fontSize: "13px" }}>
                {stage.label}
              </MenuItem>
            ))}
          </TextField>

          {/* Close Date Input */}
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
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#1e293b",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#f8fafc",
                fontSize: "13px",
                bgcolor: "#0f172a",
                borderRadius: "6px",
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#475569" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& input": { color: "#f8fafc" },
                "& input::-webkit-calendar-picker-indicator": { filter: "invert(1)" }, // Dark Calendar UI Vector Fix
              },
            }}
          />

          {/* Description Input */}
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
                color: "#94a3b8",
                fontSize: "13px",
                fontWeight: 500,
                bgcolor: "#1e293b",
                px: 0.6,
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
              "& .MuiOutlinedInput-root": {
                color: "#f8fafc",
                fontSize: "13px",
                bgcolor: "#0f172a",
                borderRadius: "6px",
                "& fieldset": { borderColor: "#334155" },
                "&:hover fieldset": { borderColor: "#475569" },
                "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
                "& textarea": { color: "#f8fafc" },
              },
            }}
          />
        </Stack>
      </DialogContent>

      {/* Highly Professional Balanced Horizontal Action Buttons */}
      <DialogActions sx={{ px: 1.5, pb: 2, gap: 1 }}>
        <Button
          type="button"
          onClick={onClose}
          disabled={loading}
          sx={{
            flex: 1, // Balanced horizontal width split matrix
            textTransform: "none",
            fontSize: "13px",
            fontWeight: 500,
            color: "#94a3b8",
            borderRadius: "6px",
            py: 0.8,
            "&:hover": {
              bgcolor: "rgba(148, 163, 184, 0.08)",
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
            void handleSave(); // Original function parameters call preserved
          }}
          sx={{
            flex: 1, // Balanced horizontal width split matrix
            textTransform: "none",
            bgcolor: "#F5714E", // Your standard brand color orange
            color: "#fff",
            fontSize: "13px",
            fontWeight: 600,
            borderRadius: "6px",
            py: 0.8,
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
          {loading ? "Updating..." : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
