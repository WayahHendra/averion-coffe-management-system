package com.averion.backend.controller;

import com.averion.backend.dto.BookingRequest;
import com.averion.backend.dto.OrderRequest;
import com.averion.backend.model.Booking;
import com.averion.backend.model.Order;
import com.averion.backend.service.BookingService;
import com.averion.backend.service.OrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/** REST API transaksi: order POS dan booking. */
@RestController
@RequestMapping("/api")
public class OrderController {

    private final OrderService orderService;
    private final BookingService bookingService;

    public OrderController(OrderService orderService, BookingService bookingService) {
        this.orderService = orderService;
        this.bookingService = bookingService;
    }

    @GetMapping("/orders")
    public List<Order> orders() {
        return orderService.findAll();
    }

    @PostMapping("/orders")
    public Order createOrder(@RequestBody OrderRequest request) {
        return orderService.create(request);
    }

    @GetMapping("/bookings")
    public List<Booking> bookings() {
        return bookingService.findAll();
    }

    @PostMapping("/bookings")
    public Booking createBooking(@RequestBody BookingRequest request) {
        return bookingService.create(request);
    }
}
