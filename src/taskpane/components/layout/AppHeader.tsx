import React from "react";
import { Box, Stack, Typography } from "@mui/material";

export default function AppHeader() {
  return (
    <Box
      component="header"
      sx={{
        position: "sticky",
        top: 0,
        zIndex: 1100,
        px: 2,
        py: 1.5,
        bgcolor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.06), 0 2px 4px -1px rgba(0, 0, 0, 0.04)",
      }}
    >
      <Stack spacing={0.4}>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            textAlign: "center",
            fontFamily: "Arial, sans-serif",
            fontSize: "20px",
            fontWeight: 500,
            color: "#F5714E",
            letterSpacing: "0.5px",
            lineHeight: 1.2,
          }}
        >
          HubSpot CRM
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#64748b",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            textAlign: "center",
            fontWeight: 500,
            letterSpacing: "0.2px",
          }}
        >
          Outlook Add-in Workspace Engine
        </Typography>
      </Stack>
    </Box>
  );
}