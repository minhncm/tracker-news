import { useState } from 'react'
import { ButtonBase, Typography } from '@mui/material'

interface ExpandableContentProps {
  content: string
}

function ExpandableContent({ content }: ExpandableContentProps) {
  const [expanded, setExpanded] = useState(false)

  return (
    <>
      <Typography
        sx={{
          fontSize: 13.5,
          lineHeight: 1.6,
          color: 'text.secondary',
          maxWidth: 720,
          overflowWrap: 'break-word',
          ...(expanded
            ? {}
            : {
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }),
        }}
      >
        {content}
      </Typography>
      <ButtonBase
        component="button"
        type="button"
        onClick={() => setExpanded((value) => !value)}
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: 'primary.main',
          mt: 1,
          p: 0,
          borderRadius: 0.5,
          '&:hover': { color: 'primary.dark' },
        }}
      >
        {expanded ? 'Show less' : 'View more'}
      </ButtonBase>
    </>
  )
}

export default ExpandableContent