// import React from "react";
// import {
//   Box,
//   Card,
//   CardContent,
//   Chip,
//   Divider,
//   IconButton,
//   Stack,
//   Tooltip,
//   Typography,
// } from "@mui/material";
// import DeleteOutlineIcon from "@mui/icons-material/Delete";
// import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

// import type { HubSpotRecord } from "../../types/hubspot";

// type ContactListProps = {
//   contacts: HubSpotRecord[];
//   notesByContact: Record<string, HubSpotRecord | null>;
//   loading: boolean;
//   deletingId: string | null;
//   onDelete: (contactId: string) => Promise<void>;
//   onEdit: (contactId: string) => void;
// };

// function getNoteContent(note: HubSpotRecord | null | undefined) {
//   const body = note?.properties?.hs_note_body || "";

//   const subjectMatch = body.match(/^Subject Line:\s*(.*)$/m);

//   const notesMatch = body.match(/^Internal Notes:\s*([\s\S]*)$/m);

//   return {
//     subject: subjectMatch?.[1]?.trim() || "",
//     notes: notesMatch?.[1]?.trim() || "",
//   };
// }

// function formatDate(value?: string) {
//   if (!value) {
//     return "Not available";
//   }

//   const date = new Date(value);

//   if (Number.isNaN(date.getTime())) {
//     return "Not available";
//   }

//   return date.toLocaleString();
// }

// export default function ContactList({
//   contacts,
//   notesByContact,
//   loading,
//   deletingId,
//   onDelete,
//   onEdit,
// }: ContactListProps) {
//   console.log("[ContactList] rendered contacts:", contacts.length);

//   if (loading) {
//     return (
//       <Typography
//         variant="body2"
//         sx={{
//           color: "#64748b",
//           fontSize: "12px",
//         }}
//       >
//         Loading contacts...
//       </Typography>
//     );
//   }

//   if (contacts.length === 0) {
//     return (
//       <Typography
//         variant="body2"
//         sx={{
//           color: "#64748b",
//           fontSize: "12px",
//         }}
//       >
//         No contacts found in HubSpot.
//       </Typography>
//     );
//   }

//   return (
//     <Stack spacing={1.5}>
//       {contacts.map((contact) => {
//         const contactId = String(contact.id);
//         const properties = contact.properties;
//         const note = notesByContact[contactId] || null;
//         const noteContent = getNoteContent(note);

//         const fullName =
//           [properties.firstname, properties.lastname].filter(Boolean).join(" ") ||
//           properties.email ||
//           "Unnamed Contact";

//         const isDeleting = deletingId === contactId;

//         return (
//           <Card
//             key={contactId}
//             data-contact-id={contactId}
//             elevation={0}
//             sx={{
//               border: "none",
//               borderLeft: "3px solid #F5714E",
//               borderRadius: "0px 8px 8px 0px",
//               bgcolor: "#1e293b",
//               opacity: isDeleting ? 0.55 : 1,
//               boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
//               transition: "all 200ms ease",
//               "&:hover": {
//                 bgcolor: "#243146",
//               },
//             }}
//           >
//             <CardContent
//               sx={{
//                 p: 1.5,
//                 "&:last-child": {
//                   pb: 1.5,
//                 },
//               }}
//             >
//               <Stack spacing={1.2}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "flex-start",
//                     justifyContent: "space-between",
//                     gap: 1,
//                   }}
//                 >
//                   <Box sx={{ minWidth: 0 }}>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: "#f8fafc",
//                         fontWeight: 600,
//                         wordBreak: "break-word",
//                         fontSize: "14.5px",
//                         lineHeight: 1.2,
//                       }}
//                     >
//                       {fullName}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         display: "block",
//                         color: "#cbd5e1",
//                         fontSize: "11px",
//                         mt: 0.3,
//                       }}
//                     >
//                       ID: {contactId}
//                     </Typography>
//                   </Box>

//                   <Chip
//                     label="Contact"
//                     size="small"
//                     sx={{
//                       height: 24,
//                       fontSize: "9px",
//                       fontWeight: 700,
//                       textTransform: "uppercase",
//                       letterSpacing: "0.5px",
//                       color: "#f8fafc",
//                       bgcolor: "#F5714E",
//                     }}
//                   />
//                 </Box>

