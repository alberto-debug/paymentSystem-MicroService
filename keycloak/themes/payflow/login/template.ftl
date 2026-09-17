<#macro registrationLayout bodyClass="" displayInfo=false displayMessage=true displayRequiredFields=false showAnotherWayIfPresent=true displayWide=false>
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="utf-8">
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="robots" content="noindex, nofollow">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Payflow Wallet — Autenticação Segura</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
    <#if properties.styles?has_content>
        <#list properties.styles?split(' ') as style>
            <link href="${url.resourcesPath}/${style}" rel="stylesheet" />
        </#list>
    </#if>
</head>

<body>
    <!-- Navbar Institucional Padronizada (h-14, borda sutil, título Payflow Wallet e botão de ação) -->
    <header class="app-header">
        <div class="app-brand">
            Payflow <span>Wallet</span>
        </div>
        <a href="http://localhost:3000/register" class="nav-cta-btn">
            <span>Criar Conta</span>
            <svg class="cta-arrow" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
            </svg>
        </a>
    </header>

    <!-- Main Content com Centralização Exata do Card -->
    <main class="app-main">
        <div class="login-card">
            <div class="card-header-block">
                <h1 class="card-title">Acessar Conta</h1>
                <p class="card-subtitle">Insira suas credenciais para continuar.</p>
            </div>

            <#-- Exibição de Mensagens de Erro ou Alerta do Keycloak -->
            <#if displayMessage && message?has_content && (message.type != 'warning' || !isAppInitiatedAction??)>
                <div class="alert alert-${message.type}">
                    <svg class="alert-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <line x1="12" y1="8" x2="12" y2="12"></line>
                        <line x1="12" y1="16" x2="12.01" y2="16"></line>
                    </svg>
                    <span>${kcSanitize(message.summary)?no_esc}</span>
                </div>
            </#if>

            <#-- Conteúdo do Formulário -->
            <#nested "form">

            <#-- Rodapé do Card com Link Direto para o Cadastro -->
            <div class="card-register-footer">
                <p>Não possui uma conta? <a href="http://localhost:3000/register">Cadastre-se gratuitamente</a></p>
            </div>
        </div>
    </main>

    <!-- Footer Corporativo Padronizado -->
    <footer class="app-footer">
        Payflow Digital Wallet © 2026 — Segurança OIDC & Redis Session
    </footer>
</body>
</html>
</#macro>
