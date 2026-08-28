package com.tracker.services.session;

import com.tracker.dtos.request.SessionRequest;
import com.tracker.dtos.response.ListResponse;
import com.tracker.dtos.response.SessionResponse;

public interface SessionService {
    String createSession(SessionRequest request);
    ListResponse<SessionResponse> findAll(Long articleId, int page, int size);
}
