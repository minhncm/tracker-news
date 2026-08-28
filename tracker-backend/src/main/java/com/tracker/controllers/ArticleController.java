package com.tracker.controllers;

import com.tracker.dtos.response.ArticleResponse;
import com.tracker.dtos.response.ListResponse;
import com.tracker.services.article.ArticleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/articles")
@RequiredArgsConstructor
public class ArticleController {
    private final ArticleService articleService;

    @GetMapping()
    public ResponseEntity<ListResponse<ArticleResponse>> getAllArticles(
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size) {
        return ResponseEntity.ok(articleService.findAll(page, size));
    }
}
