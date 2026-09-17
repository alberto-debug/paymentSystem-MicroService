import type { ProblemDetail } from '../types/auth';

const API_BASE_URL = 'http://localhost:8080';

export class ApiError extends Error {
  problem: ProblemDetail;

  constructor(problem: ProblemDetail) {
    super(problem.detail || problem.title || 'Erro na requisição');
    this.name = 'ApiError';
    this.problem = problem;
  }
}

function getCsrfToken(): string | null {
  const match = document.cookie.match(new RegExp('(^| )XSRF-TOKEN=([^;]+)'));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = new Headers(options.headers || {});

  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  const csrfToken = getCsrfToken();
  if (csrfToken) {
    headers.set('X-XSRF-TOKEN', csrfToken);
  }

  const response = await fetch(url, {
    ...options,
    headers,
    credentials: 'include',
  });

  if (!response.ok) {
    let errorData: ProblemDetail;
    try {
      errorData = await response.json();
    } catch {
      errorData = {
        type: 'https://api.paymentsystem.com/errors/unknown',
        title: response.statusText || 'Erro inesperado',
        status: response.status,
        detail: `Falha ao processar requisição (${response.status})`,
      };
    }
    throw new ApiError(errorData);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}
