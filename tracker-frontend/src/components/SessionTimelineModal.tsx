import { useEffect, useState } from 'react'
import {
  Box,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Skeleton,
  Typography,
} from '@mui/material'
import {
  Close as CloseIcon,
  Schedule as ScheduleIcon,
} from '@mui/icons-material'
import type { EventType, ReadingSession } from '../types'
import { mockApi, formatClockTime } from '../data/mockData'
import { mono } from '../theme'
import { SkeletonTimeline } from './Skeletons'

type TimelineColor =
  | 'success'
  | 'info'
  | 'warning'
  | 'error'
  | 'neutral'

const EVENT_COLORS: Record<EventType, TimelineColor> = {
  PAGE_ENTER: 'success',
  PAGE_ACTIVE: 'info',
  PAGE_INACTIVE: 'warning',
  PAGE_LEAVE: 'error',
}

interface SessionTimelineModalProps {
  articleId: number
  sessionId: string
  onClose: () => void
}

function SessionTimelineModal({
  articleId,
  sessionId,
  onClose,
}: SessionTimelineModalProps) {
  const [state, setState] = useState<
    | { loading: true }
    | { loading: false; session: ReadingSession }
  >({ loading: true })

  useEffect(() => {
    let active = true
    mockApi.fetchSession(articleId, sessionId).then((session) => {
      if (active && session) setState({ loading: false, session })
    })
    return () => {
      active = false
    }
  }, [articleId, sessionId])

  return (
    <Dialog
      open
      onClose={onClose}
      aria-labelledby="session-timeline-title"
      sx={{
        '& .MuiDialog-paper': {
          width: '100%',
          maxWidth: 580,
          maxHeight: '86vh',
          borderRadius: 2,
          m: { xs: 1.5, sm: 3 },
        },
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(17, 24, 39, 0.5)',
        },
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, px: 2.5 }}>
        <Typography sx={{ fontSize: 16, fontWeight: 650, color: 'text.primary' }}>
          Session Timeline
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="Close"
          sx={{
            px: 1.25,
            py: 0.5,
            borderRadius: 1,
            border: 1,
            borderColor: 'divider',
            gap: 0.5,
            fontSize: 13,
            color: 'text.secondary',
            '&:hover': {
              bgcolor: 'action.hover',
              color: 'text.primary',
            },
          }}
        >
          <CloseIcon sx={{ width: 16, height: 16 }} />
          Close
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 2.5, overflowY: 'auto' }}>
        {state.loading ? (
          <>
            <Skeleton variant="rounded" height={64} sx={{ mb: 2.5 }} width="80%" />
            <SkeletonTimeline />
          </>
        ) : (
          <>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: 0.5,
                p: 1.75,
                mb: 2.5,
                bgcolor: 'action.hover',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
              }}
            >
              <Typography
                sx={{
                  fontSize: 11,
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  letterSpacing: 0.6,
                  color: 'text.disabled',
                }}
              >
                Session ID
              </Typography>
              <Typography
                component="code"
                sx={{ ...mono, fontSize: 13, color: 'text.primary', wordBreak: 'break-all' }}
              >
                {state.session.id}
              </Typography>
              <Box sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.75, mt: 0.25 }}>
                <ScheduleIcon sx={{ width: 14, height: 14, color: 'text.disabled' }} />
                <Typography sx={{ fontSize: 12.5, color: 'text.disabled' }}>
                  {state.session.startTime} → {state.session.endTime}
                </Typography>
              </Box>
            </Box>

            {state.session.events.length === 0 ? (
              <Box sx={{ py: 5, textAlign: 'center', color: 'text.secondary' }}>
                <Typography sx={{ fontSize: 15, fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
                  No events found
                </Typography>
                <Typography sx={{ fontSize: 13.5 }}>
                  No tracking events were recorded for this session.
                </Typography>
              </Box>
            ) : (
              <Box component="ol" sx={{ listStyle: 'none', margin: 0, padding: 0 }}>
                {state.session.events.map((event, index) => (
                  <Box
                    component="li"
                    key={event.id}
                    sx={{
                      display: 'flex',
                      gap: 2,
                      '&:last-of-type .timeline-line': { display: 'none' },
                    }}
                  >
                    <Box
                      sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 'none' }}
                    >
                      <Box
                        className="timeline-dot"
                        sx={{
                          width: 12,
                          height: 12,
                          borderRadius: '50%',
                          bgcolor: dotColor(EVENT_COLORS[event.type]),
                          boxShadow: `0 0 0 1px ${dotColor(EVENT_COLORS[event.type])}`,
                          flex: 'none',
                          mt: 0.5,
                        }}
                      />
                      <Box
                        className="timeline-line"
                        sx={{
                          width: 2,
                          flex: 1,
                          minHeight: 28,
                          bgcolor: 'divider',
                          visibility: index === state.session.events.length - 1 ? 'hidden' : 'visible',
                        }}
                      />
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5,
                        pb: 2.5,
                        flexWrap: 'wrap',
                        flexGrow: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          minWidth: 24,
                          height: 24,
                          px: 0.5,
                          borderRadius: '50%',
                          bgcolor: 'action.selected',
                          border: 1,
                          borderColor: 'divider',
                          color: 'text.secondary',
                          ...mono,
                          fontSize: 11.5,
                          fontWeight: 600,
                          flex: 'none',
                        }}
                      >
                        {event.id}
                      </Box>
                      <Chip
                        label={event.type}
                        size="small"
                        sx={{
                          height: 24,
                          ...mono,
                          fontSize: 11.5,
                          fontWeight: 600,
                          letterSpacing: 0.3,
                          bgcolor: chipPalette[EVENT_COLORS[event.type]].soft,
                          color: chipPalette[EVENT_COLORS[event.type]].solid,
                          border: 1,
                          borderColor: chipPalette[EVENT_COLORS[event.type]].border,
                          '& .MuiChip-label': { px: 1 },
                        }}
                      />
                      <Typography
                        component="time"
                        sx={{
                          ...mono,
                          fontSize: 12.5,
                          color: 'text.secondary',
                          ml: 'auto',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {formatClockTime(new Date(event.timestamp.replace(' ', 'T')))}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

function dotColor(color: TimelineColor): string {
  switch (color) {
    case 'success':
      return '#16a34a'
    case 'info':
      return '#2563eb'
    case 'warning':
      return '#b45309'
    case 'error':
      return '#dc2626'
    default:
      return '#6b7280'
  }
}

const chipPalette: Record<TimelineColor, { solid: string; soft: string; border: string }> = {
  success: { solid: '#16a34a', soft: '#e8f7ee', border: '#bbe9cd' },
  info: { solid: '#2563eb', soft: '#eaf0fe', border: '#c4d5f8' },
  warning: { solid: '#b45309', soft: '#fdf3e3', border: '#f3ddb3' },
  error: { solid: '#dc2626', soft: '#fdeeee', border: '#f7c5c5' },
  neutral: { solid: '#6b7280', soft: '#f3f4f6', border: '#d1d5db' },
}

export default SessionTimelineModal