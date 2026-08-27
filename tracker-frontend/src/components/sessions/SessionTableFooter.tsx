import { Box, Typography } from '@mui/material'
import type { Paginated } from '../../types'
import { formatRange } from '../../utils/pagination'
import Pagination from '../Pagination'

interface SessionTableFooterProps {
  data: Paginated<unknown>
  onPageChange: (page: number) => void
}

function SessionTableFooter({ data, onPageChange }: SessionTableFooterProps) {
  return (
    <Box>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 1,
          px: 2,
          pt: 1.5,
        }}
      >
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          Showing{' '}
          <Box component="strong" sx={{ color: 'text.primary' }}>
            {formatRange(data.page, data.pageSize, data.total)}
          </Box>{' '}
          of{' '}
          <Box component="strong" sx={{ color: 'text.primary' }}>
            {data.total}
          </Box>{' '}
          sessions
        </Typography>
        <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
          Page {data.page} of {data.totalPages}
        </Typography>
      </Box>
      <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center' }}>
        <Pagination page={data.page} totalPages={data.totalPages} onChange={onPageChange} />
      </Box>
    </Box>
  )
}

export default SessionTableFooter