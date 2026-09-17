import React, { useEffect, useState } from 'react';
import { LogOut, Loader2 } from 'lucide-react';
import { authService } from '../api/auth';
import type { UserMeResponse } from '../types/auth';

export const DashboardPage: React.FC = () => {
  const [user, setUser] = useState<UserMeResponse | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const data = await authService.getMe();
      setUser(data);
      setLoading(false);
    } catch {
      authService.redirectToLogin();
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 className="w-8 h-8 text-[#2563EB] animate-spin" />
        <span className="text-xs uppercase font-bold tracking-wider text-slate-600">Autenticando...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <header className="h-14 bg-white border-b border-slate-300 px-6 sm:px-10 flex items-center justify-between z-20 shrink-0">
        <div>
          <span className="text-xl font-extrabold text-slate-900 tracking-tight">
            Payflow <span className="text-[#2563EB]">Wallet</span>
          </span>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-bold text-slate-900">{user?.fullName}</p>
            <p className="text-[11px] text-slate-400">{user?.email}</p>
          </div>
          <button
            onClick={() => authService.logout()}
            className="p-2.5 rounded-full text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 transition-all cursor-pointer shadow-2xs"
            title="Encerrar Sessão"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-4">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Visão Geral
        </h1>
      </main>

      <footer className="py-6 text-center text-xs text-slate-400 border-t border-slate-200/60 bg-white">
        Payflow Digital Wallet © 2026 — Segurança OIDC & Redis Session
      </footer>
    </div>
  );
};
