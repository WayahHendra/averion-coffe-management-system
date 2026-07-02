package com.averion.backend.config;

import com.averion.backend.model.*;
import com.averion.backend.repository.*;
import com.averion.backend.service.AuthService;
import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.io.ClassPathResource;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.util.HashMap;
import java.util.Map;

/**
 * Mengisi database dari resources/seed/*.json — data yang sama persis dengan
 * mock JSON frontend, sehingga tampilan aplikasi identik tapi sekarang live
 * dari database.
 */
@Configuration
public class DataSeeder {

    private final ObjectMapper mapper = new ObjectMapper();

    @Bean
    CommandLineRunner seed(CategoryRepository categories, ProductRepository products,
                           CoffeeTableRepository tables, VoucherRepository vouchers,
                           UserRepository users, OrderRepository orders,
                           BookingRepository bookings, AuthService authService) {
        return args -> {
            if (categories.count() > 0) {
                return;
            }

            // --- Kategori ---
            Map<Integer, Category> categoryById = new HashMap<>();
            for (JsonNode c : read("categories.json")) {
                Category saved = categories.save(new Category(c.get("name").asText(), c.path("icon").asText(null)));
                categoryById.put(c.get("id").asInt(), saved);
            }

            // --- Produk ---
            Map<Integer, Product> productById = new HashMap<>();
            for (JsonNode p : read("products.json")) {
                Product product = new Product();
                product.setName(p.get("name").asText());
                product.setDescription(p.path("description").asText(null));
                product.setPrice(p.get("price").asDouble());
                product.setImage(p.path("image").asText(null));
                product.setCategory(categoryById.get(p.path("category_id").asInt()));
                product.setSizesJson(p.hasNonNull("sizes") ? p.get("sizes").toString() : null);
                product.setSugarLevelsJson(p.hasNonNull("sugar_levels") ? p.get("sugar_levels").toString() : null);
                product.setSoldCount(p.path("sold_count").asInt(0));
                productById.put(p.get("id").asInt(), products.save(product));
            }

            // --- Meja ---
            Map<Integer, CoffeeTable> tableById = new HashMap<>();
            for (JsonNode t : read("tables.json")) {
                CoffeeTable table = new CoffeeTable(
                        t.path("table_number").asText(null),
                        t.get("name").asText(),
                        t.path("capacity").isNumber() ? t.get("capacity").asInt() : null);
                table.setStatus(t.path("status").asText(CoffeeTable.AVAILABLE));
                tableById.put(t.get("id").asInt(), tables.save(table));
            }

            // --- Voucher ---
            for (JsonNode v : read("vouchers.json")) {
                vouchers.save(new Voucher(
                        v.get("code").asText(),
                        v.get("type").asText(),
                        v.get("value").asDouble(),
                        v.path("limit").asInt(100),
                        v.hasNonNull("expiry_date") ? LocalDate.parse(v.get("expiry_date").asText()) : null));
            }

            // --- User (password = nilai password_hash di mock, di-hash BCrypt) ---
            for (JsonNode u : read("users.json")) {
                User user = new User(
                        u.get("display_name").asText(),
                        u.get("username").asText(),
                        u.get("email").asText(),
                        authService.encode(u.get("password_hash").asText()),
                        u.get("role_id").asInt());
                user.setStatus(u.path("status").asText("active"));
                users.save(user);
            }

            // --- Order contoh (agar dashboard overview langsung berisi) ---
            for (JsonNode o : read("orders.json")) {
                Order order = new Order();
                order.setOrderCode(o.path("order_code").asText(null));
                order.setTable(tableById.get(o.path("table_id").asInt()));
                order.setOrderType(o.path("order_type").asText(Order.TYPE_DINE_IN));
                order.setStatus(o.path("status").asText("completed"));
                order.setPaymentMethod(o.path("payment_method").asText(null));
                order.setPaymentStatus(o.path("payment_status").asText(null));
                order.setSubtotal(o.path("subtotal").asDouble());
                order.setDiscount(o.path("discount").asDouble());
                order.setTax(o.path("tax").asDouble());
                order.setTotal(o.path("total").asDouble());
                order.setVoucherCode(o.path("voucher_code").asText(null));
                order.setCreatedAt(parseDateTime(o.path("created_at").asText(null)));
                for (JsonNode i : o.path("order_items")) {
                    OrderItem item = new OrderItem();
                    item.setOrder(order);
                    item.setProductId(i.path("product_id").asInt());
                    item.setProductName(i.path("product_name").asText(
                            productName(productById, i.path("product_id").asInt())));
                    item.setProductImage(i.path("product_image").asText(null));
                    item.setPrice(i.path("price").asDouble());
                    item.setQuantity(i.path("quantity").asInt(1));
                    item.setSizeJson(i.hasNonNull("size") ? i.get("size").toString() : null);
                    item.setSugarLevelJson(i.hasNonNull("sugar_level") ? i.get("sugar_level").toString() : null);
                    item.setSubtotal(i.path("subtotal").asDouble());
                    order.getOrderItems().add(item);
                }
                orders.save(order);
            }

            // --- Booking contoh ---
            for (JsonNode b : read("bookings.json")) {
                Booking booking = new Booking();
                booking.setCustomerName(b.get("customer_name").asText());
                booking.setTable(tableById.get(b.path("table_id").asInt()));
                booking.setNumberOfGuests(b.path("number_of_guests").asInt(2));
                booking.setBookingDateTime(parseDateTime(b.path("booking_date_time").asText(null)));
                booking.setStatus(b.path("status").asText(Booking.STATUS_CONFIRMED));
                booking.setSubtotal(b.path("subtotal").asDouble());
                booking.setDiscount(b.path("discount").asDouble());
                booking.setTax(b.path("tax").asDouble());
                booking.setTotal(b.path("total").asDouble());
                booking.setPaymentMethod(b.path("payment_method").asText(null));
                booking.setVoucherCode(b.path("voucher_code").asText(null));
                booking.setCreatedAt(parseDateTime(b.path("created_at").asText(null)));
                for (JsonNode i : b.path("pre_order_items")) {
                    BookingItem item = new BookingItem();
                    item.setBooking(booking);
                    item.setProductId(i.path("product_id").asInt());
                    item.setProductName(i.path("product_name").asText(null));
                    item.setProductImage(i.path("product_image").asText(null));
                    item.setPrice(i.path("price").asDouble());
                    item.setQuantity(i.path("quantity").asInt(1));
                    item.setSizeJson(i.hasNonNull("size") ? i.get("size").toString() : null);
                    item.setSugarLevelJson(i.hasNonNull("sugar_level") ? i.get("sugar_level").toString() : null);
                    item.setSubtotal(i.path("subtotal").asDouble());
                    booking.getPreOrderItems().add(item);
                }
                bookings.save(booking);
            }
        };
    }

    private JsonNode read(String file) throws Exception {
        return mapper.readTree(new ClassPathResource("seed/" + file).getInputStream());
    }

    private String productName(Map<Integer, Product> productById, int id) {
        Product product = productById.get(id);
        return product != null ? product.getName() : "Unknown";
    }

    /** Terima "2026-01-07T21:14:37" maupun "...Z" (offset). */
    private LocalDateTime parseDateTime(String raw) {
        if (raw == null || raw.isBlank() || "null".equals(raw)) {
            return LocalDateTime.now();
        }
        try {
            return LocalDateTime.parse(raw);
        } catch (Exception ignored) {
            return OffsetDateTime.parse(raw).toLocalDateTime();
        }
    }
}
