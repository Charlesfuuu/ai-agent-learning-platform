package com.ailearn.dto;

import lombok.Data;

@Data
public class CodeReviewRequest {
    private String code;
    private String language = "java";
}
