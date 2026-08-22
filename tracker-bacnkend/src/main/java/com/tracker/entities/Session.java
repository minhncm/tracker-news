package com.tracker.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "sessions")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Session {
    @Id
    @Column(name = "session_id", length = 36)
    private String sessionId;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(nullable = false, length = 255)
    private String domain;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @Column(name = "start_time", nullable = false)
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "total_reading_time")
    private Long totalReadingTime = 0L;
}
