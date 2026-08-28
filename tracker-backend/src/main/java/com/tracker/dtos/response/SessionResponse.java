package com.tracker.dtos.response;

import com.tracker.enums.EventType;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class SessionResponse {
    private String sessionId;
    private Instant startTime;
    private Instant endTime;
    private Long totalReadingTime;
    private List<EventResponse> events;

    @Data
    public static class EventResponse{
        private Long id;
        private EventType eventType;
        private Instant timestamp;
    }
}

