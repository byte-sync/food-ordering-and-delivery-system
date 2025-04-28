package com.nomnom.menu_service.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nomnom.menu_service.model.MenuItemPortion;
import com.nomnom.menu_service.model.MenuItems;
import com.nomnom.menu_service.repository.MenuItemServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/menu")
public class MenuController {

    @Autowired
    private MenuItemServiceInterface menuService; // Use the interface here

    /**
     * Add a new menu item.
     */
    @PostMapping(value = "/add", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItems> addMenu(
            @RequestParam("itemName") String itemName,
            @RequestParam("restaurantId") String restaurantId,
            @RequestParam("category") String category,
            @RequestParam("availabilityStatus") Boolean availabilityStatus,
            @RequestParam("description") String description,
            @RequestParam("offer") Double offer,
            @RequestParam("image") MultipartFile file,
            @RequestParam("portions") String portionsJson) throws IOException {

        // Convert JSON string to List<MenuItemPortion>
        ObjectMapper objectMapper = new ObjectMapper();
        List<MenuItemPortion> portions = objectMapper.readValue(
                portionsJson,
                objectMapper.getTypeFactory().constructCollectionType(List.class, MenuItemPortion.class)
        );

        // Save the menu item with the uploaded image
        MenuItems menuItem = menuService.saveItem(itemName, restaurantId, offer, category, availabilityStatus, description, file, portions);
        return ResponseEntity.ok(menuItem);
    }

    /**
     * Get all portions for a specific menu item.
     */
    @GetMapping("/portions/{menuItemId}")
    public ResponseEntity<List<MenuItemPortion>> getPortionsForMenuItem(@PathVariable Long menuItemId) {
        List<MenuItemPortion> portions = menuService.getPortionsForMenuItem(menuItemId);
        if (portions.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(portions);
    }

    /**
     * Get all menu items.
     */
    @GetMapping("/all")
    public ResponseEntity<List<MenuItems>> getMenuItems() {
        List<MenuItems> menuItems = menuService.getAllMenuItems();
        if (menuItems.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(menuItems);
    }

    /**
     * Get a menu item by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<MenuItems> getMenuItemById(@PathVariable Long id) {
        try {
            MenuItems menuItem = menuService.getMenuItemById(id);
            return ResponseEntity.ok(menuItem);
        } catch (RuntimeException e) {
            // Handle the case where the menu item is not found
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * Update a menu item.
     */
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<MenuItems> updateMenuItem(
            @PathVariable Long id,
            @RequestParam("itemName") String itemName,
            @RequestParam("category") String category,
            @RequestParam("availabilityStatus") Boolean availabilityStatus,
            @RequestParam("description") String description,
            @RequestParam("offer") Double offer,
            @RequestParam(value = "image", required = false) MultipartFile file,
            @RequestParam("portions") String portionsJson) throws IOException {

        // Convert JSON string to List<MenuItemPortion>
        ObjectMapper objectMapper = new ObjectMapper();
        List<MenuItemPortion> portions = objectMapper.readValue(
                portionsJson,
                objectMapper.getTypeFactory().constructCollectionType(List.class, MenuItemPortion.class)
        );

        // Call the service layer to update the menu item
        MenuItems updatedItem = menuService.updateMenuItem(id, itemName, offer, category, availabilityStatus, description, file, portions);

        return ResponseEntity.ok(updatedItem);
    }
    /**
     * Delete a menu item by ID.
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteMenuItem(@PathVariable Long id) {
        boolean deleted = menuService.deleteMenuItem(id);
        if (deleted) {
            return ResponseEntity.ok("Menu item deleted successfully.");
        } else {
            return ResponseEntity.status(404).body("Menu item not found.");
        }
    }

    /**
     * Get all menu items for a specific restaurant.
     */
    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<List<MenuItems>> getMenuItemsByRestaurantId(@PathVariable String restaurantId) {
        try {
            List<MenuItems> menuItems = menuService.getMenuItemsByRestaurantId(restaurantId);

            if (menuItems.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 No Content if no items found
            }

            return ResponseEntity.ok(menuItems); // Return 200 OK with the list of menu items
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null); // Return 404 Not Found if no menu items exist for the restaurant
        }
    }


    @GetMapping("/category/{categoryName}")
    public ResponseEntity<List<MenuItems>> getMenuItemsByCategory(@PathVariable String categoryName) {
        try {
            List<MenuItems> menuItems = menuService.getMenuItemsByCategory(categoryName);

            if (menuItems.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 No Content if no items found
            }

            return ResponseEntity.ok(menuItems); // Return 200 OK with the list of menu items
        } catch (RuntimeException e) {
            return ResponseEntity.status(404).body(null); // Return 404 Not Found if no menu items exist for the category
        }
    }

    /**
     * Get all unique categories.
     */
    @GetMapping("/categories")
    public ResponseEntity<List<String>> getAllCategories() {
        try {
            List<String> categories = menuService.getAllCategories();

            if (categories.isEmpty()) {
                return ResponseEntity.noContent().build(); // Return 204 No Content if no categories found
            }

            return ResponseEntity.ok(categories); // Return 200 OK with the list of unique categories
        } catch (RuntimeException e) {
            return ResponseEntity.status(500).body(null); // Return 500 Internal Server Error if an exception occurs
        }
    }
}
/**
 * Get all menu items for a specific category.
 */

