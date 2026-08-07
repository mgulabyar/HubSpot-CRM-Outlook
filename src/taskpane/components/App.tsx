import React from "react";
import { Box, Stack } from "@mui/material";
import AppHeader from "./layout/AppHeader";
import ContactsPage from "./contacts/ContactsPage";

export default function App() {
  return (
    <Box
      component="main"
      sx={{
        minHeight: "100vh",
        bgcolor: "#0f172a",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden", 
      }}
    >

      <AppHeader />

      {/* Main Content Viewport */}
      <Box
        sx={{
          p: 0.5, // Balanced corporate breathing room padding
          flexGrow: 1,
        }}
      >
        <Stack spacing={2.5}>
          {/* Main Contacts Feature Component Layer */}
          <ContactsPage />
        </Stack>
      </Box>
    </Box>
  );
}
