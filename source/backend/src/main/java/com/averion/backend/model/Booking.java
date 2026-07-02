package com.averion.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "bookings")
public class Booking {

    public static final String STATUS_CONFIRMED = "confirmed";
    public static final String STATUS_RESERVED = "reserved";
    public static final String STATUS_COMPLETED = "completed";
    public static final String STATUS_CANCELLED = "cancelled";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String customerName;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "table_id")
    private CoffeeTable table;

    @Column(nullable = false)
    private int numberOfGuests;

    @Column(nullable = false)
    private LocalDateTime bookingDateTime;

    /** confirmed / reserved / completed / cancelled. */
    @Column(nullable = false)
    private String status = STATUS_CONFIRMED;

    private double subtotal;
    private double discount;
    private double tax;
    private double total;

    private String paymentMethod;
    private String voucherCode;

    private LocalDateTime createdAt = LocalDateTime.now();

    @JsonProperty("pre_order_items")
    @OneToMany(mappedBy = "booking", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<BookingItem> preOrderItems = new ArrayList<>();

    public Booking() {
    }

    @JsonProperty("table_id")
    public Integer getTableId() {
        return table != null ? table.getId() : null;
    }

    /** Hitung ulang ringkasan harga pre-order, pajak 12% setelah diskon. */
    public void calculateTotal(Voucher voucher) {
        this.subtotal = preOrderItems.stream().mapToDouble(BookingItem::getSubtotal).sum();
        this.discount = voucher != null ? voucher.calculateDiscount(subtotal) : 0;
        this.tax = Math.round((subtotal - discount) * 0.12);
        this.total = subtotal - discount + tax;
    }

    public void confirmBooking() {
        this.status = STATUS_CONFIRMED;
    }

    public void cancelBooking() {
        this.status = STATUS_CANCELLED;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public CoffeeTable getTable() {
        return table;
    }

    public void setTable(CoffeeTable table) {
        this.table = table;
    }

    public int getNumberOfGuests() {
        return numberOfGuests;
    }

    public void setNumberOfGuests(int numberOfGuests) {
        this.numberOfGuests = numberOfGuests;
    }

    public LocalDateTime getBookingDateTime() {
        return bookingDateTime;
    }

    public void setBookingDateTime(LocalDateTime bookingDateTime) {
        this.bookingDateTime = bookingDateTime;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
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

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
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

    public List<BookingItem> getPreOrderItems() {
        return preOrderItems;
    }

    public void setPreOrderItems(List<BookingItem> preOrderItems) {
        this.preOrderItems = preOrderItems;
    }
}
