package com.alberto.paymentsystem.auth.repository;

import com.alberto.paymentsystem.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface userRepository extends JpaRepository<User, UUID> {

    User findByEmail(String email);
    Optional<User> findByKeycloakId(String keycloakId);
    boolean existsByEmail(String email);
    boolean existsByDocumentNumber(String documentNumber);
}
