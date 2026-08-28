package com.tracker.services.article;

import com.tracker.dtos.response.ArticleResponse;
import com.tracker.dtos.response.ListResponse;

public interface ArticleService {
    ListResponse<ArticleResponse> findAll(int page, int size);
}
