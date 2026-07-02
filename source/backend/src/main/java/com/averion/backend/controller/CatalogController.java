package com.averion.backend.controller;

import com.averion.backend.model.Category;
import com.averion.backend.model.CoffeeTable;
import com.averion.backend.model.Product;
import com.averion.backend.model.Voucher;
import com.averion.backend.service.CatalogService;
import tools.jackson.databind.JsonNode;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/** REST API katalog: kategori, produk, meja, voucher. */
@RestController
@RequestMapping("/api")
public class CatalogController {

    private final CatalogService catalogService;

    public CatalogController(CatalogService catalogService) {
        this.catalogService = catalogService;
    }

    // ---------- Kategori ----------

    @GetMapping("/categories")
    public List<Category> categories() {
        return catalogService.categories();
    }

    public record CategoryRequest(String name, String icon) {
    }

    @PostMapping("/categories")
    public Category createCategory(@RequestBody CategoryRequest request) {
        return catalogService.createCategory(request.name(), request.icon());
    }

    @PutMapping("/categories/{id}")
    public Category updateCategory(@PathVariable Integer id, @RequestBody CategoryRequest request) {
        return catalogService.updateCategory(id, request.name(), request.icon());
    }

    @DeleteMapping("/categories/{id}")
    public Map<String, Object> deleteCategory(@PathVariable Integer id) {
        catalogService.deleteCategory(id);
        return Map.of("success", true);
    }

    // ---------- Produk ----------

    @GetMapping("/products")
    public List<Product> products() {
        return catalogService.products();
    }

    public record ProductRequest(String name, String description, Double price, String image,
            Integer categoryId, JsonNode sizes, JsonNode sugarLevels) {
    }

    @PostMapping("/products")
    public Product createProduct(@RequestBody ProductRequest request) {
        return catalogService.saveProduct(null, request.name(), request.description(),
                request.price() == null ? 0 : request.price(), request.image(),
                request.categoryId(), request.sizes(), request.sugarLevels());
    }

    @PutMapping("/products/{id}")
    public Product updateProduct(@PathVariable Integer id, @RequestBody ProductRequest request) {
        return catalogService.saveProduct(id, request.name(), request.description(),
                request.price() == null ? 0 : request.price(), request.image(),
                request.categoryId(), request.sizes(), request.sugarLevels());
    }

    @DeleteMapping("/products/{id}")
    public Map<String, Object> deleteProduct(@PathVariable Integer id) {
        catalogService.deleteProduct(id);
        return Map.of("success", true);
    }

    // ---------- Meja ----------

    @GetMapping("/tables")
    public List<CoffeeTable> tables() {
        return catalogService.tables();
    }

    public record TableRequest(String name, String tableNumber, Integer capacity, String status) {
    }

    @PostMapping("/tables")
    public CoffeeTable createTable(@RequestBody TableRequest request) {
        return catalogService.createTable(request.name(), request.tableNumber(), request.capacity());
    }

    @PutMapping("/tables/{id}")
    public CoffeeTable updateTable(@PathVariable Integer id, @RequestBody TableRequest request) {
        CoffeeTable table = catalogService.findTable(id);
        if (request.name() != null) {
            table.setName(request.name());
        }
        if (request.capacity() != null) {
            table.setCapacity(request.capacity());
        }
        catalogService.updateTableStatus(table, request.status() != null ? request.status() : table.getStatus());
        return table;
    }

    @DeleteMapping("/tables/{id}")
    public Map<String, Object> deleteTable(@PathVariable Integer id) {
        catalogService.deleteTable(id);
        return Map.of("success", true);
    }

    // ---------- Voucher ----------

    @GetMapping("/vouchers")
    public List<Voucher> vouchers() {
        return catalogService.vouchers();
    }

    public record VoucherRequest(String originalCode, String code, String type, Double value, Integer limit,
            String expiryDate) {
    }

    @PostMapping("/vouchers")
    public Voucher saveVoucher(@RequestBody VoucherRequest request) {
        LocalDate expiry = request.expiryDate() == null || request.expiryDate().isBlank() ? null
                : LocalDate.parse(request.expiryDate());
        return catalogService.saveVoucher(request.originalCode(), request.code(), request.type(),
                request.value() == null ? 0 : request.value(), request.limit() == null ? 0 : request.limit(), expiry);
    }

    @DeleteMapping("/vouchers/{code}")
    public Map<String, Object> deleteVoucher(@PathVariable String code) {
        catalogService.deleteVoucher(code);
        return Map.of("success", true);
    }
}
