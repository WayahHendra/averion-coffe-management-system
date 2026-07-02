package com.averion.backend.model;

import jakarta.persistence.*;

/** Meja. Dinamai CoffeeTable karena "Table" bentrok dengan kata kunci SQL. */
@Entity
@Table(name = "coffee_tables")
public class CoffeeTable {

    public static final String AVAILABLE = "available";
    public static final String OCCUPIED = "occupied";
    public static final String RESERVED = "reserved";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String tableNumber;

    @Column(nullable = false)
    private String name;

    private Integer capacity;

    /** available / occupied / reserved. */
    @Column(nullable = false)
    private String status = AVAILABLE;

    public CoffeeTable() {
    }

    public CoffeeTable(String tableNumber, String name, Integer capacity) {
        this.tableNumber = tableNumber;
        this.name = name;
        this.capacity = capacity;
    }

    public boolean checkAvailability() {
        return AVAILABLE.equals(status);
    }

    public void updateStatus(String status) {
        this.status = status;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getTableNumber() {
        return tableNumber;
    }

    public void setTableNumber(String tableNumber) {
        this.tableNumber = tableNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }
}
