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

      <Box
        sx={{
          p: 0.5, 
          flexGrow: 1,
        }}
      >
        <Stack spacing={1.5}>
          {/* Main Component Layer */}
          <ContactsPage />
        </Stack>
      </Box>
    </Box>
  );
}
