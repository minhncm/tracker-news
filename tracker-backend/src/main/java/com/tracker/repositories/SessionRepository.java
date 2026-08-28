package com.tracker.repositories;

import com.tracker.dtos.response.SessionResponse;
import com.tracker.entities.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SessionRepository extends JpaRepository<Session, String> {
    Page<Session> findAllByArticleIdAndEndTimeIsNotNull(Long articleId, Pageable pageable);
}
