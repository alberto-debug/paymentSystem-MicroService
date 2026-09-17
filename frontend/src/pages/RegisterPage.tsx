import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  ArrowRight, 
  User, 
  Mail, 
  FileText, 
  Calendar, 
  Lock, 
  AlertCircle, 
  CheckCircle2, 
  Loader2,
  Building2,
  Wallet
} from 'lucide-react';
import { authService } from '../api/auth';
import { ApiError } from '../api/client';
import confetti from 'canvas-confetti';

export const RegisterPage: React.FC = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    documentNumber: '',
    birthDate: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const formatDocument = (val: string) => {
    const raw = val.replace(/\D/g, '');
    if (raw.length <= 11) {
      return raw
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    return raw.slice(0, 14);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === 'documentNumber') {
      setFormData(prev => ({ ...prev, [name]: formatDocument(value) }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    if (fieldErrors[name]) {
      setFieldErrors(prev => {
        const updated = { ...prev };
        delete updated[name];
        return updated;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneralError(null);
    setFieldErrors({});

    try {
      await authService.register({
        fullName: formData.fullName.trim(),
        email: formData.email.trim(),
        documentNumber: formData.documentNumber.replace(/\D/g, ''),
        birthDate: formData.birthDate,
        password: formData.password,
      });

      setIsSuccess(true);
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#2563EB', '#1D4ED8', '#60A5FA']
      });

      setTimeout(() => {
        authService.redirectToLogin();
      }, 2200);

    } catch (err) {
      if (err instanceof ApiError) {
        if (err.problem.errors) {
          setFieldErrors(err.problem.errors);
        } else {
          setGeneralError(err.problem.detail || err.problem.title || 'Falha ao processar abertura de conta.');
        }
      } else {
        setGeneralError('Não foi possível conectar ao servidor. Verifique os serviços.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col justify-between">
      <header className="h-14 bg-white border-b border-slate-300 px-6 sm:px-12 flex items-center justify-between">
        <div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Payflow <span className="text-[#2563EB]">Wallet</span>
          </span>
        </div>

        <button
          onClick={() => authService.redirectToLogin()}
          className="text-xs font-semibold text-slate-700 hover:text-slate-950 px-4 py-2 rounded-full border border-slate-300 hover:bg-slate-50 transition-colors flex items-center gap-2 cursor-pointer"
        >
          <span>Já tem conta? Entrar</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </header>

      {/* Container Central com formulário minimalista estilo Nike */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="bg-white p-6 sm:p-8 rounded-2xl">
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8"
                >
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-900">
                    <CheckCircle2 className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Conta Criada!</h2>
                  <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                    Sua conta foi registrada com sucesso. Redirecionando para autenticação...
                  </p>
                  <div className="inline-flex items-center gap-2 text-slate-900 text-xs font-bold px-4 py-2 rounded-full bg-slate-100">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Iniciando Sessão</span>
                  </div>
                </motion.div>
              ) : (
                <div key="form">
                  <div className="mb-8">
                    <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Criar Conta</h1>
                    <p className="text-sm text-slate-500 mt-1">Preencha seus dados para começar.</p>
                  </div>

                  {generalError && (
                    <div className="mb-5 p-3.5 rounded-lg bg-red-50 border border-red-200 flex items-start gap-3">
                      <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                      <p className="text-xs text-red-700 leading-relaxed">{generalError}</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Nome Completo</label>
                      <div className="relative">
                        <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          name="fullName"
                          value={formData.fullName}
                          onChange={handleChange}
                          placeholder="Alberto Júnior"
                          required
                          className={`w-full pl-10 pr-4 py-2.5 bg-white border ${fieldErrors.fullName ? 'border-red-400' : 'border-slate-300'} rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all`}
                        />
                      </div>
                      {fieldErrors.fullName && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.fullName}</p>}
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">E-mail</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="alberto@exemplo.com"
                          required
                          className={`w-full pl-10 pr-4 py-2.5 bg-white border ${fieldErrors.email ? 'border-red-400' : 'border-slate-300'} rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all`}
                        />
                      </div>
                      {fieldErrors.email && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.email}</p>}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">CPF / Documento</label>
                        <div className="relative">
                          <FileText className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            name="documentNumber"
                            value={formData.documentNumber}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            required
                            className={`w-full pl-10 pr-4 py-2.5 bg-white border ${fieldErrors.documentNumber ? 'border-red-400' : 'border-slate-300'} rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all`}
                          />
                        </div>
                        {fieldErrors.documentNumber && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.documentNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Data de Nascimento</label>
                        <div className="relative">
                          <Calendar className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                          <input
                            type="date"
                            name="birthDate"
                            value={formData.birthDate}
                            onChange={handleChange}
                            required
                            className={`w-full pl-10 pr-4 py-2.5 bg-white border ${fieldErrors.birthDate ? 'border-red-400' : 'border-slate-300'} rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all`}
                          />
                        </div>
                        {fieldErrors.birthDate && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.birthDate}</p>}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">Senha</label>
                      <div className="relative">
                        <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          placeholder="Mínimo 8 caracteres"
                          required
                          minLength={8}
                          className={`w-full pl-10 pr-4 py-2.5 bg-white border ${fieldErrors.password ? 'border-red-400' : 'border-slate-300'} rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-[#2563EB] transition-all`}
                        />
                      </div>
                      {fieldErrors.password && <p className="text-[11px] text-red-500 mt-1">{fieldErrors.password}</p>}
                    </div>

                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 text-white font-bold text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-md shadow-blue-500/20 cursor-pointer"
                      >
                        {loading ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processando...</span>
                          </>
                        ) : (
                          <>
                            <span>Finalizar Cadastro</span>
                            <ArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        Payflow Digital Wallet © 2026 — Segurança OIDC & Redis Session
      </footer>
    </div>
  );
};
