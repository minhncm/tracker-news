import {
  Box,
  Link,
  Paper,
  Typography,
} from '@mui/material'
import {
  ArrowOutward as OpenInNewIcon,
  Link as LinkIcon,
} from '@mui/icons-material'
import type { Article } from '../../types'
import { mono } from '../../theme'
import { SkeletonText } from '../Skeletons'
import InfoRow from './InfoRow'
import ExpandableContent from './ExpandableContent'

interface ArticleInfoCardProps {
  id: number
  loading: boolean
  article?: Article
}

function ArticleInfoCard({ id, loading, article }: ArticleInfoCardProps) {
  return (
    <Paper variant="outlined" sx={{ overflow: 'hidden', boxShadow: 1 }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: 2,
          p: 2.5,
          bgcolor: 'action.hover',
          borderBottom: 1,
          borderColor: 'divider',
          flexWrap: 'wrap',
        }}
      >
        <Box>
          <Typography sx={{ fontSize: 16.5, fontWeight: 650, color: 'text.primary', letterSpacing: -0.2 }}>
            Article Information
          </Typography>
          <Typography sx={{ fontSize: 13.5, color: 'text.secondary', mt: 0.25 }}>
            The reading sessions below belong to this article.
          </Typography>
        </Box>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            height: 26,
            px: 1.25,
            borderRadius: 999,
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            fontSize: 12,
            fontWeight: 600,
            whiteSpace: 'nowrap',
          }}
        >
          Article #{id}
        </Box>
      </Box>

      {loading ? (
        <Box sx={{ p: 3 }}>
          <SkeletonText lines={4} />
        </Box>
      ) : article ? (
        <Box component="dl" sx={{ m: 0, p: 1, px: 3, pb: 1 }}>
          <InfoRow label="ID">
            <Typography
              component="code"
              sx={{
                ...mono,
                fontSize: 13.5,
                color: 'text.primary',
                bgcolor: 'action.hover',
                border: 1,
                borderColor: 'divider',
                borderRadius: 0.75,
                px: 1,
                py: 0.25,
              }}
            >
              #{article.id}
            </Typography>
          </InfoRow>
          <InfoRow label="URL">
            <Link
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              underline="hover"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.75,
                maxWidth: '100%',
                color: 'primary.main',
                fontSize: 13.5,
                fontWeight: 500,
              }}
            >
              <OpenInNewIcon sx={{ width: 13, height: 13, flex: 'none' }} />
              <Typography
                component="span"
                sx={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
              >
                {article.url}
              </Typography>
            </Link>
          </InfoRow>
          <InfoRow label="Domain">
            <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75 }}>
              <LinkIcon sx={{ width: 13, height: 13, color: 'text.disabled' }} />
              <Typography sx={{ fontSize: 13.5 }}>{article.domain}</Typography>
            </Box>
          </InfoRow>
          <InfoRow label="Title">
            <Typography sx={{ fontSize: 15, fontWeight: 650, color: 'text.primary', lineHeight: 1.45 }}>
              {article.title}
            </Typography>
          </InfoRow>
          <InfoRow label="Content">
            <ExpandableContent content={article.content} />
          </InfoRow>
        </Box>
      ) : (
        <Box sx={{ p: 3, color: 'text.secondary', fontSize: 14 }}>
          This article could not be found.
        </Box>
      )}
    </Paper>
  )
}

export default ArticleInfoCard