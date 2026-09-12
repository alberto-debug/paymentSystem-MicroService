package com.alberto.paymentsystem.auth.service;

import com.alberto.paymentsystem.auth.DTO.RegisterUserRequest;
import com.alberto.paymentsystem.auth.DTO.UserResponse;
import com.alberto.paymentsystem.auth.model.User;
import com.alberto.paymentsystem.auth.model.UserStatus;
import com.alberto.paymentsystem.auth.model.Wallet;
import com.alberto.paymentsystem.auth.repository.UserRepository;
import com.alberto.paymentsystem.auth.repository.WalletRepository;
import com.alberto.paymentsystem.core.exception.ResourceConflictException;
import com.alberto.paymentsystem.core.exception.ResourceNotFoundException;
import com.alberto.paymentsystem.infra.KeycloakService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.support.TransactionTemplate;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final WalletRepository walletRepository;
    private final KeycloakService keycloakService;
    private final TransactionTemplate transactionTemplate;

    public UserResponse register(RegisterUserRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new ResourceConflictException("E-mail já cadastrado: " + request.email());
        }

        if (userRepository.existsByDocumentNumber(request.documentNumber())) {
            throw new ResourceConflictException("Documento já cadastrado: " + request.documentNumber());
        }

        String keycloakId = null;

        try {
            keycloakId = keycloakService.createUser(
                    request.email(),
                    request.email(),
                    request.fullName(),
                    request.password()
            );

            final String finalKeycloakId = keycloakId;
            User savedUser = transactionTemplate.execute(status -> {
                User user = new User();
                user.setKeycloakId(finalKeycloakId);
                user.setEmail(request.email());
                user.setFullName(request.fullName());
                user.setDocumentNumber(request.documentNumber());
                user.setBirthDate(request.birthDate());
                user.setUserStatus(UserStatus.ACTIVE);

                User persisted = userRepository.save(user);
                walletRepository.save(new Wallet(persisted));
                return persisted;
            });

            return new UserResponse(
                    savedUser.getId(),
                    savedUser.getFullName(),
                    savedUser.getEmail(),
                    savedUser.getDocumentNumber(),
                    savedUser.getUserStatus(),
                    savedUser.getCreateAt()
            );
        } catch (Exception ex) {
            if (keycloakId != null) {
                log.warn("Rollback no Keycloak acionado devido a falha na persistência local para ID: {}", keycloakId);
                try {
                    keycloakService.deleteUser(keycloakId);
                } catch (Exception sagaEx) {
                    log.error("Falha crítica ao compensar usuário no Keycloak [ID: {}]", keycloakId, sagaEx);
                }
            }
            throw ex;
        }
    }
}
