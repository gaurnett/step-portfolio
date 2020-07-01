package com.google.sps.data;

public class Comment {
    private long id;
    private String name;
    private String project;
    private String comment;
    private long timestamp;

    public Comment(long id, String name, String project, String comment, long timestamp) {
        this.id = id;
        this.name = name;
        this.project = project;
        this.comment = comment;
        this.timestamp = timestamp;
    }
}