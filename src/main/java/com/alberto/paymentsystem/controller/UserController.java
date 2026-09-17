package com.alberto.paymentsystem.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.core.oidc.user.OidcUser;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getMe(@AuthenticationPrincipal OidcUser oidcUser) {
        // TODO: Futuramente, usar o UserService para buscar Wallet ou dados estendidos do banco.
        // Por ora, retornamos os claims que vieram no JWT validado e armazenado na sessão.
        return ResponseEntity.ok(Map.of(
                "keycloakId", oidcUser.getSubject(),
                "email", oidcUser.getEmail(),
                "fullName", oidcUser.getFullName() != null ? oidcUser.getFullName() : oidcUser.getPreferredUsername()
        ));
    }
}
