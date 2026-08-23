package com.tracker.dtos.request;

import lombok.Data;

@Data
public class ArticleRequest {
    private String url;
    private String domain;
    private String title;
    private String content;
}
