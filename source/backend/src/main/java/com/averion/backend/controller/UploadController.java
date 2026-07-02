package com.averion.backend.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;

/**
 * Upload gambar (produk, dsb). File disimpan di folder uploads/ di sebelah
 * aplikasi, lalu disajikan statis lewat /uploads/**.
 */
@RestController
@RequestMapping("/api")
public class UploadController {

    private static final Path UPLOAD_DIR = Path.of("uploads");

    @PostMapping("/upload")
    public Map<String, String> upload(@RequestParam("file") MultipartFile file) throws IOException {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("File kosong.");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Hanya file gambar yang diizinkan.");
        }

        Files.createDirectories(UPLOAD_DIR);
        String extension = switch (contentType) {
            case "image/png" -> ".png";
            case "image/webp" -> ".webp";
            case "image/gif" -> ".gif";
            default -> ".jpg";
        };
        String filename = "img-" + System.currentTimeMillis() + extension;
        file.transferTo(UPLOAD_DIR.resolve(filename).toAbsolutePath());

        // URL absolut (mis. http://localhost:8080/uploads/img-...png) supaya
        // bisa dipakai langsung oleh <img> di frontend, port berapa pun.
        String url = ServletUriComponentsBuilder.fromCurrentContextPath().path("/uploads/").path(filename)
                .toUriString();
        return Map.of("url", url);
    }
}
