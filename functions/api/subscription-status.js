const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

const TRIAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export async function onRequestOptions() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function onRequestPost(context) {
  const { request, env } = context;

  try {
    const body = await request.json().catch(() => ({}));
    const { userId } = body;

    if (!userId || typeof userId !== 'string') {
      return jsonResponse({ error: 'userId é obrigatório' }, 400);
    }

    if (!env.SUBSCRIPTIONS) {
      return jsonResponse({ error: 'KV SUBSCRIPTIONS não configurado' }, 500);
    }

    const kvKey = `sub:${userId}`;
    const now = Date.now();
    let record = await env.SUBSCRIPTIONS.get(kvKey, { type: 'json' });

    // Primeira vez que este usuário é visto: inicia o período de teste de 7 dias.
    if (!record) {
      record = {
        userId,
        trialStart: now,
        plan: null,
        status: 'trial',
        currentPeriodEnd: null,
        lastTransactionNsu: null,
      };
      await env.SUBSCRIPTIONS.put(kvKey, JSON.stringify(record));
    }

    // Se tem assinatura ativa e ainda dentro do período pago, mantém ativo.
    if (record.status === 'active' && record.currentPeriodEnd && now < record.currentPeriodEnd) {
      const daysLeft = Math.max(0, Math.ceil((record.currentPeriodEnd - now) / DAY_MS));
      return jsonResponse({
        status: 'active',
        plan: record.plan,
        daysLeft,
        currentPeriodEnd: record.currentPeriodEnd,
      });
    }

    // Se a assinatura paga expirou (não renovou), volta a bloquear.
    if (record.status === 'active' && record.currentPeriodEnd && now >= record.currentPeriodEnd) {
      record.status = 'expired';
      await env.SUBSCRIPTIONS.put(kvKey, JSON.stringify(record));
      return jsonResponse({ status: 'expired', plan: record.plan, daysLeft: 0, currentPeriodEnd: record.currentPeriodEnd });
    }

    // Ainda em teste: calcula quantos dias restam dos 7 dias grátis.
    const trialEnd = record.trialStart + TRIAL_DAYS * DAY_MS;
    if (now < trialEnd) {
      const daysLeft = Math.max(0, Math.ceil((trialEnd - now) / DAY_MS));
      return jsonResponse({ status: 'trial', plan: null, daysLeft, trialEnd });
    }

    // Teste expirou e nunca houve pagamento (ou pagamento expirado): bloqueia o uso.
    if (record.status !== 'expired') {
      record.status = 'expired';
      await env.SUBSCRIPTIONS.put(kvKey, JSON.stringify(record));
    }
    return jsonResponse({ status: 'expired', plan: record.plan, daysLeft: 0, trialEnd });
  } catch (err) {
    return jsonResponse({ error: 'Erro ao verificar assinatura', details: String(err) }, 500);
  }
}
