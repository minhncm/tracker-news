package com.tracker.dtos.request;

import com.tracker.enums.EventType;
import lombok.Data;

import java.time.Instant;

@Data
public class EventRequest {
    private String sessionId;
    private EventType eventType;
    private Instant timestamp;
}
