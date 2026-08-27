import { Box, Skeleton } from '@mui/material'

interface SkeletonRowsProps {
  rows?: number
  columns?: number
}

export function SkeletonRows({ rows = 6, columns = 5 }: SkeletonRowsProps) {
  return (
    <Box
      sx={{
        px: 2,
        py: 1,
        '& > :not(:last-child)': { borderBottom: 1, borderColor: 'divider' },
      }}
      aria-hidden="true"
    >
      {Array.from({ length: rows }, (_, row) => (
        <Box
          key={row}
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
            gap: 3,
            alignItems: 'center',
            py: 2,
          }}
        >
          {Array.from({ length: columns }, (_, col) => (
            <Skeleton
              key={col}
              variant="text"
              width={`${45 + ((row * 7 + col * 13) % 50)}%`}
            />
          ))}
        </Box>
      ))}
    </Box>
  )
}

export function SkeletonText({ lines = 1 }: { lines?: number }) {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
      {Array.from({ length: lines }, (_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width={`${100 - i * 24}%`}
        />
      ))}
    </Box>
  )
}

export function SkeletonTimeline() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5, py: 1 }} aria-hidden="true">
      {Array.from({ length: 6 }, (_, i) => (
        <Box key={i} sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Skeleton variant="circular" width={12} height={12} />
          <Skeleton variant="text" width={`${50 + ((i * 13) % 35)}%`} />
        </Box>
      ))}
    </Box>
  )
}