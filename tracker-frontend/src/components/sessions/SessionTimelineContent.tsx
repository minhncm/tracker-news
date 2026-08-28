import { Box, Chip, Typography } from "@mui/material";
import type { EventType, ReadingSession } from "../../types";
import { formatClockTime } from "../../data/mockData";

type TimelineColor = "success" | "info" | "warning" | "error" | "neutral";

const EVENT_COLORS: Record<EventType, TimelineColor> = {
  PAGE_ENTER: "success",
  PAGE_ACTIVE: "info",
  PAGE_INACTIVE: "warning",
  PAGE_LEAVE: "error",
};

function dotColor(color: TimelineColor): string {
  switch (color) {
    case "success":
      return "#16a34a";
    case "info":
      return "#2563eb";
    case "warning":
      return "#b45309";
    case "error":
      return "#dc2626";
    default:
      return "#6b7280";
  }
}

const chipPalette: Record<
  TimelineColor,
  { solid: string; soft: string; border: string }
> = {
  success: { solid: "#16a34a", soft: "#e8f7ee", border: "#bbe9cd" },
  info: { solid: "#2563eb", soft: "#eaf0fe", border: "#c4d5f8" },
  warning: { solid: "#b45309", soft: "#fdf3e3", border: "#f3ddb3" },
  error: { solid: "#dc2626", soft: "#fdeeee", border: "#f7c5c5" },
  neutral: { solid: "#6b7280", soft: "#f3f4f6", border: "#d1d5db" },
};

interface SessionTimelineContentProps {
  session: ReadingSession;
}

function SessionTimelineContent({ session }: SessionTimelineContentProps) {
  return (
    <Box>
      {session.events.length === 0 ? (
        <Box sx={{ py: 4, textAlign: "center", color: "text.secondary" }}>
          <Typography
            sx={{
              fontSize: 15,
              fontWeight: 600,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            No events found
          </Typography>
          <Typography sx={{ fontSize: 13.5 }}>
            No tracking events were recorded for this session.
          </Typography>
        </Box>
      ) : (
        <Box component="ol" sx={{ listStyle: "none", margin: 0, padding: 0 }}>
          {session.events.map((event, index) => (
            <Box
              component="li"
              key={event.id}
              sx={{
                display: "flex",
                gap: 2,
                "&:last-of-type .timeline-line": { display: "none" },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  flex: "none",
                }}
              >
                <Box
                  className="timeline-dot"
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    bgcolor: dotColor(EVENT_COLORS[event.type]),
                    boxShadow: `0 0 0 1px ${dotColor(EVENT_COLORS[event.type])}`,
                    flex: "none",
                    mt: 0.5,
                  }}
                />
                <Box
                  className="timeline-line"
                  sx={{
                    width: 2,
                    flex: 1,
                    minHeight: 28,
                    bgcolor: "divider",
                    visibility:
                      index === session.events.length - 1
                        ? "hidden"
                        : "visible",
                  }}
                />
              </Box>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  pb: 2.5,
                  flexWrap: "wrap",
                  flexGrow: 1,
                  minWidth: 0,
                }}
              >
                <Chip
                  label={event.type}
                  size="small"
                  sx={{
                    height: 24,
                    fontSize: 11.5,
                    fontWeight: 600,
                    letterSpacing: 0.3,
                    bgcolor: chipPalette[EVENT_COLORS[event.type]].soft,
                    color: chipPalette[EVENT_COLORS[event.type]].solid,
                    border: 1,
                    borderColor: chipPalette[EVENT_COLORS[event.type]].border,
                    "& .MuiChip-label": { px: 1 },
                  }}
                />
                <Typography
                  component="time"
                  sx={{
                    fontSize: 12.5,
                    color: "text.secondary",
                    whiteSpace: "nowrap",
                  }}
                >
                  {formatClockTime(new Date(event.timestamp.replace(" ", "T")))}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      )}
    </Box>
  );
}

export default SessionTimelineContent;
