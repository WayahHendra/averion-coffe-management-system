package com.averion.backend.service;

import com.averion.backend.dto.OrderRequest;
import com.averion.backend.model.*;
import com.averion.backend.repository.OrderRepository;
import com.averion.backend.util.Json;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

/** Modul pemesanan POS: buat order dan kelola statusnya. */
@Service
public class OrderService {

    private final OrderRepository orderRepository;
    private final CatalogService catalogService;

    public OrderService(OrderRepository orderRepository, CatalogService catalogService) {
        this.orderRepository = orderRepository;
        this.catalogService = catalogService;
    }

    public List<Order> findAll() {
        return orderRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Buat order dari POS. Harga diambil dari database (bukan dari client),
     * pajak 12% setelah diskon, lalu pembayaran langsung tercatat paid
     * karena di alur POS kasir menerima pembayaran saat itu juga.
     */
    @Transactional
    public Order create(OrderRequest request) {
        if (request.items() == null || request.items().isEmpty()) {
            throw new IllegalArgumentException("Order tidak punya item.");
        }

        Order order = new Order();
        order.setOrderCode(generateOrderCode());
        order.setOrderType(request.orderType() == null ? Order.TYPE_DINE_IN : request.orderType());
        order.setPaymentMethod(request.paymentMethod());
        order.setPaymentStatus("paid");
        order.setStatus("completed");

        if (Order.TYPE_DINE_IN.equals(order.getOrderType())) {
            if (request.tableId() == null) {
                throw new IllegalArgumentException("Pilih meja untuk dine-in.");
            }
            CoffeeTable table = catalogService.findTable(request.tableId());
            order.setTable(table);
            catalogService.updateTableStatus(table, CoffeeTable.OCCUPIED);
        }

        for (OrderRequest.ItemRequest itemReq : request.items()) {
            Product product = catalogService.findProduct(itemReq.productId());
            double priceModifier = itemReq.size() != null ? itemReq.size().path("price_modifier").asDouble(0) : 0;
            double unitPrice = product.getPrice() + priceModifier;

            OrderItem item = new OrderItem();
            item.setOrder(order);
            item.setProductId(product.getId());
            item.setProductName(product.getName());
            item.setProductImage(product.getImage());
            item.setPrice(unitPrice);
            item.setQuantity(Math.max(1, itemReq.quantity()));
            item.setSizeJson(Json.stringify(itemReq.size()));
            item.setSugarLevelJson(Json.stringify(itemReq.sugarLevel()));
            item.setSubtotal(item.calculateSubtotal());
            order.getOrderItems().add(item);

            catalogService.recordSold(product, item.getQuantity());
        }

        Voucher voucher = catalogService.resolveVoucher(request.voucherCode());
        order.setVoucherCode(voucher != null ? voucher.getCode() : null);
        order.calculateTotal(voucher);
        if (voucher != null) {
            catalogService.recordVoucherUsage(voucher);
        }

        return orderRepository.save(order);
    }

    /** Kode order unik, mis. ORD-260610-0007. */
    private String generateOrderCode() {
        String datePart = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyMMdd"));
        return String.format("ORD-%s-%04d", datePart, orderRepository.count() + 1);
    }
}
