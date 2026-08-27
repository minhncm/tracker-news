import { Box, Button, Typography } from '@mui/material'
import {
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material'
import { getPageWindow } from '../utils/pagination'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
  disabled?: boolean
}

const arrowButtonSx = {
  height: 32,
  minWidth: 0,
  px: 1.25,
  textTransform: 'none' as const,
  color: 'text.secondary',
  borderColor: 'divider',
  '&:hover': {
    bgcolor: 'action.hover',
    borderColor: 'divider',
  },
}

function Pagination({ page, totalPages, onChange, disabled }: PaginationProps) {
  const items = getPageWindow(page, totalPages)

  const go = (next: number) => {
    if (!disabled && next >= 1 && next <= totalPages && next !== page) {
      onChange(next)
    }
  }

  return (
    <Box
      component="nav"
      aria-label="Pagination"
      sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}
    >
      <Button
        variant="outlined"
        size="small"
        disabled={disabled || page <= 1}
        onClick={() => go(page - 1)}
        startIcon={<ChevronLeftIcon sx={{ width: 16, height: 16 }} />}
        sx={arrowButtonSx}
      >
        Previous
      </Button>

      {items.map((item) =>
        item.kind === 'ellipsis' ? (
          <Typography
            key={item.key}
            sx={{ px: 0.5, color: 'text.disabled', userSelect: 'none' }}
          >
            …
          </Typography>
        ) : (
          <Button
            key={item.value}
            variant={item.value === page ? 'contained' : 'text'}
            size="small"
            disabled={disabled}
            onClick={() => go(item.value)}
            aria-current={item.value === page ? 'page' : undefined}
            sx={{
              minWidth: 32,
              height: 32,
              px: 0.75,
              borderRadius: 1,
              fontWeight: item.value === page ? 600 : 500,
              color: item.value === page ? undefined : 'text.secondary',
              '&:hover': {
                bgcolor: item.value === page ? undefined : 'action.hover',
                color: item.value === page ? undefined : 'text.primary',
              },
            }}
          >
            {item.value}
          </Button>
        ),
      )}

      <Button
        variant="outlined"
        size="small"
        disabled={disabled || page >= totalPages}
        onClick={() => go(page + 1)}
        endIcon={<ChevronRightIcon sx={{ width: 16, height: 16 }} />}
        sx={arrowButtonSx}
      >
        Next
      </Button>
    </Box>
  )
}

export default Pagination