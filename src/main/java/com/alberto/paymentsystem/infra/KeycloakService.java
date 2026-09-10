package com.alberto.paymentsystem.infra;

import com.alberto.paymentsystem.auth.model.User;
import com.alberto.paymentsystem.core.config.KeycloakAdminConfig;
import jakarta.ws.rs.core.Response;
import lombok.RequiredArgsConstructor;
import org.keycloak.admin.client.CreatedResponseUtil;
import org.keycloak.admin.client.Keycloak;
import org.keycloak.admin.client.resource.UsersResource;
import org.keycloak.representations.idm.CredentialRepresentation;
import org.keycloak.representations.idm.UserRepresentation;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KeycloakService {

    private final Keycloak keycloak;

    @Value("${keycloak.realm}")
    private String realm;

    /**
     * Cria o usuário no Keycloak com credenciais definitivas em uma única chamada.
     *
     * @param username 
     * @param email 
     * @param fullName
     * @param password 
     * @return 
     */

    public String createUser(String username, String email, String fullName, String password){

        UsersResource usersResource = keycloak.realm(realm).users();

        CredentialRepresentation credential = new CredentialRepresentation();
        credential.setType(CredentialRepresentation.PASSWORD);
        credential.setValue(password);
        credential.setTemporary(false);

        String firstName = fullName;
        String lastName = "";

        if (fullName != null && fullName.trim().contains(" ")){
            int firstSpaceIndex= fullName.trim().indexOf(" ");
            firstName = fullName.substring(0, firstSpaceIndex).trim();
            lastName = fullName.substring(firstSpaceIndex).trim();
        }

        UserRepresentation user = new UserRepresentation();
        user.setUsername(username);
        user.setEmail(email);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEnabled(true);
        user.setEmailVerified(true);
        user.setCredentials(List.of(credential));

        try (Response response = usersResource.create(user)){
            if (response.getStatus() == Response.Status.CREATED.getStatusCode()){
                return CreatedResponseUtil.getCreatedId(response);
            } else if (response.getStatus() == Response.Status.CONFLICT.getStatusCode()) {
                throw new RuntimeException("Usuário ou e-mail já existe no Keycloak.");

            } else {
                throw new RuntimeException("Erro ao criar usuário no Keycloak. Status: "
                        + response.getStatus() + " - " + response.getStatusInfo());
            }

        }

    }

    /**
     * Remove o usuário no Keycloak (compensação SAGA em caso de falha no banco local).
     *
     * @param keycloakId identificador único do usuário no Keycloak
     */

    public void deleteUser(String keycloakId){

        try {
            keycloak.realm(realm).users().get(keycloakId).remove();
        } catch (Exception e) {
            throw new RuntimeException("Erro ao compensar/deletar usuário no Keycloak: " + e.getMessage(), e);

        }
    }
}
