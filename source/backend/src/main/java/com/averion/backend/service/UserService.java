package com.averion.backend.service;

import com.averion.backend.model.User;
import com.averion.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final AuthService authService;

    public UserService(UserRepository userRepository, AuthService authService) {
        this.userRepository = userRepository;
        this.authService = authService;
    }

    public List<User> findAll() {
        return userRepository.findAll().stream().map(authService::withRoleName).toList();
    }

    public User create(String displayName, String username, String email, String password, Integer roleId) {
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username sudah dipakai.");
        }
        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("Email sudah terdaftar.");
        }
        User user = new User(displayName, username, email, authService.encode(password), roleId);
        return authService.withRoleName(userRepository.save(user));
    }

    public User update(Integer id, String displayName, String username, String email, String password, Integer roleId,
            String status) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User tidak ditemukan."));
        user.setDisplayName(displayName);
        user.setUsername(username);
        user.setEmail(email);
        if (password != null && !password.isBlank()) {
            user.setPasswordHash(authService.encode(password));
        }
        if (roleId != null) {
            user.setRoleId(roleId);
        }
        if (status != null && !status.isBlank()) {
            user.setStatus(status);
        }
        return authService.withRoleName(userRepository.save(user));
    }

    public void delete(Integer id) {
        userRepository.deleteById(id);
    }
}
