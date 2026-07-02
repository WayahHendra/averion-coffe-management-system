package com.averion.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    /** Tipe order sesuai frontend POS. */
    public static final String TYPE_DINE_IN = "dine-in";
    public static final String TYPE_TAKEAWAY = "takeaway";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(unique = true)
    private String orderCode;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "table_id")
    private CoffeeTable table;

    /** dine-in / takeaway. */
    @Column(nullable = false)
    private String orderType;

    /** completed / pending / cancelled. */
    @Column(nullable = false)
    private String status = "completed";

    /** cash / qris. */
    private String paymentMethod;

    /** paid / pending / completed / cancelled. */
    private String paymentStatus;

    private double subtotal;
    private double discount;
    private double tax;
    private double total;

    private String voucherCode;

    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonProperty("order_items")
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {
    }

    @JsonProperty("table_id")
    public Integer getTableId() {
        return table != null ? table.getId() : null;
    }

    /** Hitung ulang ringkasan harga. */
    public void calculateTotal(Voucher voucher) {
        this.subtotal = orderItems.stream().mapToDouble(OrderItem::getSubtotal).sum();
        this.discount = voucher != null ? voucher.calculateDiscount(subtotal) : 0;
        this.tax = Math.round((subtotal - discount) * 0.12);
        this.total = subtotal - discount + tax;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getOrderCode() {
        return orderCode;
    }

    public void setOrderCode(String orderCode) {
        this.orderCode = orderCode;
    }

    public CoffeeTable getTable() {
        return table;
    }

    public void setTable(CoffeeTable table) {
        this.table = table;
    }

    public String getOrderType() {
        return orderType;
    }

    public void setOrderType(String orderType) {
        this.orderType = orderType;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getPaymentStatus() {
        return paymentStatus;
    }

    public void setPaymentStatus(String paymentStatus) {
        this.paymentStatus = paymentStatus;
    }

    public double getSubtotal() {
        return subtotal;
    }

    public void setSubtotal(double subtotal) {
        this.subtotal = subtotal;
    }

    public double getDiscount() {
        return discount;
    }

    public void setDiscount(double discount) {
        this.discount = discount;
    }

    public double getTax() {
        return tax;
    }

    public void setTax(double tax) {
        this.tax = tax;
    }

    public double getTotal() {
        return total;
    }

    public void setTotal(double total) {
        this.total = total;
    }

    public String getVoucherCode() {
        return voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }
}
