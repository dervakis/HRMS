package com.intern.hrms.commonResponse;


import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class PaginatedResponse<T> {
    private List<T> items;
    private int page;
    private int pageSize;
    private long totalItems;
    private int totalPages;

    public PaginatedResponse(List<T> items, int page, int pageSize, long totalItems) {
        this.items = items;
        this.page = page;
        this.pageSize = pageSize;
        this.totalItems = totalItems;
        this.totalPages = (int) Math.ceil(totalItems / (double) pageSize);
    }
}

