package com.averion.backend.service;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import jakarta.annotation.PostConstruct;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.util.*;

/**
 * Katalog role & permission, dimuat dari resources/seed/*.json
 * (data yang sama dengan yang dipakai frontend) agar role_id dan
 * daftar permission konsisten di kedua sisi.
 */
@Component
public class RoleCatalog {

    private final ObjectMapper mapper = new ObjectMapper();

    private final Map<Integer, Map<String, Object>> roles = new LinkedHashMap<>();
    private final Map<Integer, String> permissionNames = new HashMap<>();
    private final Map<Integer, List<String>> rolePermissions = new HashMap<>();

    @PostConstruct
    void load() throws Exception {
        JsonNode rolesJson = mapper.readTree(new ClassPathResource("seed/roles.json").getInputStream());
        for (JsonNode r : rolesJson) {
            Map<String, Object> role = new LinkedHashMap<>();
            role.put("id", r.get("id").asInt());
            role.put("name", r.get("name").asText());
            role.put("description", r.path("description").asText(null));
            roles.put(r.get("id").asInt(), role);
        }

        JsonNode permsJson = mapper.readTree(new ClassPathResource("seed/permissions.json").getInputStream());
        for (JsonNode p : permsJson) {
            permissionNames.put(p.get("id").asInt(), p.get("name").asText());
        }

        JsonNode rpJson = mapper.readTree(new ClassPathResource("seed/role_permissions.json").getInputStream());
        for (JsonNode rp : rpJson) {
            rolePermissions
                    .computeIfAbsent(rp.get("role_id").asInt(), k -> new ArrayList<>())
                    .add(permissionNames.get(rp.get("permission_id").asInt()));
        }
    }

    public String roleName(Integer roleId) {
        Map<String, Object> role = roles.get(roleId);
        return role != null ? (String) role.get("name") : null;
    }

    public List<String> permissionsOf(Integer roleId) {
        return rolePermissions.getOrDefault(roleId, List.of());
    }

    public Collection<Map<String, Object>> allRoles() {
        return roles.values();
    }
}
