import { getUserFromRequest } from "../_lib/getSession.js";

export async function onRequestGet({ request, env }) {
  const user = await getUserFromRequest(request, env);
  if (!user) return unauthorized();

  const { results } = await env.DB.prepare(
    "SELECT id, date, type, category, amount, note FROM transactions WHERE user_id = ? ORDER BY date DESC, created_at DESC"
  ).bind(user.id).all();

  return json({ transactions: results });
}

export async function onRequestPost({ request, env }) {
  const user = await getUserFromRequest(request, env);
  if (!user) return unauthorized();

  const { date, type, category, amount, note } = await request.json();
  if (!date || !type || amount === undefined || amount === null) {
    return json({ error: "Faltam campos obrigatórios (date, type, amount)." }, 400);
  }
  if (type !== "ganho" && type !== "gasto") {
    return json({ error: "type precisa ser 'ganho' ou 'gasto'." }, 400);
  }

  const id = crypto.randomUUID();
  await env.DB.prepare(
    "INSERT INTO transactions (id, user_id, date, type, category, amount, note) VALUES (?, ?, ?, ?, ?, ?, ?)"
  ).bind(id, user.id, date, type, category || null, Number(amount), note || null).run();

  return json({ id, date, type, category: category || null, amount: Number(amount), note: note || null }, 201);
}

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { "Content-Type": "application/json" } });
}
function unauthorized() {
  return json({ error: "Não autenticado." }, 401);
}
