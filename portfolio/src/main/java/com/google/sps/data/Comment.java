package com.google.sps.data;

public class Comment {
    private long id;
    private long timestamp;
    private String posterName;
    private String posterEmail;
    private String posterID;
    private String project;
    private String comment;

    public Comment(long id, long timestamp, String posterName, String posterEmail, String posterID, String project, String comment) {
        this.id = id;
        this.posterName = posterName;
        this.posterEmail = posterEmail;
        this.posterID = posterID;
        this.project = project;
        this.comment = comment;
        this.timestamp = timestamp;
    }
}
