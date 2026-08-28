package com.tracker.services.event;

import com.tracker.dtos.request.EventRequest;

public interface EventService {
    void createEvent(EventRequest eventRequest);
}
