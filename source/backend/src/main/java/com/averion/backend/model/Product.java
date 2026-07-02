package com.averion.backend.model;

import com.averion.backend.util.Json;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.databind.JsonNode;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "products")
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private double price;

    /** Path aset frontend ("./products/xxx.png"), URL, atau data URL. */
    @Column(columnDefinition = "TEXT")
    private String image;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "category_id")
    private Category category;

    /**
     * Opsi ukuran & level gula disimpan sebagai JSON mentah agar sama persis dengan
     * frontend.
     */
    @JsonIgnore
    @Column(columnDefinition = "TEXT")
    private String sizesJson;

    @JsonIgnore
    @Column(columnDefinition = "TEXT")
    private String sugarLevelsJson;

    private Integer soldCount = 0;

    private LocalDateTime createdAt = LocalDateTime.now();

    public Product() {
    }

    @JsonProperty("category_id")
    public Integer getCategoryId() {
        return category != null ? category.getId() : null;
    }

    @JsonProperty("sizes")
    public JsonNode getSizes() {
        return Json.parse(sizesJson);
    }

    @JsonProperty("sugar_levels")
    public JsonNode getSugarLevels() {
        return Json.parse(sugarLevelsJson);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getSizesJson() {
        return sizesJson;
    }

    public void setSizesJson(String sizesJson) {
        this.sizesJson = sizesJson;
    }

    public String getSugarLevelsJson() {
        return sugarLevelsJson;
    }

    public void setSugarLevelsJson(String sugarLevelsJson) {
        this.sugarLevelsJson = sugarLevelsJson;
    }

    public Integer getSoldCount() {
        return soldCount;
    }

    public void setSoldCount(Integer soldCount) {
        this.soldCount = soldCount;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
