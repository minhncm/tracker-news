package com.tracker.controllers;

import com.tracker.dtos.request.SessionRequest;
import com.tracker.dtos.response.SessionResponse;
import com.tracker.services.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final SessionService sessionService;
    @PostMapping()
    public ResponseEntity<SessionResponse> createSession(@RequestBody SessionRequest request) {
        SessionResponse sessionResponse = new SessionResponse();

        String sessionId = sessionService.createSession(request);
        sessionResponse.setSessionId(sessionId);
        return ResponseEntity.ok(sessionResponse);
    }
}
