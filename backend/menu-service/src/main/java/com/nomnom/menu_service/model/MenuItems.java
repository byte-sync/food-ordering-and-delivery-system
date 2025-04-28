package com.nomnom.menu_service.model;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "menu_items")
public class MenuItems {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String restaurantId;

    private String itemName;

    private String description;

    private String category;

    private Boolean availabilityStatus;

    @Column(nullable = true)
    private double offer;

    @Column(nullable = true)
    private String imageUrl; // Stores the Cloudinary public URL

    @Column(nullable = true)
    private String imagePublicId; // Stores the Cloudinary public ID for future reference

    @OneToMany(mappedBy = "menuItem", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private List<MenuItemPortion> portions;

    // Default constructor
    public MenuItems() {}

    // Parameterized constructor
    public MenuItems(String itemName, double offer, String category,String restaurantId, Boolean availabilityStatus,
                     String description, String imageUrl, String imagePublicId) {
        this.itemName = itemName;
        this.offer = offer;
        this.category = category;
        this.availabilityStatus = availabilityStatus;
        this.description = description;
        this.imageUrl = imageUrl;
        this.imagePublicId = imagePublicId;
        this.restaurantId = restaurantId;
    }

    // Getters and Setters

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getRestaurantId() {
        return restaurantId;
    }

    public void setRestaurantId(String restaurantId) {
        this.restaurantId = restaurantId;
    }

    public String getItemName() {
        return itemName;
    }

    public void setItemName(String itemName) {
        this.itemName = itemName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Boolean getAvailabilityStatus() {
        return availabilityStatus;
    }

    public void setAvailabilityStatus(Boolean availabilityStatus) {
        this.availabilityStatus = availabilityStatus;
    }

    public double getOffer() {
        return offer;
    }

    public void setOffer(double offer) {
        this.offer = offer;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public String getImagePublicId() {
        return imagePublicId;
    }

    public void setImagePublicId(String imagePublicId) {
        this.imagePublicId = imagePublicId;
    }

    public List<MenuItemPortion> getPortions() {
        return portions;
    }

    public void setPortions(List<MenuItemPortion> portions) {
        this.portions = portions;
    }
}