//                 <Box
//                   sx={{
//                     bgcolor: "#0f172a",
//                     p: 1.2,
//                     borderRadius: "6px",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 1.2,
//                   }}
//                 >
//                   <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: "#cbd5e1",
//                         fontWeight: 500,
//                         fontSize: "11.5px",
//                         width: "70px",
//                         flexShrink: 0,
//                       }}
//                     >
//                       Email
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: "#f8fafc",
//                         fontSize: "11.5px",
//                         textAlign: "left",
//                         wordBreak: "break-all",
//                       }}
//                     >
//                       {properties.email || "—"}
//                     </Typography>
//                   </Box>

//                   <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: "#cbd5e1",
//                         fontWeight: 500,
//                         fontSize: "11.5px",
//                         width: "70px",
//                         flexShrink: 0,
//                       }}
//                     >
//                       Company
//                     </Typography>
//                     <Typography
//                       variant="body2"
//                       sx={{
//                         color: "#f8fafc",
//                         fontSize: "11.5px",
//                         textAlign: "left",
//                         wordBreak: "break-word",
//                       }}
//                     >
//                       {properties.company || "—"}
//                     </Typography>
//                   </Box>

//                   {noteContent.subject && (
//                     <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "#cbd5e1",
//                           fontWeight: 500,
//                           fontSize: "11.5px",
//                           width: "70px",
//                           flexShrink: 0,
//                         }}
//                       >
//                         Subject
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "#f8fafc",
//                           fontSize: "11.5px",
//                           textAlign: "left",
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         {noteContent.subject}
//                       </Typography>
//                     </Box>
//                   )}

//                   {noteContent.notes && (
//                     <Box sx={{ display: "flex", alignItems: "flex-start" }}>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "#cbd5e1",
//                           fontWeight: 500,
//                           fontSize: "11.5px",
//                           width: "70px",
//                           flexShrink: 0,
//                         }}
//                       >
//                         Notes
//                       </Typography>
//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "#f8fafc",
//                           fontSize: "11.5px",
//                           textAlign: "left",
//                           whiteSpace: "pre-wrap",
//                           wordBreak: "break-word",
//                         }}
//                       >
//                         {noteContent.notes}
//                       </Typography>
//                     </Box>
//                   )}
//                 </Box>

//                 <Divider sx={{ borderColor: "#334155", my: 0.2 }} />

//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "space-between",
//                   }}
//                 >
//                   <Box>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         color: "#94a3b8",
//                         fontSize: "10px",
//                         display: "block",
//                         lineHeight: 1.35,
//                       }}
//                     >
//                       Created: {formatDate(contact.createdAt)}
//                     </Typography>
//                     <Typography
//                       variant="caption"
//                       sx={{
//                         color: "#94a3b8",
//                         fontSize: "10px",
//                         display: "block",
//                         lineHeight: 1.35,
//                       }}
//                     >
//                       Updated: {formatDate(contact.updatedAt)}
//                     </Typography>
//                   </Box>

//                   <Box sx={{ display: "flex", gap: 0.2 }}>
//                     <Tooltip title="Edit contact" arrow>
//                       <IconButton
//                         type="button"
//                         size="small"
//                         disabled={isDeleting}
//                         aria-label="Edit contact"
//                         onClick={(event) => {
//                           event.preventDefault();
//                           event.stopPropagation();
//                           onEdit(contactId);
//                         }}
//                         sx={{
//                           color: "#94a3b8",
//                           p: 0.5,
//                           borderRadius: "4px",
//                           "&:hover": {
//                             bgcolor: "rgba(245, 113, 78, 0.12)",
//                             color: "#F5714E",
//                           },
//                         }}
//                       >
//                         <EditOutlinedIcon sx={{ fontSize: "15px" }} />
//                       </IconButton>
//                     </Tooltip>

//                     <Tooltip title="Delete contact" arrow>
//                       <IconButton
//                         type="button"
//                         size="small"
//                         disabled={isDeleting}
//                         aria-label="Delete contact"
//                         onClick={(event) => {
//                           event.preventDefault();
//                           event.stopPropagation();
//                           if (typeof onDelete !== "function") return;
//                           void onDelete(contactId);
//                         }}
//                         sx={{
//                           color: "#94a3b8",
//                           p: 0.5,
//                           borderRadius: "4px",
//                           "&:hover": {
//                             bgcolor: "rgba(220, 38, 38, 0.12)",
//                             color: "#f87171",
//                           },
//                         }}
//                       >
//                         <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
//                       </IconButton>
//                     </Tooltip>
//                   </Box>
//                 </Box>
//               </Stack>
//             </CardContent>
//           </Card>
//         );
//       })}
//     </Stack>
//   );
// }

