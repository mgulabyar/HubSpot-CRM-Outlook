// import React, { useEffect, useState } from "react";
// import {
//   Button,
//   Dialog,
//   DialogActions,
//   DialogContent,
//   DialogTitle,
//   Stack,
//   TextField,
// } from "@mui/material";

// import type { CompanyFormValues, CompanyRecord } from "../../types/CompanyModels";

// type Props = {
//   open: boolean;
//   company: CompanyRecord | null;
//   loading: boolean;
//   onClose: () => void;
//   onSave: (values: CompanyFormValues) => Promise<boolean>;
// };

// const emptyForm: CompanyFormValues = {
//   name: "",
//   domain: "",
//   phone: "",
//   city: "",
//   state: "",
//   country: "",
//   industry: "",
//   numberofemployees: "",
// };

// export default function CompanyEditModal({ open, company, loading, onClose, onSave }: Props) {
//   const [form, setForm] = useState<CompanyFormValues>(emptyForm);

//   useEffect(() => {
//     if (!company) {
//       setForm(emptyForm);
//       return;
//     }

//     setForm({
//       name: company.properties.name || "",
//       domain: company.properties.domain || "",
//       phone: company.properties.phone || "",
//       city: company.properties.city || "",
//       state: company.properties.state || "",
//       country: company.properties.country || "",
//       industry: company.properties.industry || "",
//       numberofemployees: company.properties.numberofemployees || "",
//     });
//   }, [company]);

//   const updateField =
//     (field: keyof CompanyFormValues) =>
//     (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       setForm((previous) => ({
//         ...previous,
//         [field]: event.target.value,
//       }));
//     };

//   const saveChanges = async () => {
//     const successful = await onSave(form);

//     if (successful) {
//       setForm(emptyForm);
//       onClose();
//     }
//   };

//   return (
//     <Dialog open={open} onClose={loading ? undefined : onClose} maxWidth="xs" fullWidth>
//       <DialogTitle
//         sx={{
//           color: "#1e2a3c",
//           fontWeight: 700,
//           fontSize: "18px",
//         }}
//       >
//         Edit Company
//       </DialogTitle>

//       <DialogContent>
//         <Stack spacing={1.5} sx={{ pt: 1 }}>
//           <TextField
//             size="small"
//             fullWidth
//             label="Company Name"
//             value={form.name}
//             onChange={updateField("name")}
//           />

//           <TextField
//             size="small"
//             fullWidth
//             label="Domain"
//             value={form.domain}
//             onChange={updateField("domain")}
//           />

//           <TextField
//             size="small"
//             fullWidth
//             label="Phone"
//             value={form.phone}
//             onChange={updateField("phone")}
//           />

//           <TextField
//             size="small"
//             fullWidth
//             label="Industry"
//             value={form.industry}
//             onChange={updateField("industry")}
//           />

//           <TextField
//             size="small"
//             fullWidth
//             type="number"
//             label="Number of Employees"
//             value={form.numberofemployees}
//             onChange={updateField("numberofemployees")}
//           />

//           <TextField
//             size="small"
//             fullWidth
//             label="City"
//             value={form.city}
//             onChange={updateField("city")}
//           />

//           <TextField
//             size="small"
//             fullWidth
//             label="State"
//             value={form.state}
//             onChange={updateField("state")}
//           />

//           <TextField
//             size="small"
//             fullWidth
//             label="Country"
//             value={form.country}
//             onChange={updateField("country")}
//           />
//         </Stack>
//       </DialogContent>

//       <DialogActions sx={{ px: 3, pb: 2 }}>
//         <Button
//           type="button"
//           onClick={onClose}
//           disabled={loading}
//           sx={{
//             textTransform: "none",
//             color: "#2d3e50",
//           }}
//         >
//           Cancel
//         </Button>

//         <Button
//           type="button"
//           variant="contained"
//           onClick={() => {
//             void saveChanges();
//           }}
//           disabled={loading}
//           sx={{
//             textTransform: "none",
//             bgcolor: "#F5714E",
//             boxShadow: "none",
//             "&:hover": {
//               bgcolor: "#e65f3d",
//               boxShadow: "none",
//             },
//           }}
//         >
//           {loading ? "Updating..." : "Update"}
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }

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

const darkFieldSx = {
  "& .MuiInputLabel-root": {
    color: "#94a3b8",
    fontSize: "12.5px",
    fontWeight: 500,
    bgcolor: "#1e293b",
    px: 0.6,
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#F5714E",
  },
  "& .MuiOutlinedInput-root": {
    color: "#f8fafc",
    fontSize: "12.5px",
    bgcolor: "#0f172a",
    borderRadius: "6px",
    "& input": { color: "#f8fafc", padding: "8.5px 12px" },
    "& fieldset": { borderColor: "#334155" },
    "&:hover fieldset": { borderColor: "#475569" },
    "&.Mui-focused fieldset": {
      borderColor: "#F5714E",
      borderWidth: "1.5px",
    },
  },
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
            bgcolor: "#1e293b",
            borderLeft: "3px solid #F5714E",
            borderRadius: "0px 8px 8px 0px",
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#f8fafc",
          fontWeight: 700,
          fontSize: "15px",
          py: 1.2,
          px: 1.5,
        }}
      >
        Edit Company
      </DialogTitle>

      <DialogContent sx={{ px: 1.5, py: 0.8 }}>
        <Stack spacing={1} sx={{ pt: 0.5 }}>
          <TextField
            size="small"
            fullWidth
            label="Company Name"
            value={form.name}
            onChange={updateField("name")}
            slotProps={{
              inputLabel: { shrink: true },
            }}
            sx={darkFieldSx}
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
            sx={darkFieldSx}
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
            sx={darkFieldSx}
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
            sx={darkFieldSx}
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
            sx={darkFieldSx}
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
              sx={darkFieldSx}
            />

            <TextField
              size="small"
              label="State"
              value={form.state}
              onChange={updateField("state")}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              sx={darkFieldSx}
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
            sx={darkFieldSx}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 1.5, pb: 1.2, pt: 0.5 }}>
        <Button
          type="button"
          onClick={onClose}
          disabled={loading}
          sx={{
            textTransform: "none",
            color: "#94a3b8",
            fontSize: "12.5px",
            px: 1.2,
            "&:hover": {
              bgcolor: "rgba(148, 163, 184, 0.12)",
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
            textTransform: "none",
            fontSize: "12.5px",
            fontWeight: 600,
            px: 1.5,
            py: 0.5,
            bgcolor: "#F5714E",
            boxShadow: "none",
            "&:hover": {
              bgcolor: "#e05e3b",
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
