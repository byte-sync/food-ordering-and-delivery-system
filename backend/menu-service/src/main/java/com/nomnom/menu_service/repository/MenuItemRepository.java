package com.nomnom.menu_service.repository;

import com.nomnom.menu_service.model.MenuItems;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MenuItemRepository extends JpaRepository<MenuItems, Long> {
    List<MenuItems> findByRestaurantId(String restaurantId);

    @Query("SELECT m FROM MenuItems m LEFT JOIN FETCH m.portions WHERE m.id = :id")
    Optional<MenuItems> findByIdWithPortions(@Param("id") Long id);

    @Query("SELECT m FROM MenuItems m LEFT JOIN FETCH m.portions WHERE m.restaurantId = :restaurantId")
    List<MenuItems> findByRestaurantIdWithPortions(@Param("restaurantId") String restaurantId);

    @Query("SELECT m FROM MenuItems m WHERE LOWER(m.category) = LOWER(:categoryName)")
    List<MenuItems> findByCategory(@Param("categoryName") String categoryName);

    @Query("SELECT DISTINCT m.category FROM MenuItems m")
    List<String> findDistinctCategories();
}
