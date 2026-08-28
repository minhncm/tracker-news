package com.tracker.dtos.response;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class  ListResponse<T> {
    private List<T> data;
    private int page;
    private int size;
    private long totalElements;
    private int totalPages;
    boolean isLast;

    public <E> ListResponse(List<T> data, Page<E> page) {
        this.data = data;
        this.page = page.getNumber() + 1;
        this.size = page.getSize();
        this.totalElements = page.getTotalElements();
        this.totalPages = page.getTotalPages();
        this.isLast = page.isLast();
    }

    public static <T, E> ListResponse<T> of(List<T> data, Page<E> page) {
        return new ListResponse<T>(data, page);
    }
}
