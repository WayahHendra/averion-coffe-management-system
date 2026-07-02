package com.averion.backend.repository;

import com.averion.backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Integer> {
    List<Product> findAllByOrderByIdAsc();

    /** Traversal eksplisit category.id (getter transient getCategoryId membuat path ambigu). */
    long countByCategory_Id(Integer categoryId);
}
