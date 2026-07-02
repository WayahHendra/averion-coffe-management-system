package com.averion.backend.dto;

import java.util.List;

/** Body POST /api/bookings dari frontend POS. */
public record BookingRequest(
        String customerName,
        Integer tableId,
        Integer numberOfGuests,
        String bookingDateTime,
        String paymentMethod,
        String voucherCode,
        List<OrderRequest.ItemRequest> items) {
}
