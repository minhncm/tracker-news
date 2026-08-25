package com.tracker.controllers;

import com.tracker.dtos.request.EventRequest;
import com.tracker.services.EventService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("*")
@RestController
@RequestMapping("/api/events")
@RequiredArgsConstructor
public class EventController {
    private final EventService eventService;

    @PostMapping()
    public ResponseEntity<?> createEvent(@RequestBody EventRequest request){
        eventService.createEvent(request);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
}
