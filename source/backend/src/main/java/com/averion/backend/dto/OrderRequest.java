package com.averion.backend.dto;

import tools.jackson.databind.JsonNode;

import java.util.List;

/**
 * Body POST /api/orders dari frontend POS (snake_case otomatis ter-mapping).
 */
public record OrderRequest(
                String orderType,
                Integer tableId,
                String paymentMethod,
                String voucherCode,
                List<ItemRequest> items) {
        public record ItemRequest(
                        Integer productId,
                        int quantity,
                        JsonNode size,
                        JsonNode sugarLevel) {
        }
}
