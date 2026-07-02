package com.averion.backend.model;

import com.averion.backend.util.Json;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.databind.JsonNode;
import jakarta.persistence.*;

import java.util.LinkedHashMap;
import java.util.Map;

@Entity
@Table(name = "order_items")
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "order_id")
    private Order order;

    /**
     * Data produk disalin saat order dibuat agar riwayat tidak berubah
     * ketika produk diubah/dihapus.
     */
    private Integer productId;
    private String productName;

    @Column(columnDefinition = "TEXT")
    private String productImage;

    private double price;
    private int quantity;

    @JsonIgnore
    @Column(columnDefinition = "TEXT")
    private String sizeJson;

    @JsonIgnore
    @Column(columnDefinition = "TEXT")
    private String sugarLevelJson;

    private double subtotal;

    public OrderItem() {
    }

    @JsonProperty("size")
    public JsonNode getSize() {
        return Json.parse(sizeJson);
    }

    @JsonProperty("sugar_level")
    public JsonNode getSugarLevel() {
        return Json.parse(sugarLevelJson);
    }

    /** Objek produk ringkas untuk modal detail order di frontend. */
    @JsonProperty("product")
    public Map<String, Object> getProduct() {
        Map<String, Object> product = new LinkedHashMap<>();
        product.put("id", productId);
        product.put("name", productName);
        product.put("image", productImage);
        product.put("price", price);
        return product;
    }

    public double calculateSubtotal() {
        return price * quantity;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
    }

    public Integer getProductId() {
        return productId;
    }

    public void setProductId(Integer productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public String getProductImage() {
        return productImage;
    }

    public void setProductImage(String productImage) {
        this.productImage = productImage;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public String getSizeJson() {
        return sizeJson;
    }

    public void setSizeJson(String sizeJson) {
        this.sizeJson = sizeJson;
    }

    public String getSugarLevelJson() {
        return sugarLevelJson;
    }

    public void setSugarLevelJson(String sugarLevelJson) {
        this.sugarLevelJson = sugarLevelJson;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }
}
