import React from "react";
import { Box, Stack } from "@mui/material";
import AppHeader from "./layout/AppHeader";
import ContactsPage from "./contacts/ContactsPage";

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#f5f8fa",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <AppHeader />

      <Box
        sx={{
          p: 1.5,
          flexGrow: 1,
        }}
      >
        <Stack spacing={2.5}>
          <ContactsPage />
        </Stack>
      </Box>
    </Box>
  );
}