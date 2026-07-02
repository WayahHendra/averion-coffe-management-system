package com.averion.backend.model;

import com.averion.backend.util.Json;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import tools.jackson.databind.JsonNode;
import jakarta.persistence.*;

/** Item pre-order yang menempel pada sebuah booking. */
@Entity
@Table(name = "booking_items")
public class BookingItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "booking_id")
    private Booking booking;

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

    public BookingItem() {
    }

    @JsonProperty("size")
    public JsonNode getSize() {
        return Json.parse(sizeJson);
    }

    @JsonProperty("sugar_level")
    public JsonNode getSugarLevel() {
        return Json.parse(sugarLevelJson);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
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
