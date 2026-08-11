import React, { useState } from "react";
import { Alert, Box, Button, MenuItem, Stack, TextField } from "@mui/material";
import LinkIcon from "@mui/icons-material/Link";

import type { AssociationFormValues, AssociationObjectType } from "../../types/AssociationModels";

type Props = {
  loading: boolean;
  onSubmit: (values: AssociationFormValues) => Promise<boolean>;
};

const initialValues: AssociationFormValues = {
  fromType: "contacts",
  fromId: "",
  toType: "companies",
  toId: "",
};

function cleanId(value: string) {
  return value.replace(/\s+/g, "").trim();
}

export default function AssociationCreateForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<AssociationFormValues>(initialValues);

  const [error, setError] = useState("");

  const updateField =
    (field: "fromType" | "fromId" | "toType" | "toId") =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      let value = event.target.value;

      if (field === "fromId" || field === "toId") {
        value = cleanId(value);
      }

      setForm((previous) => ({
        ...previous,
        [field]: value,
      }));

      setError("");
    };

  const handleSubmit = async () => {
    const fromId = cleanId(form.fromId);
    const toId = cleanId(form.toId);

    if (!fromId || !toId) {
      setError("Both source and target record IDs are required.");

      return;
    }

    if (!/^[0-9]+$/.test(fromId) || !/^[0-9]+$/.test(toId)) {
      setError("Record IDs must contain numbers only.");

      return;
    }

    if (form.fromType === form.toType && fromId === toId) {
      setError("A record cannot be associated with itself.");

      return;
    }

    const successful = await onSubmit({
      ...form,
      fromId,
      toId,
    });

    if (successful) {
      setForm({
        ...initialValues,
        fromType: form.fromType,
        toType: form.toType,
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

  {/* Grid Layout for From Type and From ID */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 1.5,
    }}
  >
    {/* From Type Dropdown Selector */}
    <TextField
      select
      size="small"
      label="From Type"
      value={form.fromType}
      onChange={updateField("fromType")}
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
      <MenuItem value="contacts" sx={{ fontSize: "13px" }}>Contact</MenuItem>
      <MenuItem value="companies" sx={{ fontSize: "13px" }}>Company</MenuItem>
      <MenuItem value="deals" sx={{ fontSize: "13px" }}>Deal</MenuItem>
      <MenuItem value="tasks" sx={{ fontSize: "13px" }}>Task</MenuItem>
    </TextField>

    {/* From ID Input Field */}
    <TextField
      size="small"
      label="From ID"
      value={form.fromId}
      onChange={updateField("fromId")}
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
  </Box>

  {/* Grid Layout for To Type and To ID */}
  <Box
    sx={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 1.5,
    }}
  >
    {/* To Type Dropdown Selector */}
    <TextField
      select
      size="small"
      label="To Type"
      value={form.toType}
      onChange={updateField("toType")}
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
      <MenuItem value="contacts" sx={{ fontSize: "13px" }}>Contact</MenuItem>
      <MenuItem value="companies" sx={{ fontSize: "13px" }}>Company</MenuItem>
      <MenuItem value="deals" sx={{ fontSize: "13px" }}>Deal</MenuItem>
      <MenuItem value="tasks" sx={{ fontSize: "13px" }}>Task</MenuItem>
    </TextField>

    {/* To ID Input Field */}
    <TextField
      size="small"
      label="To ID"
      value={form.toId}
      onChange={updateField("toId")}
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
  </Box>

  {/* Clean Full-Width Button matching Task/Deal Layout System */}
  <Button
    type="button"
    variant="contained"
    disabled={loading}
    startIcon={<LinkIcon sx={{ fontSize: "15px !important" }} />}
    onClick={() => {
      void handleSubmit(); // Original functional routine preserved safely
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
    {loading ? "Associating..." : "Save Association"}
  </Button>
</Stack>

  );
}
