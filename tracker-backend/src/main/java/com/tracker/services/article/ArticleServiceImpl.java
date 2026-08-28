package com.tracker.services.article;

import com.tracker.dtos.response.ArticleResponse;
import com.tracker.dtos.response.ListResponse;
import com.tracker.entities.Article;
import com.tracker.repositories.ArticleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
public class ArticleServiceImpl implements ArticleService {
    private final ArticleRepository articleRepository;

    @Override
    public ListResponse<ArticleResponse> findAll(int page, int size) {
        Page<Article> articles = articleRepository.findAll(PageRequest.of(page - 1, size));

        List<ArticleResponse> articleResponses = new ArrayList<>();
        for (Article article : articles.getContent()) {
            ArticleResponse articleResponse = new ArticleResponse();
            articleResponse.setId(article.getId());
            articleResponse.setUrl(article.getUrl());
            articleResponse.setDomain(article.getDomain());
            articleResponse.setTitle(article.getTitle());
            articleResponse.setContent(article.getContent());

            articleResponses.add(articleResponse);
        }
        return ListResponse.of(articleResponses, articles);
    }
}
