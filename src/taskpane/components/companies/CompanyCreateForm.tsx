import React, { useState } from "react";
import { Alert, Box, Button, Stack, TextField } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

import type { CompanyFormValues } from "../../types/CompanyModels";

type Props = {
  loading: boolean;
  onSubmit: (values: CompanyFormValues) => Promise<boolean>;
};

const defaultValues: CompanyFormValues = {
  name: "",
  domain: "",
  phone: "",
  city: "",
  state: "",
  country: "",
  industry: "",
  numberofemployees: "",
};

export default function CompanyCreateForm({ loading, onSubmit }: Props) {
  const [form, setForm] = useState<CompanyFormValues>(defaultValues);

  const [error, setError] = useState("");

  const updateField =
    (field: keyof CompanyFormValues) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((previous) => ({
        ...previous,
        [field]: event.target.value,
      }));

      setError("");
    };

  const submitForm = async () => {
    if (!form.name.trim()) {
      setError("Company name is required.");
      return;
    }

    const successful = await onSubmit({
      name: form.name.trim(),
      domain: form.domain.trim(),
      phone: form.phone.trim(),
      city: form.city.trim(),
      state: form.state.trim(),
      country: form.country.trim(),
      industry: form.industry.trim(),
      numberofemployees: form.numberofemployees.trim(),
    });

    if (successful) {
      setForm(defaultValues);
    }
  };

  return (
    // <Stack spacing={2.2} sx={{ p: 1 }}>
    //   {/* Premium Dark Mode Alert */}
    //   {error && (
    //     <Alert
    //       severity="warning"
    //       variant="outlined"
    //       onClose={() => setError("")}
    //       sx={{
    //         borderRadius: "6px",
    //         fontSize: "12px",
    //         color: "#fef08a", // Soft premium yellow text for dark theme
    //         borderColor: "rgba(234, 179, 8, 0.3)",
    //         bgcolor: "rgba(234, 179, 8, 0.06)",
    //         "& .MuiAlert-icon": {
    //           color: "#eab308",
    //         },
    //       }}
    //     >
    //       {error}
    //     </Alert>
    //   )}

    //   {/* Company Name Input */}
    //   <TextField
    //     fullWidth
    //     size="small"
    //     label="Company Name"
    //     value={form.name}
    //     onChange={updateField("name")}
    //     slotProps={{
    //       inputLabel: { shrink: true },
    //     }}
    //     sx={{
    //       "& .MuiInputLabel-root": {
    //         color: "#94a3b8",
    //         fontSize: "13px",
    //         fontWeight: 500,
    //         bgcolor: "#0f172a",
    //         px: 0.6,
    //       },
    //       "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //       "& .MuiOutlinedInput-root": {
    //         color: "#f8fafc", // Input Text Value Color (Crisp White)
    //         fontSize: "12.5px",
    //         bgcolor: "#0f172a", // Dark Pod Inner Style
    //         borderRadius: "6px",
    //         "& fieldset": { borderColor: "#334155" }, // Default Border
    //         "&:hover fieldset": { borderColor: "#475569" }, // Hover Border
    //         "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" }, // Focus Border
    //       },
    //     }}
    //   />

    //   {/* Domain Input */}
    //   <TextField
    //     fullWidth
    //     size="small"
    //     label="Domain"
    //     placeholder="example.com"
    //     value={form.domain}
    //     onChange={updateField("domain")}
    //     slotProps={{
    //       inputLabel: { shrink: true },
    //     }}
    //     sx={{
    //       "& .MuiInputLabel-root": {
    //         color: "#94a3b8",
    //         fontSize: "13px",
    //         fontWeight: 500,
    //         bgcolor: "#0f172a",
    //         px: 0.6,
    //       },
    //       "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //       "& .MuiOutlinedInput-root": {
    //         color: "#f8fafc",
    //         fontSize: "12.5px",
    //         bgcolor: "#0f172a",
    //         borderRadius: "6px",
    //         "& fieldset": { borderColor: "#334155" },
    //         "&:hover fieldset": { borderColor: "#475569" },
    //         "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
    //         "& input::placeholder": { color: "#475569", opacity: 1 }, // Custom sleek placeholder contrast
    //       },
    //     }}
    //   />

    //   {/* Phone Input */}
    //   <TextField
    //     fullWidth
    //     size="small"
    //     label="Phone"
    //     value={form.phone}
    //     onChange={updateField("phone")}
    //     slotProps={{
    //       inputLabel: { shrink: true },
    //     }}
    //     sx={{
    //       "& .MuiInputLabel-root": {
    //         color: "#94a3b8",
    //         fontSize: "13px",
    //         fontWeight: 500,
    //         bgcolor: "#0f172a",
    //         px: 0.6,
    //       },
    //       "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //       "& .MuiOutlinedInput-root": {
    //         color: "#f8fafc",
    //         fontSize: "12.5px",
    //         bgcolor: "#0f172a",
    //         borderRadius: "6px",
    //         "& fieldset": { borderColor: "#334155" },
    //         "&:hover fieldset": { borderColor: "#475569" },
    //         "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
    //       },
    //     }}
    //   />

    //   {/* Industry Input */}
    //   <TextField
    //     fullWidth
    //     size="small"
    //     label="Industry"
    //     value={form.industry}
    //     onChange={updateField("industry")}
    //     slotProps={{
    //       inputLabel: { shrink: true },
    //     }}
    //     sx={{
    //       "& .MuiInputLabel-root": {
    //         color: "#94a3b8",
    //         fontSize: "13px",
    //         fontWeight: 500,
    //         bgcolor: "#0f172a",
    //         px: 0.6,
    //       },
    //       "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //       "& .MuiOutlinedInput-root": {
    //         color: "#f8fafc",
    //         fontSize: "12.5px",
    //         bgcolor: "#0f172a",
    //         borderRadius: "6px",
    //         "& fieldset": { borderColor: "#334155" },
    //         "&:hover fieldset": { borderColor: "#475569" },
    //         "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
    //       },
    //     }}
    //   />

    //   {/* Number of Employees Input */}
    //   <TextField
    //     fullWidth
    //     size="small"
    //     type="number"
    //     label="Number of Employees"
    //     value={form.numberofemployees}
    //     onChange={updateField("numberofemployees")}
    //     slotProps={{
    //       inputLabel: { shrink: true },
    //     }}
    //     sx={{
    //       "& .MuiInputLabel-root": {
    //         color: "#94a3b8",
    //         fontSize: "13px",
    //         fontWeight: 500,
    //         bgcolor: "#0f172a",
    //         px: 0.6,
    //       },
    //       "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //       "& .MuiOutlinedInput-root": {
    //         color: "#f8fafc",
    //         fontSize: "12.5px",
    //         bgcolor: "#0f172a",
    //         borderRadius: "6px",
    //         "& fieldset": { borderColor: "#334155" },
    //         "&:hover fieldset": { borderColor: "#475569" },
    //         "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
    //       },
    //     }}
    //   />

    //   {/* Grid Layout for City and State (Kept unified inside grid setup) */}
    //   <Box
    //     sx={{
    //       display: "grid",
    //       gridTemplateColumns: "1fr 1fr",
    //       gap: 1.5,
    //     }}
    //   >
    //     {/* City Input */}
    //     <TextField
    //       size="small"
    //       label="City"
    //       value={form.city}
    //       onChange={updateField("city")}
    //       slotProps={{
    //         inputLabel: { shrink: true },
    //       }}
    //       sx={{
    //         "& .MuiInputLabel-root": {
    //           color: "#94a3b8",
    //           fontSize: "13px",
    //           fontWeight: 500,
    //           bgcolor: "#0f172a",
    //           px: 0.6,
    //         },
    //         "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //         "& .MuiOutlinedInput-root": {
    //           color: "#f8fafc",
    //           fontSize: "12.5px",
    //           bgcolor: "#0f172a",
    //           borderRadius: "6px",
    //           "& fieldset": { borderColor: "#334155" },
    //           "&:hover fieldset": { borderColor: "#475569" },
    //           "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
    //         },
    //       }}
    //     />

    //     {/* State Input */}
    //     <TextField
    //       size="small"
    //       label="State"
    //       value={form.state}
    //       onChange={updateField("state")}
    //       slotProps={{
    //         inputLabel: { shrink: true },
    //       }}
    //       sx={{
    //         "& .MuiInputLabel-root": {
    //           color: "#94a3b8",
    //           fontSize: "13px",
    //           fontWeight: 500,
    //           bgcolor: "#0f172a",
    //           px: 0.6,
    //         },
    //         "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //         "& .MuiOutlinedInput-root": {
    //           color: "#f8fafc",
    //           fontSize: "12.5px",
    //           bgcolor: "#0f172a",
    //           borderRadius: "6px",
    //           "& fieldset": { borderColor: "#334155" },
    //           "&:hover fieldset": { borderColor: "#475569" },
    //           "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
    //         },
    //       }}
    //     />
    //   </Box>

    //   {/* Country Input */}
    //   <TextField
    //     fullWidth
    //     size="small"
    //     label="Country"
    //     value={form.country}
    //     onChange={updateField("country")}
    //     slotProps={{
    //       inputLabel: { shrink: true },
    //     }}
    //     sx={{
    //       "& .MuiInputLabel-root": {
    //         color: "#94a3b8",
    //         fontSize: "13px",
    //         fontWeight: 500,
    //         bgcolor: "#0f172a",
    //         px: 0.6,
    //       },
    //       "& .MuiInputLabel-root.Mui-focused": { color: "#F5714E" },
    //       "& .MuiOutlinedInput-root": {
    //         color: "#f8fafc",
    //         fontSize: "12.5px",
    //         bgcolor: "#0f172a",
    //         borderRadius: "6px",
    //         "& fieldset": { borderColor: "#334155" },
    //         "&:hover fieldset": { borderColor: "#475569" },
    //         "&.Mui-focused fieldset": { borderColor: "#F5714E", borderWidth: "1.5px" },
    //       },
    //     }}
    //   />

    //   {/* Clean Full-Width Button matching Contact Layout */}
    //   <Button
    //     type="button"
    //     variant="contained"
    //     disabled={loading}
    //     startIcon={<SaveIcon sx={{ fontSize: "15px !important" }} />}
    //     onClick={() => {
    //       void submitForm();
    //     }}
    //     sx={{
    //       width: "100%", // Extends to 100% to seamlessly match layout flow
    //       textTransform: "none",
    //       borderRadius: "6px",
    //       bgcolor: "#F5714E", // Your unified premium orange color
    //       fontSize: "13px",
    //       fontWeight: 600,
    //       py: 0.9,
    //       boxShadow: "none",
    //       "&:hover": {
    //         bgcolor: "#e05e3b",
    //         boxShadow: "none",
    //       },
    //       "&.Mui-disabled": {
    //         bgcolor: "rgba(245, 113, 78, 0.3)",
    //         color: "rgba(248, 250, 252, 0.4)",
    //       },
    //     }}
    //   >
    //     {loading ? "Saving..." : "Save Company"}
    //   </Button>
    // </Stack>

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
        fullWidth
        size="small"
        label="Company Name"
        value={form.name}
        onChange={updateField("name")}
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
          },
        }}
      />

      <TextField
        fullWidth
        size="small"
        label="Domain"
        placeholder="example.com"
        value={form.domain}
        onChange={updateField("domain")}
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
            "& input::placeholder": { color: "#475569", opacity: 1 },
          },
        }}
      />

      <TextField
        fullWidth
        size="small"
        label="Phone"
        value={form.phone}
        onChange={updateField("phone")}
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
          },
        }}
      />

      <TextField
        fullWidth
        size="small"
        label="Industry"
        value={form.industry}
        onChange={updateField("industry")}
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
          },
        }}
      />

      <TextField
        fullWidth
        size="small"
        type="number"
        label="Number of Employees"
        value={form.numberofemployees}
        onChange={updateField("numberofemployees")}
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
          size="small"
          label="City"
          value={form.city}
          onChange={updateField("city")}
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
            },
          }}
        />
      </Box>

      <TextField
        fullWidth
        size="small"
        label="Country"
        value={form.country}
        onChange={updateField("country")}
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
          },
        }}
      />

      <Button
        type="button"
        variant="contained"
        disabled={loading}
        startIcon={<SaveIcon sx={{ fontSize: "15px !important" }} />}
        onClick={() => {
          void submitForm();
        }}
        sx={{
          width: "100%",
          textTransform: "none",
          borderRadius: "6px",
          bgcolor: "#F5714E",
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
            color: "rgba(248, 250, 252, 0.4)",
          },
        }}
      >
        {loading ? "Saving..." : "Save Company"}
      </Button>
    </Stack>
  );
}
