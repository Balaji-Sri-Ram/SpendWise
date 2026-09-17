package com.spendwise.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TokenRequest {
    @NotBlank(message = "Refresh token must not be blank")
    private String refreshToken;
}
