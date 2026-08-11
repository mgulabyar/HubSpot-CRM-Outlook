import React from "react";
import { Box, Stack } from "@mui/material";
import { ThemeProvider, CssBaseline } from "@mui/material";
import theme from "./theme";
import AppHeader from "./layout/AppHeader";
import CrmWorkspace from "./CrmWorkspace";

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Box
        component="main"
        sx={{
          minHeight: "100vh",
          bgcolor: "#ffffff",
          color: "#1e293b",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <AppHeader />

        <Box
          sx={{
            p: 0.5,
            flexGrow: 1,
            bgcolor: "#ffffff",
          }}
        >
          <Stack spacing={1.5}>
            <CrmWorkspace />
          </Stack>
        </Box>
      </Box>
    </ThemeProvider>
  );
}