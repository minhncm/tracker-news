package com.tracker.entities;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "articles")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class Article {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String url;

    @Column(nullable = false, length = 255)
    private String domain;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Lob
    @Column(columnDefinition = "LONGTEXT")
    private String content;

    @OneToMany(
            mappedBy = "article",
            fetch = FetchType.LAZY,
            cascade = CascadeType.ALL
    )
    private List<Session> sessions = new ArrayList<>();
}
