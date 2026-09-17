package com.spendwise.service;

import com.spendwise.dto.request.CreateCategoryRequest;
import com.spendwise.dto.request.UpdateCategoryRequest;
import com.spendwise.dto.response.CategoryResponse;
import com.spendwise.entity.Category;
import com.spendwise.entity.User;
import com.spendwise.exception.DuplicateResourceException;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.repository.CategoryRepository;
import com.spendwise.security.SecurityUtils;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final SecurityUtils securityUtils;

    @Transactional
    public CategoryResponse createCategory(CreateCategoryRequest request) {
        User currentUser = securityUtils.getCurrentUser();

        if (categoryRepository.existsByNameAndUserId(request.getName(), currentUser.getId())) {
            throw new DuplicateResourceException("Category with name '" + request.getName() + "' already exists");
        }

        Category category = Category.builder()
                .name(request.getName())
                .description(request.getDescription())
                .user(currentUser)
                .build();

        Category savedCategory = categoryRepository.save(category);
        return mapToResponse(savedCategory);
    }

    @Transactional
    public List<CategoryResponse> getCategories() {
        User currentUser = securityUtils.getCurrentUser();
        List<Category> categories = categoryRepository.findByUserId(currentUser.getId());
        
        if (categories.isEmpty()) {
            List<String> defaultCategories = java.util.Arrays.asList(
                "Food & Dining", "Transportation", "Housing", "Utilities", 
                "Healthcare", "Entertainment", "Shopping", "Personal Care", "Education"
            );
            
            categories = defaultCategories.stream().map(name -> {
                Category category = Category.builder()
                        .name(name)
                        .user(currentUser)
                        .build();
                return categoryRepository.save(category);
            }).collect(Collectors.toList());
        }
        
        return categories.stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CategoryResponse getCategoryById(Long id) {
        Category category = getCategoryEntityById(id);
        return mapToResponse(category);
    }

    @Transactional
    public CategoryResponse updateCategory(Long id, UpdateCategoryRequest request) {
        Category category = getCategoryEntityById(id);

        if (!category.getName().equals(request.getName()) &&
                categoryRepository.existsByNameAndUserId(request.getName(), category.getUser().getId())) {
            throw new DuplicateResourceException("Category with name '" + request.getName() + "' already exists");
        }

        category.setName(request.getName());
        category.setDescription(request.getDescription());

        Category updatedCategory = categoryRepository.save(category);
        return mapToResponse(updatedCategory);
    }

    @Transactional
    public void deleteCategory(Long id) {
        Category category = getCategoryEntityById(id);
        categoryRepository.delete(category);
    }

    public Category getCategoryEntityById(Long id) {
        User currentUser = securityUtils.getCurrentUser();
        return categoryRepository.findByIdAndUserId(id, currentUser.getId())
                .orElseThrow(() -> new ResourceNotFoundException("Category not found or does not belong to you"));
    }

    private CategoryResponse mapToResponse(Category category) {
        return CategoryResponse.builder()
                .id(category.getId())
                .name(category.getName())
                .description(category.getDescription())
                .createdAt(category.getCreatedAt())
                .build();
    }
}
