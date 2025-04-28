package com.nomnom.menu_service.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.nomnom.menu_service.model.Category;
import com.nomnom.menu_service.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private Cloudinary cloudinary;

    /**
     * Add a new category with an image.
     */
    public Category addCategory(String categoryName, MultipartFile imageFile) throws IOException {
        // Upload the image to Cloudinary
        Map<?, ?> uploadResult = cloudinary.uploader().upload(imageFile.getBytes(), ObjectUtils.emptyMap());
        String imageUrl = (String) uploadResult.get("url");
        String imagePublicId = (String) uploadResult.get("public_id");

        // Save the category with the image URL and public ID
        Category category = new Category(categoryName, imageUrl, imagePublicId);
        return categoryRepository.save(category);
    }

    /**
     * Get all categories.
     */
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    /**
     * Check if a category exists by name.
     */
    public boolean categoryExists(String categoryName) {
        return categoryRepository.findByName(categoryName).isPresent();
    }
}