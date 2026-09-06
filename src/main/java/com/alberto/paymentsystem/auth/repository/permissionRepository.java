package com.alberto.paymentsystem.auth.repository;

import com.alberto.paymentsystem.auth.model.Permission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


@Repository
public interface permissionRepository extends JpaRepository<Permission, Long> {
}
