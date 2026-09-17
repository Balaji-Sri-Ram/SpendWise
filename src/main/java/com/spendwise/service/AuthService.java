package com.spendwise.service;

import com.spendwise.dto.request.LoginRequest;
import com.spendwise.dto.request.RegisterRequest;
import com.spendwise.dto.request.TokenRequest;
import com.spendwise.dto.response.AuthResponse;
import com.spendwise.dto.response.UserResponse;
import com.spendwise.entity.RefreshToken;
import com.spendwise.entity.User;
import com.spendwise.exception.DuplicateResourceException;
import com.spendwise.exception.InvalidCredentialsException;
import com.spendwise.exception.ResourceNotFoundException;
import com.spendwise.exception.TokenException;
import com.spendwise.repository.RefreshTokenRepository;
import com.spendwise.repository.UserRepository;
import com.spendwise.security.CustomUserDetails;
import com.spendwise.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Value("${jwt.refresh.expiration:604800000}")
    private long refreshTokenDurationMs;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .build();

        user = userRepository.save(user);

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse login(LoginRequest request) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );
        } catch (BadCredentialsException e) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return generateAuthResponse(user);
    }

    @Transactional
    public AuthResponse refreshToken(TokenRequest request) {
        String rawToken = request.getRefreshToken();
        String tokenHash = hashToken(rawToken);

        RefreshToken refreshToken = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new TokenException("Invalid refresh token"));

        if (refreshToken.isRevoked()) {
            throw new TokenException("Refresh token is revoked");
        }

        if (refreshToken.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshToken.setRevoked(true);
            refreshTokenRepository.save(refreshToken);
            throw new TokenException("Refresh token was expired. Please make a new signin request");
        }

        User user = refreshToken.getUser();
        
        // Revoke the old refresh token and generate a new pair
        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);

        return generateAuthResponse(user);
    }
    
    @Transactional
    public void logout(TokenRequest request) {
        String rawToken = request.getRefreshToken();
        String tokenHash = hashToken(rawToken);

        refreshTokenRepository.findByTokenHash(tokenHash)
                .ifPresent(token -> {
                    token.setRevoked(true);
                    refreshTokenRepository.save(token);
                });
    }

    private AuthResponse generateAuthResponse(User user) {
        CustomUserDetails userDetails = new CustomUserDetails(user);
        String jwtToken = jwtService.generateToken(userDetails);
        
        String rawRefreshToken = UUID.randomUUID().toString() + "-" + UUID.randomUUID().toString();
        String tokenHash = hashToken(rawRefreshToken);
        
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .tokenHash(tokenHash)
                .expiryDate(LocalDateTime.now().plusNanos(refreshTokenDurationMs * 1_000_000))
                .revoked(false)
                .build();
                
        refreshTokenRepository.save(refreshToken);

        UserResponse userResponse = UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .createdAt(user.getCreatedAt())
                .build();

        return AuthResponse.builder()
                .accessToken(jwtToken)
                .refreshToken(rawRefreshToken)
                .user(userResponse)
                .build();
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            return Base64.getEncoder().encodeToString(hash);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Failed to hash token", e);
        }
    }
}
