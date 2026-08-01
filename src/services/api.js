// Cliente de API do Motor IA — fala com as Cloudflare Pages Functions em /functions/api

async function request(path, options = {}) {
  const res = await fetch(path, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "Erro na requisição");
  }
  return data;
}

export function registrar(name, email, password, cpf) {
  return request("/api/auth-register", {
    method: "POST",
    body: JSON.stringify({ name, email, password, cpf }),
  });
}

export function entrar(email, password) {
  return request("/api/auth-login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function sair() {
  return request("/api/auth-logout", { method: "POST" });
}

export async function buscarUsuarioLogado() {
  const data = await request("/api/auth-me");
  return data.user;
}

export async function listarTransacoes() {
  const data = await request("/api/transactions");
  return data.transactions || [];
}

export function criarTransacao(transacao) {
  return request("/api/transactions", {
    method: "POST",
    body: JSON.stringify(transacao),
  });
}
