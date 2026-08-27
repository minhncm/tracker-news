import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'

export interface BreadcrumbItem {
  label: string
  to?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
}

function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <Breadcrumbs
      aria-label="Breadcrumb"
      separator="/"
      sx={{
        color: 'text.secondary',
        '& .MuiBreadcrumbs-separator': {
          color: 'text.disabled',
          mx: 0.25,
        },
      }}
    >
      {items.map((item) =>
        item.to ? (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.to}
            sx={{
              fontSize: 13,
              fontWeight: 500,
              color: 'text.secondary',
              textDecoration: 'none',
              '&:hover': { color: 'primary.main' },
            }}
          >
            {item.label}
          </Link>
        ) : (
          <Typography
            key={item.label}
            sx={{ fontSize: 13, fontWeight: 600, color: 'text.primary' }}
          >
            {item.label}
          </Typography>
        ),
      )}
    </Breadcrumbs>
  )
}

export default Breadcrumb