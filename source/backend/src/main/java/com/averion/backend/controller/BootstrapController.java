package com.averion.backend.controller;

import com.averion.backend.service.*;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.LinkedHashMap;
import java.util.Map;

/** Satu endpoint untuk memuat seluruh data awal yang dibutuhkan frontend. */
@RestController
@RequestMapping("/api")
public class BootstrapController {

    private final CatalogService catalogService;
    private final OrderService orderService;
    private final BookingService bookingService;
    private final UserService userService;
    private final RoleCatalog roleCatalog;

    public BootstrapController(CatalogService catalogService, OrderService orderService, BookingService bookingService,
            UserService userService, RoleCatalog roleCatalog) {
        this.catalogService = catalogService;
        this.orderService = orderService;
        this.bookingService = bookingService;
        this.userService = userService;
        this.roleCatalog = roleCatalog;
    }

    @GetMapping("/bootstrap")
    public Map<String, Object> bootstrap() {
        Map<String, Object> data = new LinkedHashMap<>();
        data.put("products", catalogService.products());
        data.put("categories", catalogService.categories());
        data.put("tables", catalogService.tables());
        data.put("vouchers", catalogService.vouchers());
        data.put("users", userService.findAll());
        data.put("orders", orderService.findAll());
        data.put("bookings", bookingService.findAll());
        data.put("roles", roleCatalog.allRoles());
        return data;
    }
}
