# Payflow - Payment System

Sistema de pagamentos digital com arquitetura moderna baseada em microsserviços/módulos, autenticação via Keycloak (OAuth2/OIDC), sessões distribuídas em Redis e frontend React (Vite + Tailwind CSS).

---

## 🏛️ Arquitetura dos Serviços

| Serviço | Tecnologia | Porta Host | Finalidade |
| :--- | :--- | :--- | :--- |
| **frontend** | React 19 + Vite + Nginx | `3000` | Interface web do usuário |
| **payment-system-app** | Spring Boot 4 / Java 21 | `8080` | API REST & Regras de Negócio |
| **keycloak** | Keycloak 24 (Quarkus) | `8081` | Servidor de Identidade (IAM / OAuth2) |
| **payflow-db** | PostgreSQL 15 | `5432` | Banco de dados relacional principal |
| **payflow-redis** | Redis 7 | `6379` | Cache & Sessões distribuídas (Spring Session) |

---

## 💻 1. Ambiente Local de Desenvolvimento

Em desenvolvimento local, a prática recomendada é rodar **apenas a infraestrutura no Docker**, mantendo o Backend e o Frontend rodando diretamente na máquina para habilitar debug e hot-reload rápido:

```bash
# 1. Iniciar banco, redis e keycloak:
docker compose up -d payflow-db keycloak payflow-redis

# 2. Rodar a API Spring Boot (no IntelliJ ou terminal):
./mvnw spring-boot:run

# 3. Rodar o Frontend (em outro terminal):
cd frontend
npm install
npm run dev
```

---

## 🚀 2. Guia de Deploy em Produção (AWS)

Sempre que você fizer alterações no código e quiser subir uma nova versão para o servidor da AWS (`54.163.41.195`), siga o roteiro abaixo.

### 📦 Cenário A: Você alterou o Backend (Java / Spring Boot)

#### No seu computador (Laptop):
1. **Gere a nova versão da imagem Docker** (suba a tag, ex: `v2`, `v3`):
   ```bash
   docker build --platform linux/amd64 -t albertomjunior/payflow-app:v2 .
   ```

2. **Envie para o Docker Hub:**
   ```bash
   docker push albertomjunior/payflow-app:v2
   ```

#### No servidor AWS (via SSH):
3. **Acesse o servidor e a pasta do app:**
   ```bash
   ssh ubuntu@54.163.41.195
   cd ~/app
   ```

4. **Atualize a tag no `.env`:**
   Abra o `.env` (`nano .env`) e altere:
   ```dotenv
   PAYFLOW_APP_IMAGE=albertomjunior/payflow-app:v2
   ```

5. **Baixe e reinicie apenas o container da API:**
   ```bash
   docker compose pull payment-system-app
   docker compose up -d payment-system-app
   ```
   *(O banco, redis e keycloak continuam rodando sem interrupção).*

6. **Verifique os logs de inicialização:**
   ```bash
   docker compose logs -f payment-system-app
   ```

---

### 🎨 Cenário B: Você alterou o Frontend (React / Vite)

#### No seu computador (Laptop):
1. **Gere a nova versão da imagem do Frontend:**
   ```bash
   docker build --platform linux/amd64 -t albertomjunior/payflow-frontend:v2 ./frontend
   ```

2. **Envie para o Docker Hub:**
   ```bash
   docker push albertomjunior/payflow-frontend:v2
   ```

#### No servidor AWS (via SSH):
3. **Acesse o servidor:**
   ```bash
   ssh ubuntu@54.163.41.195
   cd ~/app
   ```

4. **Atualize a tag no `.env`:**
   Abra o `.env` (`nano .env`) e altere:
   ```dotenv
   PAYFLOW_FRONTEND_IMAGE=albertomjunior/payflow-frontend:v2
   ```

5. **Baixe e reinicie apenas o container do frontend:**
   ```bash
   docker compose pull frontend
   docker compose up -d frontend
   ```

---

### ⚙️ Cenário C: Você alterou o `docker-compose.yml` ou scripts de configuração

Se você adicionou novas variáveis, portas ou alterou arquivos de configuração (como `keycloak/` ou `postgres-init/`):

1. **No seu laptop, sincronize os arquivos com a AWS:**
   ```bash
   scp -r docker-compose.yml postgres-init keycloak ubuntu@54.163.41.195:~/app/
   ```

2. **No servidor AWS, aplique as mudanças:**
   ```bash
   docker compose up -d
   ```

---

## ⏪ 3. Procedimento de Rollback (Deu problema? Como voltar atrás)

Se a versão nova (`v2`) apresentar algum bug grave em produção:

1. Acesse o servidor: `ssh ubuntu@54.163.41.195 && cd ~/app`
2. No `.env`, mude a tag de volta para a versão estável anterior (ex: `v1`).
3. Rode o comando de subida:
   ```bash
   docker compose up -d payment-system-app
   # ou
   docker compose up -d frontend
   ```
Em menos de 5 segundos a aplicação volta para a versão anterior estável sem perder dados.

---

## 🛠️ 4. Comandos Úteis de Manutenção no Servidor

```bash
# Ver status de todos os containers
docker compose ps

# Ver consumo de Memória e CPU em tempo real
docker stats

# Ver logs de um serviço específico
docker compose logs -f payment-system-app
docker compose logs -f frontend
docker compose logs -f keycloak

# Liberar espaço em disco (apagar imagens antigas e não utilizadas)
docker system prune -f

# Reiniciar todos os serviços
docker compose restart
```
