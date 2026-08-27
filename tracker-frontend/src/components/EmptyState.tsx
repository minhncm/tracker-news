import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

interface EmptyStateProps {
  icon: ReactNode
  title: string
  subtitle: string
}

export function EmptyState({ icon, title, subtitle }: EmptyStateProps) {
  return (
    <Box sx={{ py: 7, textAlign: 'center', color: 'text.secondary' }}>
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 44,
          height: 44,
          borderRadius: 1.5,
          bgcolor: 'action.hover',
          color: 'text.disabled',
          mb: 1.5,
        }}
      >
        {icon}
      </Box>
      <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
        {title}
      </Typography>
      <Typography sx={{ fontSize: 13.5 }}>{subtitle}</Typography>
    </Box>
  )
}