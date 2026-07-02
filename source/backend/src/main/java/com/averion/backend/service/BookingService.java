package com.averion.backend.service;

import com.averion.backend.dto.BookingRequest;
import com.averion.backend.dto.OrderRequest;
import com.averion.backend.model.*;
import com.averion.backend.repository.BookingRepository;
import com.averion.backend.util.Json;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/** Modul booking & pilih meja. */
@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final CatalogService catalogService;

    public BookingService(BookingRepository bookingRepository, CatalogService catalogService) {
        this.bookingRepository = bookingRepository;
        this.catalogService = catalogService;
    }

    public List<Booking> findAll() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    @Transactional
    public Booking create(BookingRequest request) {
        if (request.customerName() == null || request.customerName().isBlank()) {
            throw new IllegalArgumentException("Nama customer wajib diisi.");
        }
        if (request.tableId() == null) {
            throw new IllegalArgumentException("Pilih meja untuk booking.");
        }

        Booking booking = new Booking();
        booking.setCustomerName(request.customerName().trim());
        booking.setNumberOfGuests(request.numberOfGuests() == null ? 2 : request.numberOfGuests());
        booking.setBookingDateTime(parseDateTime(request.bookingDateTime()));
        booking.setPaymentMethod(request.paymentMethod());
        booking.setStatus(Booking.STATUS_CONFIRMED);

        CoffeeTable table = catalogService.findTable(request.tableId());
        booking.setTable(table);
        catalogService.updateTableStatus(table, CoffeeTable.RESERVED);

        if (request.items() != null) {
            for (OrderRequest.ItemRequest itemReq : request.items()) {
                Product product = catalogService.findProduct(itemReq.productId());
                double priceModifier = itemReq.size() != null ? itemReq.size().path("price_modifier").asDouble(0) : 0;
                double unitPrice = product.getPrice() + priceModifier;

                BookingItem item = new BookingItem();
                item.setBooking(booking);
                item.setProductId(product.getId());
                item.setProductName(product.getName());
                item.setProductImage(product.getImage());
                item.setPrice(unitPrice);
                item.setQuantity(Math.max(1, itemReq.quantity()));
                item.setSizeJson(Json.stringify(itemReq.size()));
                item.setSugarLevelJson(Json.stringify(itemReq.sugarLevel()));
                item.setSubtotal(unitPrice * item.getQuantity());
                booking.getPreOrderItems().add(item);
            }
        }

        Voucher voucher = catalogService.resolveVoucher(request.voucherCode());
        booking.setVoucherCode(voucher != null ? voucher.getCode() : null);
        booking.calculateTotal(voucher);
        if (voucher != null) {
            catalogService.recordVoucherUsage(voucher);
        }

        return bookingRepository.save(booking);
    }

    /** Terima beberapa format umum dari frontend: ISO, atau "dd/MM/yyyy HH:mm". */
    private LocalDateTime parseDateTime(String raw) {
        if (raw == null || raw.isBlank()) {
            throw new IllegalArgumentException("Tanggal & jam booking wajib diisi.");
        }
        String value = raw.trim().replace(' ', 'T');
        try {
            return LocalDateTime.parse(value);
        } catch (Exception ignored) {
            // coba format dd/MM/yyyy'T'HH:mm
        }
        try {
            return LocalDateTime.parse(value, DateTimeFormatter.ofPattern("dd/MM/yyyy'T'HH:mm"));
        } catch (Exception e) {
            throw new IllegalArgumentException("Format tanggal booking tidak dikenali: " + raw);
        }
    }
}
