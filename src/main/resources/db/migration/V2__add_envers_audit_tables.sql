CREATE SEQUENCE IF NOT EXISTS revinfo_seq START WITH 1 INCREMENT BY 50;

CREATE TABLE revinfo
    (
        rev BIGINT NOT NULL,
        revtstmp BIGINT,
        CONSTRAINT pk_revinfo primary key (rev)
);


CREATE TABLE users_aud
(
    id              UUID NOT NULL,
    rev             TIMESTAMP WITH TIME ZONE NOT NULL,
    revtype         SMALLINT,
    keycloak_id     VARCHAR(255),
    email           VARCHAR(255),
    full_name       VARCHAR(150),
    document_number VARCHAR(20),
    birth_date      date,
    user_status     VARCHAR(255),
    created_at      TIMESTAMP(6) WITHOUT TIME ZONE,
    updated_at      TIMESTAMP(6) WITHOUT TIME ZONE,
    last_login      TIMESTAMP(6) WITHOUT TIME ZONE,
    CONSTRAINT pk_users_aud PRIMARY KEY (id, rev)
);

CREATE TABLE wallets_aud
(
    id         UUID NOT NULL,
    rev             TIMESTAMP WITH TIME ZONE NOT NULL,
    revtype    SMALLINT,
    user_id    UUID,
    balance    DECIMAL(19, 4),
    created_at TIMESTAMP(6) WITHOUT TIME ZONE,
    updated_at TIMESTAMP(6) WITHOUT TIME ZONE,
    CONSTRAINT pk_wallets_aud PRIMARY KEY (id, rev)
);
