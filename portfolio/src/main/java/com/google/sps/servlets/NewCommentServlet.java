package com.google.sps.servlets;

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.users.UserService;
import com.google.appengine.api.users.UserServiceFactory;

import java.io.IOException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet responsible for creating new comments. */
@WebServlet("/new-comment")
public class NewCommentServlet extends HttpServlet {

    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        UserService userService = UserServiceFactory.getUserService();
        String name = request.getParameter("name");
        String project = request.getParameter("project");
        String comment = request.getParameter("comment");
        long timestamp = System.currentTimeMillis();

        Entity taskEntity = new Entity("Comment");
        taskEntity.setProperty("timestamp", timestamp);
        taskEntity.setProperty("posterName", name);
        taskEntity.setProperty("posterEmail", userService.getCurrentUser().getEmail());
        taskEntity.setProperty("posterID", userService.getCurrentUser().getUserId());
        taskEntity.setProperty("project", project);
        taskEntity.setProperty("comment", comment);

        DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
        datastore.put(taskEntity);

        response.sendRedirect("/comments.html");
    }
}
