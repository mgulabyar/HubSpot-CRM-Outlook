import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";

import type { CompanyFormValues, CompanyRecord } from "../../types/CompanyModels";

type Props = {
  open: boolean;
  company: CompanyRecord | null;
  loading: boolean;
  onClose: () => void;
  onSave: (values: CompanyFormValues) => Promise<boolean>;
};

const emptyForm: CompanyFormValues = {
  name: "",
  domain: "",
  phone: "",
  city: "",
  state: "",
  country: "",
  industry: "",
  numberofemployees: "",
};

export default function CompanyEditModal({ open, company, loading, onClose, onSave }: Props) {
  const [form, setForm] = useState<CompanyFormValues>(emptyForm);

  useEffect(() => {
    if (!company) {
      setForm(emptyForm);
      return;
    }

    setForm({
      name: company.properties.name || "",
      domain: company.properties.domain || "",
      phone: company.properties.phone || "",
      city: company.properties.city || "",
      state: company.properties.state || "",
      country: company.properties.country || "",
      industry: company.properties.industry || "",
      numberofemployees: company.properties.numberofemployees || "",
    });
  }, [company]);

  const updateField =
    (field: keyof CompanyFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));
    };

  const saveChanges = async () => {
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
      maxWidth="sm"
      fullWidth
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
        Edit Company
      </DialogTitle>

      <DialogContent sx={{ px: 1.5, pb: 1.5 }}>
        <Stack spacing={2.2} sx={{ pt: 1.5 }}>
          <TextField
            size="small"
            fullWidth
            label="Company Name"
            value={form.name}
            onChange={updateField("name")}
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
            label="Domain"
            value={form.domain}
            onChange={updateField("domain")}
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
            label="Phone"
            value={form.phone}
            onChange={updateField("phone")}
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
            label="Industry"
            value={form.industry}
            onChange={updateField("industry")}
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
            label="Number of Employees"
            value={form.numberofemployees}
            onChange={updateField("numberofemployees")}
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
              gap: 1,
            }}
          >
            <TextField
              size="small"
              label="City"
              value={form.city}
              onChange={updateField("city")}
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
              label="State"
              value={form.state}
              onChange={updateField("state")}
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

          <TextField
            size="small"
            fullWidth
            label="Country"
            value={form.country}
            onChange={updateField("country")}
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

      <DialogActions sx={{ px: 1.5, pb: 1.2, pt: 0.5 }}>
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
          onClick={() => {
            void saveChanges();
          }}
          disabled={loading}
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
