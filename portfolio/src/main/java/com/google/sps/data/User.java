package com.google.sps.data;

import com.google.appengine.api.users.UserService;

public class User {
    private String id;
    private String name;
    private String email;
    // This a link to either log this user in or log them out.
    private String link;
    private boolean isUserSignedIn;

    public User(UserService userService) {
        isUserSignedIn = userService.isUserLoggedIn();
        if (isUserSignedIn) {
            id = userService.getCurrentUser().getUserId();
            name = userService.getCurrentUser().getNickname();
            email = userService.getCurrentUser().getEmail();
            link = userService.createLogoutURL("/");
        } else {
            link = userService.createLoginURL("/");
        }
    }
}
