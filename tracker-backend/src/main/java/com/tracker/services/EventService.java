package com.tracker.services;

import com.tracker.dtos.request.EventRequest;

public interface EventService {
    void createEvent(EventRequest eventRequest);
}
