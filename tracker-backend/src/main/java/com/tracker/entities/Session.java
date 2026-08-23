package com.tracker.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "article_id",
            nullable = false
    )
    private Article article;

    @Column(name = "start_time")
    private Instant startTime;

    @Column(name = "end_time")
    private Instant endTime;

    @Column(name = "total_reading_time")
    private Long totalReadingTime = 0L;


    @OneToMany(
            mappedBy = "session",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    private List<Event> events = new ArrayList<>();
}
