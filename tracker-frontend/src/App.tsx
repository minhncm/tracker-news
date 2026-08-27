import { useState } from 'react'
import { Box, IconButton } from '@mui/material'
import { Menu as MenuIcon } from '@mui/icons-material'
import { Navigate, Route, Routes, useParams } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import ArticlesPage from './pages/ArticlesPage'
import SessionsPage from './pages/SessionsPage'

function SessionsRoute() {
  const { articleId } = useParams<{ articleId: string }>()
  // Remount on article change so session pagination resets independently.
  return <SessionsPage key={articleId} />
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      <Sidebar open={sidebarOpen} onNavigate={() => setSidebarOpen(false)} />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          px: { xs: 2, md: 3, lg: 5 },
          py: { xs: '72px', md: 4, lg: 5 },
        }}
      >
        <IconButton
          aria-label="Toggle navigation"
          onClick={() => setSidebarOpen((open) => !open)}
          sx={{
            position: 'fixed',
            top: 14,
            left: 14,
            zIndex: 1200,
            width: 36,
            height: 36,
            bgcolor: 'background.paper',
            border: 1,
            borderColor: 'divider',
            boxShadow: 1,
            color: 'text.secondary',
            display: { md: 'none' },
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'text.primary',
            },
          }}
        >
          <MenuIcon sx={{ width: 20, height: 20 }} />
        </IconButton>

        <Box
          sx={{
            width: '100%',
            maxWidth: 1180,
            margin: '0 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
          }}
        >
          <Routes>
            <Route path="/articles" element={<ArticlesPage />} />
            <Route path="/articles/:articleId/sessions" element={<SessionsRoute />} />
            <Route path="*" element={<Navigate to="/articles" replace />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  )
}

export default App