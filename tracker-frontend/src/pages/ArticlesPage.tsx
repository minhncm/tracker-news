import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Divider,
  Link,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import {
  Article as ArticleIcon,
  ArrowOutward as OpenInNewIcon,
  Link as LinkIcon,
} from '@mui/icons-material'
import { api } from '../data/api'
import { useMockQuery } from '../hooks/useMockQuery'
import Breadcrumb from '../components/Breadcrumb'
import Pagination from '../components/Pagination'
import { EmptyState } from '../components/EmptyState'
import { headerCell, bodyCell } from '../components/tableStyles'
import { SkeletonRows } from '../components/Skeletons'
import { formatRange } from '../utils/pagination'
import { mono } from '../theme'

const PAGE_SIZE = 10

const clamp = (lines: number) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  overflowWrap: 'break-word' as const,
})

function ArticlesPage() {
  const navigate = useNavigate()
  const [page, setPage] = useState(1)
  const { data, loading } = useMockQuery(page, () =>
    api.fetchArticles(page, PAGE_SIZE),
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumb items={[{ label: 'Articles' }]} />

      <Box>
        <Typography variant="h1" sx={{ color: 'text.primary' }}>
          Articles
        </Typography>
        <Typography variant="subtitle2" sx={{ color: 'text.secondary', mt: 0.5 }}>
          Browse tracked articles and their reading sessions.
        </Typography>
      </Box>

      <Paper variant="outlined" sx={{ overflow: 'hidden', boxShadow: 1 }}>
        {loading ? (
          <SkeletonRows rows={8} columns={5} />
        ) : data ? (
          <>
            <TableContainer sx={{ width: '100%' }}>
              <Table size="small" sx={{ minWidth: 960 }}>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: 70, ...headerCell }}>ID</TableCell>
                    <TableCell sx={{ width: 220, ...headerCell }}>URL</TableCell>
                    <TableCell sx={{ width: 150, ...headerCell }}>Domain</TableCell>
                    <TableCell sx={{ width: 260, ...headerCell }}>Title</TableCell>
                    <TableCell sx={{ ...headerCell }}>Content</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.items.map((article) => (
                    <TableRow
                      key={article.id}
                      hover
                      tabIndex={0}
                      onClick={() => navigate(`/articles/${article.id}/sessions`, { state: { article } })}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          navigate(`/articles/${article.id}/sessions`, { state: { article } })
                        }
                      }}
                      sx={{
                        cursor: 'pointer',
                        outline: 'none',
                        '&:focus-visible': { bgcolor: 'action.hover' },
                        '&:last-of-type td': { borderBottom: 'none' },
                      }}
                    >
                      <TableCell sx={bodyCell}>
                        <Typography sx={{ ...mono, fontSize: 12.5, color: 'text.secondary', whiteSpace: 'nowrap' }}>
                          #{article.id}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCell}>
                        <Link
                          href={article.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          underline="hover"
                          onClick={(event) => event.stopPropagation()}
                          title={article.url}
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            maxWidth: 260,
                            color: 'primary.main',
                            fontSize: 13,
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
                      </TableCell>
                      <TableCell sx={bodyCell}>
                        <Box
                          sx={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 0.75,
                            minWidth: 0,
                            maxWidth: 160,
                          }}
                        >
                          <LinkIcon sx={{ width: 13, height: 13, color: 'text.disabled', flex: 'none' }} />
                          <Typography
                            sx={{
                              fontSize: 12.5,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {article.domain}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell sx={bodyCell}>
                        <Typography
                          sx={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: 'text.primary',
                            lineHeight: 1.4,
                            maxWidth: 340,
                            ...clamp(2),
                          }}
                        >
                          {article.title}
                        </Typography>
                      </TableCell>
                      <TableCell sx={bodyCell}>
                        <Typography
                          sx={{ fontSize: 13.5, color: 'text.secondary', lineHeight: 1.5, maxWidth: 420, ...clamp(2) }}
                        >
                          {article.content}
                        </Typography>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {data.total === 0 && <EmptyState
                icon={<ArticleIcon sx={{ width: 22, height: 22 }} />}
                title="No articles found"
                subtitle="No tracked articles are available yet."
              />}

            <Divider />

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
                  articles
                </Typography>
                <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>
                  Page {data.page} of {data.totalPages}
                </Typography>
              </Box>
              <Box sx={{ py: 1.5, display: 'flex', justifyContent: 'center' }}>
                <Pagination page={data.page} totalPages={data.totalPages} onChange={setPage} />
              </Box>
            </Box>
          </>
        ) : null}
      </Paper>
    </Box>
  )
}

export default ArticlesPage