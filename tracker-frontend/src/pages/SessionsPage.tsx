import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Box, Typography } from '@mui/material'
import { mockApi } from '../data/mockData'
import { useMockQuery } from '../hooks/useMockQuery'
import Breadcrumb from '../components/Breadcrumb'
import SessionTimelineModal from '../components/SessionTimelineModal'
import ArticleInfoCard from '../components/sessions/ArticleInfoCard'
import SessionTable from '../components/sessions/SessionTable'

const PAGE_SIZE = 10

function SessionsPage() {
  const { articleId } = useParams<{ articleId: string }>()
  const id = Number(articleId)

  const [page, setPage] = useState(1)
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null)

  const article = useMockQuery(id, () => mockApi.fetchArticle(id))
  const sessions = useMockQuery(`${id}:${page}`, () =>
    mockApi.fetchSessions(id, page, PAGE_SIZE),
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
          onSelect={setSelectedSessionId}
        />
      </Box>

      {selectedSessionId && (
        <SessionTimelineModal
          articleId={id}
          sessionId={selectedSessionId}
          onClose={() => setSelectedSessionId(null)}
        />
      )}
    </Box>
  )
}

export default SessionsPage