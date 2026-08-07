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
        py: 1.8,
        bgcolor: "#1e293b", 
        borderBottom: "1px solid #334155", 
        boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)", // Soft elite elevation layer
      }}
    >
      <Stack spacing={0.4}>
        <Typography
          variant="h6"
          component="h1"
          sx={{
            textAlign: "center",
            fontSize: "18px", // Balanced typography size for narrow taskpanes
            fontWeight: 700, // Solid premium bold font weight
            color: "#F5714E", // Your exact unified HubSpot brand accent orange color
            letterSpacing: "0.5px",
            lineHeight: 1.2,
          }}
        >
          HubSpot CRM
        </Typography>

        <Typography
          variant="caption"
          sx={{
            color: "#94a3b8", // Bright crisp silver-grey text color for optimal contrast
            fontSize: "11px", // Highly readable micro metadata scale
            textAlign: "center",
            fontWeight: 500,
            letterSpacing: "0.2px"
          }}
        >
          Outlook Add-in Workspace Engine
        </Typography>
      </Stack>
    </Box>
  );
}
