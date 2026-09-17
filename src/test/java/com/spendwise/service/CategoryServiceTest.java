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
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyLong;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private SecurityUtils securityUtils;

    @InjectMocks
    private CategoryService categoryService;

    private User mockUser;

    @BeforeEach
    void setUp() {
        mockUser = User.builder().id(1L).email("test@example.com").build();
    }

    @Test
    void createCategory_Success() {
        CreateCategoryRequest request = new CreateCategoryRequest();
        request.setName("Food");
        request.setDescription("Food expenses");

        when(securityUtils.getCurrentUser()).thenReturn(mockUser);
        when(categoryRepository.existsByNameAndUserId(anyString(), anyLong())).thenReturn(false);

        Category savedCategory = Category.builder().id(100L).name("Food").description("Food expenses").user(mockUser).build();
        when(categoryRepository.save(any(Category.class))).thenReturn(savedCategory);

        CategoryResponse response = categoryService.createCategory(request);

        assertNotNull(response);
        assertEquals("Food", response.getName());
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void createCategory_DuplicateThrowsException() {
        CreateCategoryRequest request = new CreateCategoryRequest();
        request.setName("Food");

        when(securityUtils.getCurrentUser()).thenReturn(mockUser);
        when(categoryRepository.existsByNameAndUserId("Food", 1L)).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> categoryService.createCategory(request));
    }

    @Test
    void getCategoryEntityById_NotFoundThrowsException() {
        when(securityUtils.getCurrentUser()).thenReturn(mockUser);
        when(categoryRepository.findByIdAndUserId(1L, 1L)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> categoryService.getCategoryEntityById(1L));
    }
}
