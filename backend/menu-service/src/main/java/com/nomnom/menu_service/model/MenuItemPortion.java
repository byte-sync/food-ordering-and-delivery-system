package com.nomnom.menu_service.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

@Entity
@Table(name = "menu_item_portions")
public class MenuItemPortion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String portionSize; // e.g., "Small", "Medium", "Large"
    private double price;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "menu_item_id", nullable = false)
    @JsonIgnore
    private MenuItems menuItem;

    public MenuItemPortion() {}

    public MenuItemPortion(String portionSize, double price, MenuItems menuItem) {
        this.portionSize = portionSize;
        this.price = price;
        this.menuItem = menuItem;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPortionSize() {
        return portionSize;
    }

    public void setPortionSize(String portionSize) {
        this.portionSize = portionSize;
    }

    public double getPrice() {
        return price;
    }

    public void setPrice(double price) {
        this.price = price;
    }

    public MenuItems getMenuItem() {
        return menuItem;
    }

    public void setMenuItem(MenuItems menuItem) {
        this.menuItem = menuItem;
    }
}