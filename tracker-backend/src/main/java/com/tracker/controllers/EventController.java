package com.tracker.controllers;

import com.tracker.dtos.request.EventRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/events")
public class EventController {

    @PostMapping()
    public ResponseEntity<?> createEvent(@RequestBody EventRequest request){
        return null;
    }
}