import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Collapse,
  Divider,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/Delete";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import type { HubSpotRecord } from "../../types/hubspot";

type ContactListProps = {
  contacts: HubSpotRecord[];
  notesByContact: Record<string, HubSpotRecord | null>;
  loading: boolean;
  deletingId: string | null;
  onDelete: (contactId: string) => Promise<void>;
  onEdit: (contactId: string) => void;
};

type NoteContent = {
  subject: string;
  notes: string;
};

function getNoteContent(note: HubSpotRecord | null | undefined): NoteContent {
  const body = note?.properties?.hs_note_body || "";

  const subjectMatch = body.match(/^Subject Line:\s*(.*)$/m);

  const notesMatch = body.match(/^Internal Notes:\s*([\s\S]*)$/m);

  return {
    subject: subjectMatch?.[1]?.trim() || "",
    notes: notesMatch?.[1]?.trim() || "",
  };
}

function formatDate(value?: string) {
  if (!value) {
    return "Not available";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Not available";
  }

  return date.toLocaleString();
}

const detailRowSx = {
  display: "flex",
  alignItems: "flex-start",
};

const detailLabelSx = {
  color: "#64748b",
  fontFamily: "Arial, sans-serif",
  fontWeight: 500,
  fontSize: "11.5px",
  width: "70px",
  flexShrink: 0,
};

const detailValueSx = {
  color: "#1e293b",
  fontFamily: "Arial, sans-serif",
  fontSize: "11.5px",
  textAlign: "left" as const,
  wordBreak: "break-word" as const,
};

type ContactCardProps = {
  contactId: string;
  fullName: string;
  properties: HubSpotRecord["properties"];
  noteContent: NoteContent;
  isDeleting: boolean;
  createdAt?: string;
  updatedAt?: string;
  onEdit: (contactId: string) => void;
  onDelete: (contactId: string) => void | Promise<void>;
};

