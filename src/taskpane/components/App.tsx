import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Divider,
  Grid as Grid,
  TextField,
  Typography,
  Alert,
  Stack,
} from "@mui/material";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SaveIcon from "@mui/icons-material/Save";
import SearchIcon from "@mui/icons-material/Search";

type FormState = {
  name: string;
  email: string;
  company: string;
  subject: string;
  notes: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  subject: "",
  notes: "",
};

const HUBSPOT_BRAND = {
  primary: "#ff7a59",       
  primaryHover: "#ea6541",  
  charcoal: "#2d3e50",      
  charcoalHover: "#1e2a36", 
  background: "#f5f8fa",    
  border: "#cbd6e2",        
  textDark: "#1e2a3c",
};

export default function App() {
  const [form, setForm] = useState<FormState>(initialState);
  const [saved, setSaved] = useState(false);

  const hasAnyValue = useMemo(
    () =>
      Object.keys(form).some(
        (key) => String(form[key as keyof FormState]).trim().length > 0
      ),
    [form]
  );

  const handleChange =
    (key: keyof FormState) =>
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [key]: event.target.value }));
      setSaved(false);
    };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: HUBSPOT_BRAND.background,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Clean Header Block */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1100,
          px: 2.5,
          py: 2.5,
          bgcolor: "#fff",
          borderBottom: `1px solid ${HUBSPOT_BRAND.border}`,
        }}
      >
        <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 700, letterSpacing: "-0.5px", color: HUBSPOT_BRAND.textDark, lineHeight: 1.1 }}>
              HubSpot CRM
            </Typography>
            <Typography variant="caption" sx={{ color: "#64748b", fontSize: "12px", display: "block", mt: 0.5 }}>
              Outlook Add-in Workspace Engine
            </Typography>
          </Box>
        </Stack>
      </Box>

      {/* Main Workspace Frame */}
      <Box sx={{ p: 2.5, flexGrow: 1 }}>
        <Stack spacing={2.5}>

          {/* Form Matrix Architecture */}
          <Grid container spacing={2}>
            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Full Name"
                value={form.name}
                onChange={handleChange("name")}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: "#fff" }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Email Address"
                value={form.email}
                onChange={handleChange("email")}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: "#fff" }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Company Name"
                value={form.company}
                onChange={handleChange("company")}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: "#fff" }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                label="Subject Line"
                value={form.subject}
                onChange={handleChange("subject")}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: "#fff" }}
              />
            </Grid>

            <Grid size={12}>
              <TextField
                fullWidth
                size="small"
                multiline
                minRows={3}
                label="Internal Notes"
                value={form.notes}
                onChange={handleChange("notes")}
                slotProps={{ inputLabel: { shrink: true } }}
                sx={{ bgcolor: "#fff" }}
              />
            </Grid>
          </Grid>

          {/* Context Identifiers */}
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1 }}>
            <Chip 
              label="CRM Connected" 
              size="small"
              sx={{ 
                bgcolor: "rgba(255, 122, 89, 0.08)", 
                color: HUBSPOT_BRAND.primary, 
                fontWeight: 600,
                fontSize: "11px",
                borderColor: "rgba(255, 122, 89, 0.3)"
              }} 
              variant="outlined"
            />
            <Chip 
              label="Add-in Active" 
              size="small"
              sx={{ 
                bgcolor: "rgba(45, 62, 80, 0.06)", 
                color: HUBSPOT_BRAND.charcoal, 
                fontWeight: 600,
                fontSize: "11px",
                borderColor: "rgba(45, 62, 80, 0.2)"
              }} 
              variant="outlined"
            />
          </Stack>

          <Divider sx={{ borderColor: HUBSPOT_BRAND.border }} />

          {/* Action Module Matrix */}
          <Stack direction="row" sx={{ flexWrap: "wrap", gap: 1.2 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon sx={{ fontSize: "16px !important" }} />}
              onClick={handleSave}
              sx={{ 
                textTransform: "none", 
                borderRadius: "4px",
                bgcolor: HUBSPOT_BRAND.primary,
                fontSize: "13px",
                fontWeight: 600,
                px: 2,
                py: 0.6,
                boxShadow: "none",
                "&:hover": { bgcolor: HUBSPOT_BRAND.primaryHover, boxShadow: "none" }
              }}
            >
              Save Draft
            </Button>
            <Button
              variant="contained"
              startIcon={<SearchIcon sx={{ fontSize: "16px !important" }} />}
              sx={{ 
                textTransform: "none", 
                borderRadius: "4px",
                bgcolor: HUBSPOT_BRAND.charcoal,
                fontSize: "13px",
                fontWeight: 600,
                px: 2,
                py: 0.6,
                boxShadow: "none",
                "&:hover": { bgcolor: HUBSPOT_BRAND.charcoalHover, boxShadow: "none" }
              }}
            >
              Find Contact
            </Button>
            <Button
              variant="text"
              endIcon={<OpenInNewIcon sx={{ fontSize: "14px !important" }} />}
              sx={{ 
                textTransform: "none", 
                color: HUBSPOT_BRAND.charcoal,
                fontSize: "13px",
                fontWeight: 600,
                "&:hover": { color: HUBSPOT_BRAND.primary, bgcolor: "transparent" }
              }}
            >
              Open CRM
            </Button>
          </Stack>

          {/* Test State Feedback Module */}
          {saved && (
            <Alert severity="success" sx={{ borderRadius: "4px", fontSize: "12px", boxShadow: "none" }}>
              Draft saved successfully. Data pipeline test operational.
            </Alert>
          )}
        </Stack>
      </Box>
    </Box>
  );
}
