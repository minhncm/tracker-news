package com.tracker.controllers;

import com.tracker.dtos.request.SessionRequest;
import com.tracker.dtos.response.ListResponse;
import com.tracker.dtos.response.SessionIdResponse;
import com.tracker.dtos.response.SessionResponse;
import com.tracker.services.session.SessionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/sessions")
@RequiredArgsConstructor
public class SessionController {
    private final SessionService sessionService;

    @PostMapping()
    public ResponseEntity<SessionIdResponse> createSession(@RequestBody SessionRequest request) {
        SessionIdResponse sessionIdResponse = new SessionIdResponse();

        String sessionId = sessionService.createSession(request);
        sessionIdResponse.setSessionId(sessionId);

        return ResponseEntity.status(HttpStatus.CREATED).body(sessionIdResponse);
    }

    @GetMapping()
    public ResponseEntity<ListResponse<SessionResponse>> getSessions(
            @RequestParam(name = "articleId") Long articleId,
            @RequestParam(name = "page", defaultValue = "1") int page,
            @RequestParam(name = "size", defaultValue = "10") int size ) {
        return ResponseEntity.ok(sessionService.findAll(articleId , page, size));
    }
}
