package com.tracker.services;

import com.tracker.dtos.request.ArticleRequest;
import com.tracker.dtos.request.SessionRequest;
import com.tracker.entities.Article;
import com.tracker.entities.Session;
import com.tracker.repositories.ArticleRepository;
import com.tracker.repositories.SessionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class SessionServiceImpl implements SessionService {
    private final SessionRepository sessionRepository;
    private final ArticleRepository articleRepository;

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
}
