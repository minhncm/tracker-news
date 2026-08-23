package com.tracker.services;

import com.tracker.dtos.request.EventRequest;
import com.tracker.entities.Event;
import com.tracker.entities.Session;
import com.tracker.enums.EventType;
import com.tracker.repositories.EventRepository;
import com.tracker.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.Duration;
@Service
@RequiredArgsConstructor
public class EventServiceImpl implements EventService {
    private final EventRepository eventRepository;
    private final SessionRepository sessionRepository;

    @Override
    public void createEvent(EventRequest request) {
        if (request == null) return;

        Session session = sessionRepository
                .findById(request.getSessionId())
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if(request.getEventType() == EventType.PAGE_ENTER) {
            session.setStartTime(request.getTimestamp());
        }

        if(request.getEventType() == EventType.PAGE_LEAVE) {
            session.setEndTime(request.getTimestamp());
        }

        if(request.getEventType() == EventType.PAGE_INACTIVE) {
            long readingTime = getReadingTime(request);
            session.setTotalReadingTime(session.getTotalReadingTime() + readingTime);
        }

        Event event = new Event();
        event.setTimestamp(request.getTimestamp());
        event.setEventType(request.getEventType());
        event.setSession(session);

        sessionRepository.save(session);
        eventRepository.save(event);
    }

    private long getReadingTime(EventRequest eventRequest) {
        Event eventActive = eventRepository
                .findLastActiveEvent(eventRequest.getSessionId())
                .orElseThrow(() -> new RuntimeException("Active event not found"));

        return Duration
                .between(eventActive.getTimestamp(), eventRequest.getTimestamp())
                .toMillis();
    }
}
