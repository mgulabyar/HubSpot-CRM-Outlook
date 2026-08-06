import React from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete"
import type { HubSpotRecord } from "../../types/hubspot";

type ContactListProps = {
  contacts: HubSpotRecord[];
  notesByContact: Record<
    string,
    HubSpotRecord | null
  >;
  loading: boolean;
  deletingId: string | null;
  onDelete: (contactId: string) => Promise<void>;
};

function getNoteContent(
  note: HubSpotRecord | null | undefined
) {
  const body = note?.properties?.hs_note_body;

  if (!body) {
    return {
      subject: "",
      notes: "",
      fullBody: "",
    };
  }

  const subjectMatch = body.match(
    /^Subject Line:\s*(.*)$/m
  );

  const notesMatch = body.match(
    /^Internal Notes:\s*([\s\S]*)$/m
  );

  return {
    subject: subjectMatch?.[1]?.trim() || "",
    notes: notesMatch?.[1]?.trim() || "",
    fullBody: body,
  };
}

export default function ContactList({
  contacts,
  notesByContact,
  loading,
  deletingId,
  onDelete,
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
        const note = notesByContact[contact.id];
        const noteContent = getNoteContent(note);

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
            <CardContent
              sx={{
                p: 1.5,
                "&:last-child": {
                  pb: 1.5,
                },
              }}
            >
              <Stack spacing={1}>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-start",
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
                      bgcolor:
                        "rgba(255, 122, 89, 0.08)",
                    }}
                  />
                </Box>

                <Divider />

                <Typography
                  variant="caption"
                  sx={{ color: "#475569" }}
                >
                  Email:{" "}
                  {properties.email || "No email"}
                </Typography>

                <Typography
                  variant="caption"
                  sx={{ color: "#64748b" }}
                >
                  Company:{" "}
                  {properties.company || "No company"}
                </Typography>

                {properties.phone && (
                  <Typography
                    variant="caption"
                    sx={{ color: "#64748b" }}
                  >
                    Phone: {properties.phone}
                  </Typography>
                )}

                {noteContent.subject && (
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "4px",
                      bgcolor:
                        "rgba(255, 122, 89, 0.06)",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#1e2a3c",
                        fontWeight: 700,
                      }}
                    >
                      Subject Line
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#475569",
                        mt: 0.3,
                      }}
                    >
                      {noteContent.subject}
                    </Typography>
                  </Box>
                )}

                {noteContent.notes && (
                  <Box
                    sx={{
                      p: 1,
                      borderRadius: "4px",
                      bgcolor: "#f8fafc",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#1e2a3c",
                        fontWeight: 700,
                      }}
                    >
                      Internal Notes
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#475569",
                        mt: 0.3,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {noteContent.notes}
                    </Typography>
                  </Box>
                )}

                {!noteContent.subject &&
                  !noteContent.notes &&
                  noteContent.fullBody && (
                    <Box
                      sx={{
                        p: 1,
                        borderRadius: "4px",
                        bgcolor: "#f8fafc",
                      }}
                    >
                      <Typography
                        variant="caption"
                        sx={{
                          color: "#475569",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {noteContent.fullBody}
                      </Typography>
                    </Box>
                  )}

                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  disabled={deletingId === contact.id}
                  startIcon={
                    <DeleteIcon 
                      sx={{
                        fontSize: "16px !important",
                      }}
                    />
                  }
                  onClick={() => {
                    void onDelete(contact.id);
                  }}
                  sx={{
                    alignSelf: "flex-start",
                    mt: 0.5,
                    textTransform: "none",
                    borderRadius: "4px",
                    fontSize: "12px",
                  }}
                >
                  {deletingId === contact.id
                    ? "Deleting..."
                    : "Delete Contact"}
                </Button>
              </Stack>
            </CardContent>
          </Card>
        );
      })}
    </Stack>
  );
}