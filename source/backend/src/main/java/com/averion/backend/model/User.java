package com.averion.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String displayName;

    @Column(unique = true, nullable = false)
    private String username;

    @Column(unique = true, nullable = false)
    private String email;

    /** Hash BCrypt — tidak pernah ikut terkirim sebagai JSON. */
    @JsonIgnore
    @Column(nullable = false)
    private String passwordHash;

    /**
     * 1 SuperAdmin, 2 TenantOwner, 3 BranchManager, 4 Cashier, 5 Kitchen.
     */
    @Column(nullable = false)
    private Integer roleId;

    @Column(nullable = false)
    private String status = "active";

    /** Nama role (diisi service dari RoleCatalog, ikut dikirim sebagai "role"). */
    @Transient
    private String role;

    public User() {
    }

    public User(String displayName, String username, String email, String passwordHash, Integer roleId) {
        this.displayName = displayName;
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.roleId = roleId;
    }

    public boolean isActive() {
        return "active".equalsIgnoreCase(status);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Integer getRoleId() {
        return roleId;
    }

    public void setRoleId(Integer roleId) {
        this.roleId = roleId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
