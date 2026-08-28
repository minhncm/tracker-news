package com.tracker.dtos.response;

import lombok.Data;

@Data
public class ArticleResponse {
    private Long id;
    private String url;
    private String domain;
    private String title;
    private String content;
}
