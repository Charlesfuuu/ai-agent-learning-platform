package com.ailearn.dto;

import lombok.Data;

@Data
public class ChatRequest {
    private String sessionId = "default";
    private String message;
}
