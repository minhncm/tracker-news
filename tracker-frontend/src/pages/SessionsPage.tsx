import { useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import type { Article } from '../types'
import { api } from '../data/api'
import { useMockQuery } from '../hooks/useMockQuery'
import Breadcrumb from '../components/Breadcrumb'
import ArticleInfoCard from '../components/sessions/ArticleInfoCard'
import SessionTable from '../components/sessions/SessionTable'

const PAGE_SIZE = 10

function SessionsPage() {
  const { articleId } = useParams<{ articleId: string }>()
  const id = Number(articleId)
  const location = useLocation()

  const stateArticle = (location.state as { article?: Article } | undefined)?.article

  const [page, setPage] = useState(1)

  const article = useMockQuery(id, () =>
    stateArticle ? Promise.resolve(stateArticle) : api.fetchArticle(id),
  )
  const sessions = useMockQuery(`${id}:${page}`, () =>
    api.fetchSessions(id, page, PAGE_SIZE),
  )

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
      <Breadcrumb
        items={[
          { label: 'Articles', to: '/articles' },
          { label: `Article #${id}` },
          { label: 'Sessions' },
        ]}
      />

      <ArticleInfoCard id={id} loading={article.loading} article={article.data} />

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <Box>
          <Typography variant="h2" sx={{ color: 'text.primary' }}>
            Reading Sessions
          </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Reading sessions recorded for this article.
          </Typography>
        </Box>

        <SessionTable
          loading={sessions.loading}
          data={sessions.data}
          onPageChange={setPage}
        />
      </Box>
    </Box>
  )
}

export default SessionsPage