package com.spendwise.controller;

import com.spendwise.dto.request.UpdateUserSettingsRequest;
import com.spendwise.dto.response.UserSettingsResponse;
import com.spendwise.service.SettingsService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/settings")
@RequiredArgsConstructor
public class SettingsController {

    private final SettingsService settingsService;

    @GetMapping
    public ResponseEntity<UserSettingsResponse> getSettings() {
        return ResponseEntity.ok(settingsService.getSettings());
    }

    @PutMapping
    public ResponseEntity<UserSettingsResponse> updateSettings(@Valid @RequestBody UpdateUserSettingsRequest request) {
        return ResponseEntity.ok(settingsService.updateSettings(request));
    }

    @PostMapping("/reset")
    public ResponseEntity<UserSettingsResponse> resetSettings() {
        return ResponseEntity.ok(settingsService.resetSettings());
    }
}
