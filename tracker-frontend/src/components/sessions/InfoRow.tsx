import type { ReactNode } from 'react'
import { Box, Typography } from '@mui/material'

interface InfoRowProps {
  label: string
  children: ReactNode
}

function InfoRow({ label, children }: InfoRowProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', sm: '120px minmax(0, 1fr)' },
        gap: { xs: 0.5, sm: 2 },
        py: 1.5,
        '& + &': { borderTop: 1, borderColor: 'divider' },
      }}
    >
      <Typography
        component="dt"
        sx={{
          fontSize: 11.5,
          fontWeight: 600,
          textTransform: 'uppercase',
          letterSpacing: 0.6,
          color: 'text.disabled',
          pt: 0.25,
        }}
      >
        {label}
      </Typography>
      <Box component="dd" sx={{ m: 0, minWidth: 0 }}>
        {children}
      </Box>
    </Box>
  )
}

export default InfoRow