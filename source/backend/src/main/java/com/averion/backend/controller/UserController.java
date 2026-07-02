package com.averion.backend.controller;

import com.averion.backend.model.User;
import com.averion.backend.service.RoleCatalog;
import com.averion.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.Collection;
import java.util.List;
import java.util.Map;

/** REST API manajemen user & role. */
@RestController
@RequestMapping("/api")
public class UserController {

    private final UserService userService;
    private final RoleCatalog roleCatalog;

    public UserController(UserService userService, RoleCatalog roleCatalog) {
        this.userService = userService;
        this.roleCatalog = roleCatalog;
    }

    @GetMapping("/users")
    public List<User> users() {
        return userService.findAll();
    }

    public record UserRequest(
            String displayName,
            String username,
            String email,
            String password,
            Integer roleId,
            String status) {
    }

    @PostMapping("/users")
    public User createUser(@RequestBody UserRequest request) {
        return userService.create(
                request.displayName(),
                request.username(),
                request.email(),
                request.password() == null || request.password().isBlank() ? "password123" : request.password(),
                request.roleId() == null ? 4 : request.roleId());
    }

    @PutMapping("/users/{id}")
    public User updateUser(@PathVariable Integer id, @RequestBody UserRequest request) {
        return userService.update(
                id,
                request.displayName(),
                request.username(),
                request.email(),
                request.password(),
                request.roleId(),
                request.status());
    }

    @DeleteMapping("/users/{id}")
    public Map<String, Object> deleteUser(@PathVariable Integer id) {
        userService.delete(id);
        return Map.of("success", true);
    }

    @GetMapping("/roles")
    public Collection<Map<String, Object>> roles() {
        return roleCatalog.allRoles();
    }
}
