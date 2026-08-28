import { useState } from "react";
import {
  Box,
  IconButton,
  TableCell,
  TableRow,
  Typography,
  Collapse,
} from "@mui/material";
import {
  Schedule as ScheduleIcon,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import type { ReadingSession } from "../../types";
import { formatDuration } from "../../data/mockData";
import { bodyCell } from "../tableStyles";
import SessionTimelineContent from "./SessionTimelineContent";

interface SessionTableRowProps {
  session: ReadingSession;
}

function SessionTableRow({ session }: SessionTableRowProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <TableRow
        hover
        sx={{
          "&:last-of-type td": { borderBottom: "none" },
          ...(expanded && {
            "& td": { borderBottom: "none" },
            bgcolor: "action.hover",
          }),
        }}
      >
        <TableCell sx={bodyCell}>
          <Typography
            sx={{
              fontSize: 12.5,
              color: "text.secondary",
              display: "block",
              whiteSpace: "nowrap",
            }}
          >
            {session.id}
          </Typography>
        </TableCell>
        <TableCell sx={bodyCell}>
          <Typography
            sx={{
              fontSize: 12.5,
              color: "text.secondary",
              whiteSpace: "nowrap",
            }}
          >
            {session.startTime}
          </Typography>
        </TableCell>
        <TableCell sx={bodyCell}>
          <Typography
            sx={{
              fontSize: 12.5,
              color: "text.secondary",
              whiteSpace: "nowrap",
            }}
          >
            {session.endTime}
          </Typography>
        </TableCell>
        <TableCell sx={bodyCell}>
          <Box sx={{ display: "inline-flex", alignItems: "center", gap: 0.75 }}>
            <ScheduleIcon
              sx={{ width: 14, height: 14, color: "text.disabled" }}
            />
            <Typography
              sx={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {formatDuration(session.totalReadingTimeMs)}
            </Typography>
          </Box>
        </TableCell>
        <TableCell sx={{ ...bodyCell, textAlign: "center" }}>
          <IconButton
            aria-label={expanded ? "Hide timeline" : "View timeline"}
            size="small"
            onClick={() => setExpanded((v) => !v)}
            sx={{
              color: expanded ? "primary.main" : "text.secondary",
              "&:hover": { bgcolor: "action.hover" },
            }}
          >
            {expanded ? (
              <VisibilityOff sx={{ width: 18, height: 18 }} />
            ) : (
              <Visibility sx={{ width: 18, height: 18 }} />
            )}
          </IconButton>
        </TableCell>
      </TableRow>

      <TableRow sx={{ "&:last-of-type td": { borderBottom: "none" } }}>
        <TableCell
          colSpan={5}
          sx={{
            p: 0,
            borderBottom: expanded ? 1 : 0,
            borderBottomColor: "divider",
          }}
        >
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Box sx={{ px: 2.5, py: 2, bgcolor: "action.hover" }}>
              <SessionTimelineContent session={session} />
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default SessionTableRow;
