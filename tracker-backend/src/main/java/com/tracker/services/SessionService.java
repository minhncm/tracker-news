package com.tracker.services;

import com.tracker.dtos.request.SessionRequest;

public interface SessionService {
    String createSession(SessionRequest request);
}
