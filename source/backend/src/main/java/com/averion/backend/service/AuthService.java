package com.averion.backend.service;

import com.averion.backend.model.User;
import com.averion.backend.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final RoleCatalog roleCatalog;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public AuthService(UserRepository userRepository, RoleCatalog roleCatalog) {
        this.userRepository = userRepository;
        this.roleCatalog = roleCatalog;
    }

    /** Login dengan username atau email; password dicek terhadap hash BCrypt. */
    public Optional<User> login(String identifier, String password) {
        return userRepository.findByUsernameOrEmail(identifier, identifier)
                .filter(User::isActive)
                .filter(u -> encoder.matches(password, u.getPasswordHash()))
                .map(this::withRoleName);
    }

    /** Isi field transient "role" dengan nama role dari katalog. */
    public User withRoleName(User user) {
        user.setRole(roleCatalog.roleName(user.getRoleId()));
        return user;
    }

    public String encode(String rawPassword) {
        return encoder.encode(rawPassword);
    }
}
