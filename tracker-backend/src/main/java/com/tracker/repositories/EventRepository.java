package com.tracker.repositories;

import com.tracker.entities.Event;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;
import java.util.Optional;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {
    @Query(value = "SELECT * " +
            "FROM events e " +
            "WHERE e.session_id = :sessionId " +
            "AND e.event_type = 'PAGE_ACTIVE' " +
            "ORDER BY e.timestamp DESC " +
            "LIMIT 1", nativeQuery = true)
    Optional<Event> findLastActiveEvent(@Param("sessionId") String sessionId);

    @Query("""
        SELECT e FROM Event e
        WHERE e.session.sessionId IN :sessionIds
        ORDER BY e.timestamp ASC
    """)
    List<Event> findAllBySessionIds(
            @Param("sessionIds") List<String> sessionIds
    );
}
