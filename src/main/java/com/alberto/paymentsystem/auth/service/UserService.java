package com.alberto.paymentsystem.auth.service;

import com.alberto.paymentsystem.auth.DTO.RegisterUserRequest;
import com.alberto.paymentsystem.auth.DTO.UserResponse;
import com.alberto.paymentsystem.auth.model.User;
import com.alberto.paymentsystem.auth.model.UserStatus;
import com.alberto.paymentsystem.auth.model.Wallet;
import com.alberto.paymentsystem.auth.repository.userRepository;
import com.alberto.paymentsystem.auth.repository.walletRepository;
import com.alberto.paymentsystem.infra.KeycloakService;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final userRepository userRepository;
    private final KeycloakService keycloakService;
    private final walletRepository walletRepository;


    @Transactional
    public UserResponse register(RegisterUserRequest request){

        // 1. Validação prévia de duplicidade no banco local
        if (userRepository.existsByEmail(request.email())){
            throw new IllegalArgumentException("E-mail já cadastrado no sistema: " + request.email());
        }

        if (userRepository.existsByDocumentNumber(request.documentNumber())){
            throw new IllegalArgumentException("Documento já cadastrado no sistema: " + request.documentNumber());
        }

        String keycloakId = null;

        try {
            keycloakId = keycloakService.createUser(
                    request.email(),
                    request.email(),
                    request.fullName(),
                    request.password()
            );

            User user = new User();
            user.setKeycloakId(keycloakId);
            user.setEmail(request.email());
            user.setFullName(request.fullName());
            user.setDocumentNumber(request.documentNumber());
            user.setBirthDate(request.birthDate());
            user.setUserStatus(UserStatus.ACTIVE);

            User savedUser = userRepository.save(user);

            Wallet wallet = new Wallet(savedUser);
            walletRepository.save(wallet);

            return new UserResponse(
                    savedUser.getId(),
                    savedUser.getFullName(),
                    savedUser.getEmail(),
                    savedUser.getDocumentNumber(),
                    savedUser.getUserStatus(),
                    savedUser.getCreateAt()
            );
        } catch (Exception ex) {
            // 5. Compensação SAGA: Se falhar após criar no Keycloak, desfaz no Keycloak
            if (keycloakId != null) {
                log.warn("Falha na persistência local. Disparando rollback SAGA no Keycloak para ID: {}", keycloakId);
                try {
                    keycloakService.deleteUser(keycloakId);
                } catch (Exception sagaEx) {
                    log.error("Erro crítico na compensação SAGA ao deletar usuário {}: {}", keycloakId, sagaEx.getMessage(), sagaEx);
                }
            }
            throw ex;
        }

    }
}
