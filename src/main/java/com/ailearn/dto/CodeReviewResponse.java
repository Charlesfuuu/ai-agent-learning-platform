package com.ailearn.dto;

import lombok.Data;

@Data
public class CodeReviewResponse {
    private String feedback;

    public CodeReviewResponse(String feedback) {
        this.feedback = feedback;
    }
}
