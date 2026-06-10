export interface EventHistory {
  id: number;
  eventId: number;

  user: string;
  timestamp: string;

  field: string;
  oldValue: string;
  newValue: string;

  comment?: string;
}

import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Avatar,
  Box,
  Chip,
  Typography,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface HistoryTabProps {
  history: EventHistory[];
}

export const HistoryTab: React.FC<HistoryTabProps> = ({
  history,
}) => {
  return (
    <Box>
      {history.length === 0 ? (
        <Typography
          color="text.secondary"
          sx={{ p: 2 }}
        >
          No history available
        </Typography>
      ) : (
        history.map((item) => (
          <Accordion
            key={item.id}
            disableGutters
            elevation={0}
            sx={{
              border: "1px solid #E5E7EB",
              borderRadius: "6px !important",
              mb: 1,

              "&:before": {
                display: "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{
                minHeight: 56,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  width: "100%",
                  gap: 2,
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    fontSize: 12,
                    bgcolor: "#0078D4",
                  }}
                >
                  {item.user
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)}
                </Avatar>

                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 600,
                      fontSize: 14,
                    }}
                  >
                    {item.user}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {item.timestamp}
                  </Typography>
                </Box>

                <Chip
                  size="small"
                  label={item.field}
                />
              </Box>
            </AccordionSummary>

            <AccordionDetails>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 1,
                }}
              >
                <Typography variant="body2">
                  Changed{" "}
                  <strong>{item.field}</strong>
                </Typography>

                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1,
                    flexWrap: "wrap",
                  }}
                >
                  <Chip
                    label={item.oldValue}
                    size="small"
                    variant="outlined"
                  />

                  <Typography>
                    →
                  </Typography>

                  <Chip
                    label={item.newValue}
                    size="small"
                    color="primary"
                  />
                </Box>

                {item.comment && (
                  <Box
                    sx={{
                      mt: 1,
                      p: 1.5,
                      bgcolor: "#F9FAFB",
                      borderRadius: 1,
                    }}
                  >
                    <Typography
                      variant="body2"
                    >
                      {item.comment}
                    </Typography>
                  </Box>
                )}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      )}
    </Box>
  );
};