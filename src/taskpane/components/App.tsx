import React from "react";
import { Box, Stack } from "@mui/material";
import AppHeader from "./layout/AppHeader";
import ContactsPage from "./contacts/ContactsPage";

const HUBSPOT_BRAND = {
  background: "#f5f8fa",
};

export default function App() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: HUBSPOT_BRAND.background,
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