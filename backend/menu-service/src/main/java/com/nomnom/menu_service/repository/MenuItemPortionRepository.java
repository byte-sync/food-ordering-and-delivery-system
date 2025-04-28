package com.nomnom.menu_service.repository;

import com.nomnom.menu_service.model.MenuItemPortion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface MenuItemPortionRepository extends JpaRepository<MenuItemPortion, Long> {
    List<MenuItemPortion> findByMenuItemId(Long menuItemId);

    @Modifying
    @Query("DELETE FROM MenuItemPortion p WHERE p.menuItem.id = :menuItemId")
    void deleteAllByMenuItemId(@Param("menuItemId") Long menuItemId);
}