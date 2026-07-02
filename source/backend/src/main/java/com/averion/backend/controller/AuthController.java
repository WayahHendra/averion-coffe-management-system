package com.averion.backend.controller;

import com.averion.backend.model.User;
import com.averion.backend.service.AuthService;
import com.averion.backend.service.RoleCatalog;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final RoleCatalog roleCatalog;

    public AuthController(AuthService authService, RoleCatalog roleCatalog) {
        this.authService = authService;
        this.roleCatalog = roleCatalog;
    }

    public record LoginRequest(String identifier, String password) {
    }

    /**
     * Respons mengikuti kontrak mockService.login di frontend:
     * { success, data, permissions, message }.
     */
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody LoginRequest request) {
        Map<String, Object> response = new LinkedHashMap<>();
        Optional<User> user = authService.login(request.identifier(), request.password());
        if (user.isPresent()) {
            response.put("success", true);
            response.put("data", user.get());
            response.put("permissions", roleCatalog.permissionsOf(user.get().getRoleId()));
        } else {
            response.put("success", false);
            response.put("data", null);
            response.put("permissions", List.of());
            response.put("message", "Invalid credentials");
        }
        return response;
    }
}
