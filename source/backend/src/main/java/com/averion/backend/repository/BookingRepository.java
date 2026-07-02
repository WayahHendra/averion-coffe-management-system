package com.averion.backend.repository;

import com.averion.backend.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findAllByOrderByCreatedAtDesc();
}
