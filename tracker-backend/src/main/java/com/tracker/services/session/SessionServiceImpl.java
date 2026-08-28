package com.tracker.services.session;

import com.tracker.dtos.request.SessionRequest;
import com.tracker.dtos.response.ListResponse;
import com.tracker.dtos.response.SessionResponse;
import com.tracker.entities.Article;
import com.tracker.entities.Event;
import com.tracker.entities.Session;
import com.tracker.repositories.ArticleRepository;
import com.tracker.repositories.EventRepository;
import com.tracker.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {
    private final SessionRepository sessionRepository;
    private final ArticleRepository articleRepository;
    private final EventRepository eventRepository;

    @Override
    public String createSession(SessionRequest request) {
        if (request == null) return null;

        String sessionId = UUID.randomUUID().toString();

        Article article = articleRepository
                .findByUrl(request.getArticle().getUrl())
                .orElseGet(() -> {
                    Article newarticle = new Article();
                    newarticle.setUrl(request.getArticle().getUrl());
                    newarticle.setDomain(request.getArticle().getDomain());
                    newarticle.setTitle(request.getArticle().getTitle());
                    newarticle.setContent(request.getArticle().getContent());

                    return articleRepository.save(newarticle);
                });

        Session session = new Session();
        session.setSessionId(sessionId);
        session.setArticle(article);
        sessionRepository.save(session);

        return sessionId;
    }

    @Override
    public ListResponse<SessionResponse> findAll(Long articleId, int page, int size) {
        articleRepository.findById(articleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Article not found: " + articleId));

        Page<Session> sessions = sessionRepository.findAllByArticleIdAndEndTimeIsNotNull(articleId, PageRequest.of(page - 1, size));

        List<String> sessionIds = sessions.getContent()
                .stream()
                .map(Session::getSessionId)
                .toList();

        List<Event> events = eventRepository.findAllBySessionIds(sessionIds);

        List<SessionResponse> sessionResponses = new ArrayList<>();
        for(Session session : sessions.getContent()) {
            SessionResponse sessionResponse = new SessionResponse();
            sessionResponse.setSessionId(session.getSessionId());
            sessionResponse.setStartTime(session.getStartTime());
            sessionResponse.setEndTime(session.getEndTime());
            sessionResponse.setTotalReadingTime(session.getTotalReadingTime());

            List<SessionResponse.EventResponse> eventResponses = events.stream()
                    .filter(event -> event.getSession().getSessionId().equals(session.getSessionId()))
                    .map(event -> {
                        SessionResponse.EventResponse eventResponse =
                                new SessionResponse.EventResponse();

                        eventResponse.setId(event.getId());
                        eventResponse.setEventType(event.getEventType());
                        eventResponse.setTimestamp(event.getTimestamp());

                        return eventResponse;
                    }).toList();

            sessionResponse.setEvents(eventResponses);
            sessionResponses.add(sessionResponse);
        }

        return ListResponse.of(sessionResponses,sessions);
    }
}
