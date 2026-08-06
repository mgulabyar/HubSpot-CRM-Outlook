import React from "react";
import { Box, Stack, Typography } from "@mui/material";

const HUBSPOT_BRAND = {
  border: "#cbd6e2",
  textDark: "#1e2a3c",
};

export default function AppHeader() {
  return (
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
      <Stack spacing={0.5}>
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            letterSpacing: "-0.5px",
            color: HUBSPOT_BRAND.textDark,
            lineHeight: 1.1,
          }}
        >
          HubSpot CRM
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontSize: "12px",
          }}
        >
          Outlook Add-in Workspace Engine
        </Typography>
      </Stack>
    </Box>
  );
}