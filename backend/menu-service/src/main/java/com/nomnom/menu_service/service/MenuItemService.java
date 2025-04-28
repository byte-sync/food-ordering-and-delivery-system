package com.nomnom.menu_service.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nomnom.menu_service.model.MenuItemPortion;
import com.nomnom.menu_service.model.MenuItems;
import com.nomnom.menu_service.repository.MenuItemPortionRepository;
import com.nomnom.menu_service.repository.MenuItemRepository;
import com.nomnom.menu_service.repository.MenuItemServiceInterface;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class MenuItemService implements MenuItemServiceInterface {


    @Autowired
    private MenuItemRepository ItemRepository;

    @Autowired
    private MenuItemPortionRepository portionRepository;



        @Autowired
        private Cloudinary cloudinary;

        @Override
        public MenuItems saveItem(String itemName, String restaurantId, Double offer, String category, Boolean availabilityStatus,
                                  String description, MultipartFile file, List<MenuItemPortion> portions) throws IOException {
            MenuItems item = new MenuItems();
            item.setRestaurantId(restaurantId);
            item.setItemName(itemName);
            item.setOffer(offer);
            item.setCategory(category);
            item.setAvailabilityStatus(availabilityStatus);
            item.setDescription(description);

            // Upload image to Cloudinary
            if (file != null && !file.isEmpty()) {
                Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
                String imageUrl = (String) uploadResult.get("secure_url"); // Get the public URL
                String imagePublicId = (String) uploadResult.get("public_id"); // Get the public ID

                item.setImageUrl(imageUrl);
                item.setImagePublicId(imagePublicId);
            }

            // Save the MenuItems entity first to generate an ID
            MenuItems savedItem = ItemRepository.save(item);

            // If portions are provided, associate them with the saved MenuItems entity
            if (portions != null && !portions.isEmpty()) {
                for (MenuItemPortion portion : portions) {
                    portion.setMenuItem(savedItem); // Associate the portion with the menu item
                    portionRepository.save(portion); // Save the portion
                }
            }

            Optional<MenuItems> menuItemWithPortions = ItemRepository.findByIdWithPortions(savedItem.getId());
            return menuItemWithPortions.orElse(savedItem); // Return the saved item with portions if available
        }

    @Override
    public List<MenuItems> getAllMenuItems() {
        return ItemRepository.findAll();
    }


    @Override
    public MenuItems getMenuItemById(Long id) {
        return ItemRepository.findByIdWithPortions(id)
                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
    }


    @Override
    @Transactional
    public MenuItems updateMenuItem(Long id, String itemName, Double offer, String category,
                                    Boolean availabilityStatus, String description, MultipartFile file, List<MenuItemPortion> portions) throws IOException {
        // Step 1: Find the menu item by ID
        Optional<MenuItems> optionalItem = ItemRepository.findById(id);

        if (optionalItem.isEmpty()) {
            throw new RuntimeException("Menu item not found with id: " + id);
        }

        // Step 2: Update the menu item fields
        MenuItems item = optionalItem.get();
        item.setItemName(itemName);
        item.setCategory(category);
        item.setOffer(offer);
        item.setAvailabilityStatus(availabilityStatus);
        item.setDescription(description);

        // Step 3: Handle image upload to Cloudinary
        if (file != null && !file.isEmpty()) {
            Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            String imageUrl = (String) uploadResult.get("secure_url");
            String imagePublicId = (String) uploadResult.get("public_id");

            if (item.getImagePublicId() != null) {
                try {
                    cloudinary.uploader().destroy(item.getImagePublicId(), ObjectUtils.emptyMap());
                } catch (Exception e) {
                    System.err.println("Failed to delete old image from Cloudinary: " + e.getMessage());
                }
            }

            item.setImageUrl(imageUrl);
            item.setImagePublicId(imagePublicId);
        }

        // Step 4: Update portions if provided
        if (portions != null) {
            portionRepository.deleteAllByMenuItemId(item.getId()); // Requires a transactional context
            portions.forEach(portion -> {
                portion.setMenuItem(item);
                portionRepository.save(portion);
            });
        }

        // Step 5: Save the updated menu item
        return ItemRepository.save(item);
    }
    @Override
    public List<MenuItemPortion> getPortionsForMenuItem(Long menuItemId) {
        return List.of();
    }

    @Override
    public List<MenuItems> getMenuItemsByRestaurantId(String restaurantId) {
        List<MenuItems> menuItems = ItemRepository.findByRestaurantIdWithPortions(restaurantId);

        if (menuItems.isEmpty()) {
            throw new RuntimeException("No menu items found for restaurant ID: " + restaurantId);
        }

        return menuItems;
    }

    @Override
        public boolean deleteMenuItem(Long id) {
            Optional<MenuItems> optionalItem = ItemRepository.findById(id);
            if (optionalItem.isPresent()) {
                MenuItems item = optionalItem.get();

                // Delete the image from Cloudinary if it exists
                if (item.getImagePublicId() != null) {
                    try {
                        cloudinary.uploader().destroy(item.getImagePublicId(), ObjectUtils.emptyMap());
                    } catch (Exception e) {
                        e.printStackTrace(); // Log the error but continue deletion
                    }
                }

                ItemRepository.deleteById(id);
                return true;
            }
            return false;
        }


    @Override
    public List<MenuItems> getMenuItemsByCategory(String categoryName) {
        List<MenuItems> menuItems = ItemRepository.findByCategory(categoryName);

        if (menuItems.isEmpty()) {
            throw new RuntimeException("No menu items found for category: " + categoryName);
        }

        return menuItems;
    }

    @Override
    public List<String> getAllCategories() {
        List<String> categories = ItemRepository.findDistinctCategories();

        if (categories.isEmpty()) {
            throw new RuntimeException("No categories found.");
        }

        return categories;
    }
}



//    @Override
//    public MenuItems getMenuItemById(Long id) {
//        return ItemRepository.findById(id)
//                .orElseThrow(() -> new RuntimeException("Menu item not found with id: " + id));
//    }
//
//
//
//
//    @Override
//    public List<MenuItems> getMenuItemsByRestaurantId(Long restaurantId) {
//        return ItemRepository.findByRestaurantId(restaurantId);
//    }
//
//    @Override
//    public List<MenuItemPortion> getPortionsForMenuItem(Long menuItemId) {
//        System.out.println("Fetching portions for menuItemId: " + menuItemId);
//        List<MenuItemPortion> portions = portionRepository.findByMenuItemId(menuItemId);
//        System.out.println("Portions found: " + portions.size());
//        return portions;

//    }
