package com.averion.backend.service;

import com.averion.backend.model.Category;
import com.averion.backend.model.CoffeeTable;
import com.averion.backend.model.Product;
import com.averion.backend.model.Voucher;
import com.averion.backend.repository.CategoryRepository;
import com.averion.backend.repository.CoffeeTableRepository;
import com.averion.backend.repository.ProductRepository;
import com.averion.backend.repository.VoucherRepository;
import com.averion.backend.util.Json;
import tools.jackson.databind.JsonNode;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

/**
 * Logika bisnis katalog: kategori, produk, meja, dan voucher
 * (modul Kelola Kategori & Produk + Kelola Meja + Voucher).
 */
@Service
public class CatalogService {

    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final CoffeeTableRepository tableRepository;
    private final VoucherRepository voucherRepository;

    public CatalogService(CategoryRepository categoryRepository, ProductRepository productRepository,
                          CoffeeTableRepository tableRepository, VoucherRepository voucherRepository) {
        this.categoryRepository = categoryRepository;
        this.productRepository = productRepository;
        this.tableRepository = tableRepository;
        this.voucherRepository = voucherRepository;
    }

    // ---------- Kategori ----------

    public List<Category> categories() {
        return categoryRepository.findAll();
    }

    public Category createCategory(String name, String icon) {
        if (categoryRepository.existsByNameIgnoreCase(name)) {
            throw new IllegalArgumentException("Kategori \"" + name + "\" sudah ada.");
        }
        return categoryRepository.save(new Category(name, icon));
    }

    public Category updateCategory(Integer id, String name, String icon) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Kategori tidak ditemukan."));
        category.setName(name);
        category.setIcon(icon);
        return categoryRepository.save(category);
    }

    public void deleteCategory(Integer id) {
        if (productRepository.countByCategory_Id(id) > 0) {
            throw new IllegalArgumentException("Kategori masih dipakai produk.");
        }
        categoryRepository.deleteById(id);
    }

    // ---------- Produk ----------

    public List<Product> products() {
        return productRepository.findAllByOrderByIdAsc();
    }

    public Product findProduct(Integer id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Produk tidak ditemukan."));
    }

    public Product saveProduct(Integer id, String name, String description, double price,
                               String image, Integer categoryId, JsonNode sizes, JsonNode sugarLevels) {
        Product product = id == null ? new Product() : findProduct(id);
        product.setName(name);
        product.setDescription(description);
        product.setPrice(price);
        if (image != null && !image.isBlank()) {
            product.setImage(image);
        }
        if (categoryId != null) {
            product.setCategory(categoryRepository.findById(categoryId)
                    .orElseThrow(() -> new IllegalArgumentException("Kategori tidak ditemukan.")));
        }
        if (sizes != null) {
            product.setSizesJson(Json.stringify(sizes));
        }
        if (sugarLevels != null) {
            product.setSugarLevelsJson(Json.stringify(sugarLevels));
        }
        return productRepository.save(product);
    }

    public void deleteProduct(Integer id) {
        productRepository.deleteById(id);
    }

    public void recordSold(Product product, int quantity) {
        product.setSoldCount((product.getSoldCount() == null ? 0 : product.getSoldCount()) + quantity);
        productRepository.save(product);
    }

    // ---------- Meja ----------

    public List<CoffeeTable> tables() {
        return tableRepository.findAllByOrderByIdAsc();
    }

    public CoffeeTable findTable(Integer id) {
        return tableRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meja tidak ditemukan."));
    }

    public CoffeeTable createTable(String name, String tableNumber, Integer capacity) {
        return tableRepository.save(new CoffeeTable(tableNumber, name, capacity));
    }

    public void updateTableStatus(CoffeeTable table, String status) {
        table.updateStatus(status);
        tableRepository.save(table);
    }

    public void deleteTable(Integer id) {
        tableRepository.deleteById(id);
    }

    // ---------- Voucher ----------

    public List<Voucher> vouchers() {
        return voucherRepository.findAll();
    }

    /** Cari & validasi voucher; null kalau kode kosong. */
    public Voucher resolveVoucher(String code) {
        if (code == null || code.isBlank()) {
            return null;
        }
        Voucher voucher = voucherRepository.findByCodeIgnoreCase(code.trim())
                .orElseThrow(() -> new IllegalArgumentException("Kode voucher tidak ditemukan."));
        if (!voucher.validateVoucher()) {
            throw new IllegalArgumentException("Voucher kedaluwarsa atau kuota habis.");
        }
        return voucher;
    }

    public void recordVoucherUsage(Voucher voucher) {
        voucher.setUsedCount(voucher.getUsedCount() + 1);
        voucherRepository.save(voucher);
    }

    public Voucher saveVoucher(String originalCode, String code, String type, double value,
                               int limit, LocalDate expiryDate) {
        Voucher voucher;
        if (originalCode != null && !originalCode.isBlank()) {
            voucher = voucherRepository.findByCodeIgnoreCase(originalCode)
                    .orElseThrow(() -> new IllegalArgumentException("Voucher tidak ditemukan."));
        } else {
            if (voucherRepository.existsByCodeIgnoreCase(code)) {
                throw new IllegalArgumentException("Kode voucher sudah ada.");
            }
            voucher = new Voucher();
        }
        voucher.setCode(code.toUpperCase().trim());
        voucher.setType(type);
        voucher.setValue(value);
        voucher.setLimit(limit);
        voucher.setExpiryDate(expiryDate);
        return voucherRepository.save(voucher);
    }

    public void deleteVoucher(String code) {
        Voucher voucher = voucherRepository.findByCodeIgnoreCase(code)
                .orElseThrow(() -> new IllegalArgumentException("Voucher tidak ditemukan."));
        voucherRepository.delete(voucher);
    }
}