function ContactCard({
  contactId,
  fullName,
  properties,
  noteContent,
  isDeleting,
  createdAt,
  updatedAt,
  onEdit,
  onDelete,
}: ContactCardProps) {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded((previous) => !previous);

  return (
    <Card
      key={contactId}
      data-contact-id={contactId}
      elevation={0}
      sx={{
        border: "1px solid #e2e8f0",
        borderLeft: "3px solid #F5714E",
        borderRadius: "10px",
        bgcolor: "#ffffff",
        opacity: isDeleting ? 0.55 : 1,
        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.06)",
        transition: "all 200ms ease",
        "&:hover": {
          bgcolor: "#fff",
        },
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
        <Box
          onClick={toggleExpanded}
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 1,
            cursor: "pointer",
          }}
        >
          <Typography
            sx={{
              color: "#1e293b",
              fontFamily: "Arial",
              fontWeight: 500,
              fontSize: "14px",
              lineHeight: 1.2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              minWidth: 0,
              flex: 1,
            }}
          >
            {fullName}
          </Typography>

          <IconButton
            type="button"
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              toggleExpanded();
            }}
            aria-label={expanded ? "Collapse contact details" : "Expand contact details"}
            sx={{
              flexShrink: 0,
              color: "#64748b",
              p: 0.5,
              borderRadius: "6px",
              bgcolor: "rgba(245, 113, 78, 0.1)",
              transform: expanded ? "rotate(45deg)" : "rotate(0deg)",
              transition: "transform 200ms ease, background-color 200ms ease",
              "&:hover": {
                bgcolor: "rgba(245, 113, 78, 0.2)",
                color: "#F5714E",
              },
            }}
          >
            <AddIcon sx={{ fontSize: "16px" }} />
          </IconButton>
        </Box>

        <Collapse in={expanded} timeout={220} unmountOnExit>
          <Stack spacing={1.2} sx={{ pt: 1.2 }}>
            <Box
              sx={{
                bgcolor: "#fff",
                border: "1px solid #e2e8f0",
                p: 1.2,
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: 1.2,
              }}
            >
              <Box sx={detailRowSx}>
                <Typography sx={detailLabelSx}>ID</Typography>
                <Typography sx={{ ...detailValueSx, wordBreak: "break-all" }}>
                  {contactId}
                </Typography>
              </Box>

              <Box sx={detailRowSx}>
                <Typography sx={detailLabelSx}>Email</Typography>
                <Typography sx={{ ...detailValueSx, wordBreak: "break-all" }}>
                  {properties.email || "—"}
                </Typography>
              </Box>

              <Box sx={detailRowSx}>
                <Typography sx={detailLabelSx}>Company</Typography>
                <Typography sx={detailValueSx}>{properties.company || "—"}</Typography>
              </Box>

              {noteContent.subject && (
                <Box sx={detailRowSx}>
                  <Typography sx={detailLabelSx}>Subject</Typography>
                  <Typography sx={detailValueSx}>{noteContent.subject}</Typography>
                </Box>
              )}

              {noteContent.notes && (
                <Box sx={detailRowSx}>
                  <Typography sx={detailLabelSx}>Notes</Typography>
                  <Typography
                    sx={{
                      ...detailValueSx,
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {noteContent.notes}
                  </Typography>
                </Box>
              )}
            </Box>

            <Divider sx={{ borderColor: "#e2e8f0", my: 0.2 }} />

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px",
                    display: "block",
                    lineHeight: 1.35,
                  }}
                >
                  Created: {formatDate(createdAt)}
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: "#64748b",
                    fontFamily: "Arial, sans-serif",
                    fontSize: "10px",
                    display: "block",
                    lineHeight: 1.35,
                  }}
                >
                  Updated: {formatDate(updatedAt)}
                </Typography>
              </Box>

              <Box sx={{ display: "flex", gap: 0.2 }}>
                <Tooltip title="Edit contact" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Edit contact"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      onEdit(contactId);
                    }}
                    sx={{
                      color: "#64748b",
                      p: 0.5,
                      borderRadius: "4px",
                      "&:hover": {
                        bgcolor: "rgba(245, 113, 78, 0.12)",
                        color: "#F5714E",
                      },
                    }}
                  >
                    <EditOutlinedIcon sx={{ fontSize: "15px" }} />
                  </IconButton>
                </Tooltip>

                <Tooltip title="Delete contact" arrow>
                  <IconButton
                    type="button"
                    size="small"
                    disabled={isDeleting}
                    aria-label="Delete contact"
                    onClick={(event) => {
                      event.preventDefault();
                      event.stopPropagation();
                      if (typeof onDelete !== "function") return;
                      void onDelete(contactId);
                    }}
                    sx={{
                      color: "#64748b",
                      p: 0.5,
                      borderRadius: "4px",
                      "&:hover": {
                        bgcolor: "rgba(220, 38, 38, 0.12)",
                        color: "#dc2626",
                      },
                    }}
                  >
                    <DeleteOutlineIcon sx={{ fontSize: "15px" }} />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}

export default function ContactList({
  contacts,
  notesByContact,
  loading,
  deletingId,
  onDelete,
  onEdit,
}: ContactListProps) {
  if (loading) {
    return (
      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          fontFamily: "Arial, sans-serif",
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
          fontFamily: "Arial, sans-serif",
          fontSize: "12px",
        }}
      >
        No contacts found in HubSpot.
      </Typography>
    );
  }

  return (
    <Stack spacing={1.5}>
      {contacts.map((contact) => {
        const contactId = String(contact.id);
        const properties = contact.properties;
        const note = notesByContact[contactId] || null;
        const noteContent = getNoteContent(note);

        const fullName =
          [properties.firstname, properties.lastname].filter(Boolean).join(" ") ||
          properties.email ||
          "Unnamed Contact";

        const isDeleting = deletingId === contactId;

        return (
          <ContactCard
            key={contactId}
            contactId={contactId}
            fullName={fullName}
            properties={properties}
            noteContent={noteContent}
            isDeleting={isDeleting}
            createdAt={contact.createdAt}
            updatedAt={contact.updatedAt}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        );
      })}
    </Stack>
  );
}
