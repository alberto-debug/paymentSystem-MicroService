
CREATE TABLE users
(
    id              UUID         NOT NULL,
    keycloak_id     VARCHAR(255) NOT NULL,
    email           VARCHAR(255) NOT NULL,
    full_name       VARCHAR(150) NOT NULL,
    document_number VARCHAR(20)  NOT NULL,
    birth_date      date         NOT NULL,
    user_status     VARCHAR(255) NOT NULL,
    created_at       TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    updated_at      TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    last_login      TIMESTAMP(6) WITHOUT TIME ZONE,
    CONSTRAINT pk_users PRIMARY KEY (id)
);

CREATE TABLE wallets
(
    id         UUID           NOT NULL,
    user_id    UUID           NOT NULL,
    balance    DECIMAL(19, 4) NOT NULL,
    created_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    updated_at TIMESTAMP(6) WITHOUT TIME ZONE NOT NULL,
    CONSTRAINT pk_wallets PRIMARY KEY (id)
);

ALTER TABLE users
    ADD CONSTRAINT uc_users_documentnumber UNIQUE (document_number);

ALTER TABLE users
    ADD CONSTRAINT uc_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uc_users_keycloakid UNIQUE (keycloak_id);

ALTER TABLE wallets
    ADD CONSTRAINT uc_wallets_user UNIQUE (user_id);

ALTER TABLE wallets
    ADD CONSTRAINT FK_WALLETS_ON_USER FOREIGN KEY (user_id) REFERENCES users (id);
