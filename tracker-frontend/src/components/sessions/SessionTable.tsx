import {
  Divider,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material'
import { Schedule as ScheduleIcon } from '@mui/icons-material'
import type { Paginated, ReadingSession } from '../../types'
import { EmptyState } from '../EmptyState'
import { SkeletonRows } from '../Skeletons'
import { headerCell } from '../tableStyles'
import SessionTableRow from './SessionTableRow'
import SessionTableFooter from './SessionTableFooter'

interface SessionTableProps {
  loading: boolean
  data?: Paginated<ReadingSession>
  onPageChange: (page: number) => void
  onSelect: (sessionId: string) => void
}

function SessionTable({ loading, data, onPageChange, onSelect }: SessionTableProps) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', boxShadow: 1 }}>
      {loading ? (
        <SkeletonRows rows={6} columns={4} />
      ) : data ? (
        <>
          <TableContainer sx={{ width: '100%' }}>
            <Table size="small" sx={{ minWidth: 820 }}>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ width: 280, ...headerCell }}>Session ID</TableCell>
                  <TableCell sx={{ width: 180, ...headerCell }}>Start Time</TableCell>
                  <TableCell sx={{ width: 180, ...headerCell }}>End Time</TableCell>
                  <TableCell sx={{ ...headerCell }}>Total Reading Time</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.items.map((session) => (
                  <SessionTableRow
                    key={session.id}
                    session={session}
                    onSelect={() => onSelect(session.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          {data.total === 0 && (
            <EmptyState
              icon={<ScheduleIcon sx={{ width: 22, height: 22 }} />}
              title="No sessions found"
              subtitle="This article has not been read yet."
            />
          )}

          {data.total > 0 && (
            <>
              <Divider />
              <SessionTableFooter data={data} onPageChange={onPageChange} />
            </>
          )}
        </>
      ) : null}
    </Paper>
  )
}

export default SessionTable