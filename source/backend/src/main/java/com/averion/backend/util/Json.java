package com.averion.backend.util;

import tools.jackson.databind.JsonNode;
import tools.jackson.databind.ObjectMapper;

/** Util kecil untuk kolom yang menyimpan JSON mentah (sizes, sugar_levels, dsb). */
public final class Json {

    private static final ObjectMapper MAPPER = new ObjectMapper();

    private Json() {
    }

    /** Parse string JSON dari kolom database menjadi JsonNode (null-safe). */
    public static JsonNode parse(String raw) {
        if (raw == null || raw.isBlank()) {
            return null;
        }
        try {
            return MAPPER.readTree(raw);
        } catch (Exception e) {
            return null;
        }
    }

    /** Serialize JsonNode dari request menjadi string untuk disimpan (null-safe). */
    public static String stringify(JsonNode node) {
        if (node == null || node.isNull()) {
            return null;
        }
        return node.toString();
    }
}
