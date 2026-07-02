package com.averion.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDate;

@Entity
@Table(name = "vouchers")
public class Voucher {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Integer id;

    @Column(nullable = false, unique = true)
    private String code;

    /** percentage / fixed. */
    @Column(nullable = false)
    private String type;

    /**
     * Persen (mis. 10) atau nominal rupiah, tergantung type.
     * Kolom diberi nama eksplisit karena "value" kata kunci SQL.
     */
    @Column(name = "discount_value", nullable = false)
    private double value;

    /**
     * Kuota pemakaian. Kolom diberi nama eksplisit karena "limit" kata kunci SQL.
     */
    @Column(name = "usage_limit", nullable = false)
    private int limit;

    private int usedCount = 0;

    private LocalDate expiryDate;

    public Voucher() {
    }

    public Voucher(String code, String type, double value, int limit, LocalDate expiryDate) {
        this.code = code;
        this.type = type;
        this.value = value;
        this.limit = limit;
        this.expiryDate = expiryDate;
    }

    public boolean validateVoucher() {
        boolean notExpired = expiryDate == null || !expiryDate.isBefore(LocalDate.now());
        return notExpired && usedCount < limit;
    }

    /** Hitung potongan harga: persen dibulatkan seperti frontend (Math.round). */
    public double calculateDiscount(double subtotal) {
        if ("percentage".equalsIgnoreCase(type)) {
            return Math.round(subtotal * (value / 100.0));
        }
        return Math.min(value, subtotal);
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public double getValue() {
        return value;
    }

    public void setValue(double value) {
        this.value = value;
    }

    public int getLimit() {
        return limit;
    }

    public void setLimit(int limit) {
        this.limit = limit;
    }

    public int getUsedCount() {
        return usedCount;
    }

    public void setUsedCount(int usedCount) {
        this.usedCount = usedCount;
    }

    public LocalDate getExpiryDate() {
        return expiryDate;
    }

    public void setExpiryDate(LocalDate expiryDate) {
        this.expiryDate = expiryDate;
    }
}
