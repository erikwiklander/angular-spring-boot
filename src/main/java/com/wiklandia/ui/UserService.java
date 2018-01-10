package com.wiklandia.ui;

import java.util.Map;

import org.springframework.http.MediaType;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.google.common.collect.ImmutableMap;

@RestController
public class UserService {

    @GetMapping(value = "api/user", produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public Map<String, String> getName(Authentication auth) {
        return ImmutableMap.of("username", auth.getName());
    }

    @RequestMapping("logoutSuccess")
    public void logoutSuccess() {
        // empty
    }

}
