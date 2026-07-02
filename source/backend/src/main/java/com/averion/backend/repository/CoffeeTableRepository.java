package com.averion.backend.repository;

import com.averion.backend.model.CoffeeTable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoffeeTableRepository extends JpaRepository<CoffeeTable, Integer> {
    List<CoffeeTable> findAllByOrderByIdAsc();
}
