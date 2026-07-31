import { hashPassword, createSessionToken } from "../_lib/auth.js";

export async function onRequestPost({ request, env }) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return json({ error: "Preencha nome, e-mail e senha." }, 400);
    }
    if (password.length < 6) {
      return json({ error: "A senha precisa ter pelo menos 6 caracteres." }, 400);
    }

    const emailNorm = email.toLowerCase().trim();

    const existing = await env.DB.prepare("SELECT id FROM users WHERE email = ?")
      .bind(emailNorm)
      .first();
    if (existing) {
      return json({ error: "Já existe uma conta com esse e-mail." }, 409);
    }

    const id = crypto.randomUUID();
    const passwordHash = await hashPassword(password);

    await env.DB.prepare(
      "INSERT INTO users (id, name, email, password_hash) VALUES (?, ?, ?, ?)"
    ).bind(id, name, emailNorm, passwordHash).run();

    const token = await createSessionToken({ sub: id, email: emailNorm }, env.AUTH_SECRET);

    return new Response(JSON.stringify({ id, name, email: emailNorm }), {
      status: 201,
      headers: {
        "Content-Type": "application/json",
        "Set-Cookie": `motoria_session=${token}; HttpOnly; Secure; SameSite=Lax; Path=/; Max-Age=${60 * 60 * 24 * 30}`,
      },
    });
  } catch (err) {
    return json({ error: "Erro ao criar conta: " + err.message }, 500);
  }
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
