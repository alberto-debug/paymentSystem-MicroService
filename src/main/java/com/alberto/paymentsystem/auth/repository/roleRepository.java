package com.alberto.paymentsystem.auth.repository;

import com.alberto.paymentsystem.auth.model.Role;
import com.alberto.paymentsystem.auth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface roleRepository extends JpaRepository<Role, Long> {

}
