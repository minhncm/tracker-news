import { Box, TableCell, TableRow, Typography } from '@mui/material'
import { Schedule as ScheduleIcon } from '@mui/icons-material'
import type { ReadingSession } from '../../types'
import { formatDuration } from '../../data/mockData'
import { mono } from '../../theme'
import { bodyCell } from '../tableStyles'

interface SessionTableRowProps {
  session: ReadingSession
  onSelect: () => void
}

function SessionTableRow({ session, onSelect }: SessionTableRowProps) {
  return (
    <TableRow
      hover
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter') onSelect()
      }}
      sx={{
        cursor: 'pointer',
        outline: 'none',
        '&:focus-visible': { bgcolor: 'action.hover' },
        '&:last-of-type td': { borderBottom: 'none' },
        '&:hover .session-hint, &:focus-visible .session-hint': {
          opacity: 1,
        },
      }}
    >
      <TableCell sx={bodyCell}>
        <Typography component="code" sx={{ ...mono, fontSize: 12.5, color: 'text.secondary', display: 'block' }}>
          {session.id}
        </Typography>
        <Typography
          sx={{
            fontSize: 12,
            color: 'primary.main',
            fontWeight: 500,
            mt: 0.25,
            opacity: 0,
            transition: 'opacity 0.12s ease',
          }}
          className="session-hint"
        >
          View timeline
        </Typography>
      </TableCell>
      <TableCell sx={bodyCell}>
        <Typography sx={{ ...mono, fontSize: 12.5, color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {session.startTime}
        </Typography>
      </TableCell>
      <TableCell sx={bodyCell}>
        <Typography sx={{ ...mono, fontSize: 12.5, color: 'text.secondary', whiteSpace: 'nowrap' }}>
          {session.endTime}
        </Typography>
      </TableCell>
      <TableCell sx={bodyCell}>
        <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
          <ScheduleIcon sx={{ width: 14, height: 14, color: 'text.disabled' }} />
          <Typography sx={{ ...mono, fontSize: 12.5, fontWeight: 600, color: 'text.primary' }}>
            {formatDuration(session.totalReadingTimeMs)}
          </Typography>
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default SessionTableRow