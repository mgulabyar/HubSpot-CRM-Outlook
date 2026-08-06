import React from "react";
import {
  Box,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import type { HubSpotRecord } from "../../types/hubspot";

type ContactListProps = {
  contacts: HubSpotRecord[];
  loading: boolean;
};

export default function ContactList({
  contacts,
  loading,
}: ContactListProps) {
  if (loading) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        Loading contacts...
      </Typography>
    );
  }

  if (contacts.length === 0) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          fontSize: "12px",
        }}
      >
        No contacts found in HubSpot.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.2}>
      {contacts.map((contact) => {
        const properties = contact.properties;

        const fullName =
          [properties.firstname, properties.lastname]
            .filter(Boolean)
            .join(" ") ||
          properties.email ||
          "Unnamed Contact";

        return (
          <Card
            key={contact.id}
            elevation={0}
            sx={{
              border: "1px solid #cbd6e2",
              borderRadius: "4px",
              bgcolor: "#fff",
            }}
          >
            <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: 1,
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{
                      color: "#1e2a3c",
                      fontWeight: 700,
                    }}
                  >
                    {fullName}
                  </Typography>

                  <Chip
                    label="Contact"
                    size="small"
                    sx={{
                      height: 22,
                      fontSize: "10px",
                      color: "#ff7a59",
                      bgcolor: "rgba(255, 122, 89, 0.08)",
                    }}
                  />
                </Box>

                <Divider />

                <Typography
                  variant="caption"
                  sx={{ color: "#475569" }}
                >
                  {properties.email || "No email"}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "#64748b" }}
                >
                  {properties.company || "No company"}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}