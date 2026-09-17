package com.spendwise.service;

import com.spendwise.dto.request.LoginRequest;
import com.spendwise.dto.request.RegisterRequest;
import com.spendwise.dto.response.AuthResponse;
import com.spendwise.entity.User;
import com.spendwise.exception.DuplicateResourceException;
import com.spendwise.exception.InvalidCredentialsException;
import com.spendwise.repository.RefreshTokenRepository;
import com.spendwise.repository.UserRepository;
import com.spendwise.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = User.builder()
                .id(1L)
                .name("Test User")
                .email("test@example.com")
                .password("hashed_password")
                .createdAt(LocalDateTime.now())
                .build();
    }

    @Test
    void register_ShouldReturnAuthResponse_WhenValidRequest() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test User");
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(passwordEncoder.encode(anyString())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtService.generateToken(any())).thenReturn("access_token");

        AuthResponse response = authService.register(request);

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
        assertNotNull(response.getRefreshToken());
        assertEquals("test@example.com", response.getUser().getEmail());
        
        verify(refreshTokenRepository, times(1)).save(any());
    }

    @Test
    void register_ShouldThrowException_WhenEmailExists() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("test@example.com");

        when(userRepository.existsByEmail(anyString())).thenReturn(true);

        assertThrows(DuplicateResourceException.class, () -> authService.register(request));
    }

    @Test
    void login_ShouldReturnAuthResponse_WhenValidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenReturn(null);
        when(userRepository.findByEmail(anyString())).thenReturn(Optional.of(testUser));
        when(jwtService.generateToken(any())).thenReturn("access_token");

        AuthResponse response = authService.login(request);

        assertNotNull(response);
        assertEquals("access_token", response.getAccessToken());
    }

    @Test
    void login_ShouldThrowException_WhenInvalidCredentials() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrong_password");

        when(authenticationManager.authenticate(any(UsernamePasswordAuthenticationToken.class)))
                .thenThrow(new BadCredentialsException("Invalid"));

        assertThrows(InvalidCredentialsException.class, () -> authService.login(request));
    }
}
