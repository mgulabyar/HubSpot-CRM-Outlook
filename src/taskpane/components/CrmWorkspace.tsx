import React, { useState } from "react";
import { Box, Card, Stack, Tab, Tabs, Typography } from "@mui/material";

import ContactsPage from "./contacts/ContactsPage";
import CompaniesSection from "./companies/CompaniesSection";
import DealsSection from "./deals/DealsSection";
import TasksSection from "./tasks/TasksSection";
import AssociationsSection from "./associations/AssociationsSection";

type CrmTabValue = "contacts" | "companies" | "deals" | "tasks" | "associations";

type CrmTab = {
  value: CrmTabValue;
  label: string;
};

const crmTabs: CrmTab[] = [
  {
    value: "contacts",
    label: "Contacts",
  },
  {
    value: "companies",
    label: "Companies",
  },
  {
    value: "deals",
    label: "Deals",
  },
  {
    value: "tasks",
    label: "Tasks",
  },
  {
    value: "associations",
    label: "Associations",
  },
];

function ComingSoonSection({ title, description }: { title: string; description: string }) {
  return (
    <Box
      sx={{
        minHeight: 260,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: 1.5,
      }}
    >
      <Stack
        spacing={1}
        sx={{
          textAlign: "center",
        }}
      >
        <Typography
          sx={{
            color: "#1e293b",
            fontFamily: "Arial, sans-serif",
            fontSize: "16px",
            fontWeight: 700,
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            color: "#64748b",
            fontFamily: "Arial, sans-serif",
            fontSize: "12px",
            maxWidth: 280,
          }}
        >
          {description}
        </Typography>

        <Box
          sx={{
            mt: 1,
            px: 1.5,
            py: 0.7,
            borderRadius: "5px",
            color: "#F5714E",
            bgcolor: "rgba(245, 113, 78, 0.1)",
            fontFamily: "Arial, sans-serif",
            fontSize: "11px",
            fontWeight: 600,
          }}
        >
          Coming next
        </Box>
      </Stack>
    </Box>
  );
}

function renderTabContent(value: CrmTabValue) {
  switch (value) {
    case "contacts":
      return <ContactsPage />;

    case "companies":
      return <CompaniesSection />;

    case "deals":
      return <DealsSection />;

    case "tasks":
      return <TasksSection />;

    case "associations":
      return <AssociationsSection />;

    default:
      return null;
  }
}

export default function CrmWorkspace() {
  const [activeTab, setActiveTab] = useState<CrmTabValue>("contacts");

  const handleTabChange = (_event: React.SyntheticEvent, value: CrmTabValue) => {
    setActiveTab(value);
  };

  return (
    <Box
      sx={{
        width: "100%",
        minWidth: 0,
      }}
    >
      <Card
        elevation={0}
        sx={{
          width: "100%",
          minWidth: 0,
          overflow: "hidden",
          borderRadius: "5px",
          border: "1px solid #e2e8f0",
        }}
      >
        <Box
          sx={{
            px: 1.2,
            pt: 1.2,
            borderBottom: "1px solid #e2e8f0",
            bgcolor: "#fff",
          }}
        >
          <Typography
            sx={{
              px: 0.8,
              pb: 1,
              color: "#64748b",
              fontFamily: "Arial",
              fontSize: "12px",
              fontWeight: 500,
              letterSpacing: "0.1px",
            }}
          >
            HubSpot for Outlook
          </Typography>

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons={false}
            aria-label="CRM sections"
            sx={{
              minHeight: "18px",
              width: "100%",

              "& .MuiTabs-flexContainer": {
                gap: 1.5,
              },

              "& .MuiTabs-indicator": {
                height: "2px",
                borderRadius: "2px 2px 0 0",
                bgcolor: "#F5714E",
              },

              "& .MuiTabs-scroller": {
                overflowX: "auto !important",
                scrollbarWidth: "none",
                msOverflowStyle: "none",
              },

              "& .MuiTabs-scroller::-webkit-scrollbar": {
                display: "none",
              },
            }}
          >
            {crmTabs.map((tab) => (
              <Tab
                key={tab.value}
                value={tab.value}
                label={tab.label}
                disableRipple
                sx={{
                  minHeight: "32px",
                  minWidth: "auto",
                  px: 0.8,
                  pt: 0.7,
                  pb: 1.1,
                  color: "#64748b",
                  fontFamily: "Arial",
                  textTransform: "none",
                  fontSize: "11.5px",
                  fontWeight: 500,
                  borderRadius: "5px 5px 0 0",
                  transition: "color 160ms ease, background-color 160ms ease",

                  "&:hover": {
                    color: "#1e293b",
                    bgcolor: "rgba(245, 113, 78, 0.08)",
                  },

                  "&.Mui-selected": {
                    color: "#F5714E",
                  },
                }}
              />
            ))}
          </Tabs>
        </Box>

        <Box
          sx={{
            p: 0.5,
            minHeight: 400,
            overflowX: "hidden",
          }}
        >
          {renderTabContent(activeTab)}
        </Box>
      </Card>
    </Box>
  );
}
