<#import "template.ftl" as layout>
<@layout.registrationLayout displayInfo=social.displayInfo displayWide=(realm.password && social.providers??); section>
    <#if section = "form">
        <form id="kc-form-login" onsubmit="login.disabled = true; return true;" action="${url.loginAction}" method="post">
            <div class="form-field-group">
                <label for="username" class="field-label">E-mail ou Usuário</label>
                <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="20" height="16" x="2" y="4" rx="2"></rect>
                        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                    </svg>
                    <input tabindex="1" id="username" class="custom-input" name="username" value="${(login.username!'')}" type="text" autofocus autocomplete="username" placeholder="seuemail@exemplo.com" required />
                </div>
            </div>

            <div class="form-field-group">
                <div class="password-label-row">
                    <label for="password" class="field-label">Senha</label>
                    <#if realm.resetPasswordAllowed>
                        <a tabindex="5" href="${url.loginResetCredentialsUrl}" class="forgot-link">Esqueceu a senha?</a>
                    </#if>
                </div>
                <div class="input-wrapper">
                    <svg class="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                    <input tabindex="2" id="password" class="custom-input" name="password" type="password" autocomplete="current-password" placeholder="Digite sua senha" required />
                </div>
            </div>

            <#if realm.rememberMe && !usernameHidden??>
                <div class="remember-row">
                    <label class="remember-label">
                        <#if login.rememberMe??>
                            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox" checked>
                        <#else>
                            <input tabindex="3" id="rememberMe" name="rememberMe" type="checkbox">
                        </#if>
                        <span>Lembrar de mim</span>
                    </label>
                </div>
            </#if>

            <div class="submit-block">
                <input type="hidden" id="id-hidden-input" name="credentialId" <#if auth.selectedCredential?has_content>value="${auth.selectedCredential}"</#if>/>
                <button tabindex="4" class="btn-submit" name="login" id="kc-login" type="submit">
                    <span>Acessar Painel</span>
                    <svg class="btn-arrow" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M5 12h14"></path>
                        <path d="m12 5 7 7-7 7"></path>
                    </svg>
                </button>
            </div>
        </form>
    </#if>
</@layout.registrationLayout>
