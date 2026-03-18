const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ContactData {
  name: string;
  email: string;
  phone?: string;
  service?: string;
  message: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: ContactData = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    const { name, email, phone, service, message } = data;

    // 1. Send notification to Edgar
    const notificationHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E2E8F0; padding: 32px; border-radius: 12px;">
        <div style="border-bottom: 2px solid #F59E0B; padding-bottom: 16px; margin-bottom: 24px;">
          <h1 style="color: #F59E0B; font-size: 22px; margin: 0;">🔔 Novo Contato pelo Site</h1>
        </div>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 8px 0; color: #94A3B8; width: 120px;">Nome:</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
          <tr><td style="padding: 8px 0; color: #94A3B8;">E-mail:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #F59E0B;">${email}</a></td></tr>
          ${phone ? `<tr><td style="padding: 8px 0; color: #94A3B8;">Telefone:</td><td style="padding: 8px 0;"><a href="https://wa.me/55${phone.replace(/\D/g, '')}" style="color: #F59E0B;">${phone}</a></td></tr>` : ''}
          ${service ? `<tr><td style="padding: 8px 0; color: #94A3B8;">Serviço:</td><td style="padding: 8px 0;">${service}</td></tr>` : ''}
        </table>
        <div style="margin-top: 20px; padding: 16px; background: #161B22; border-left: 3px solid #F59E0B; border-radius: 6px;">
          <p style="color: #94A3B8; font-size: 12px; margin: 0 0 8px; text-transform: uppercase;">Mensagem</p>
          <p style="margin: 0; line-height: 1.6;">${message}</p>
        </div>
        <p style="margin-top: 24px; font-size: 12px; color: #4A5568;">Enviado pelo site engenheiroedgar.com.br</p>
      </div>
    `;

    const notifRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Engenheiro Edgar <contato@engenheiroedgar.com.br>',
        to: ['edgarkmiecik80@gmail.com'],
        subject: `🔔 Novo contato: ${name}${service ? ` — ${service}` : ''}`,
        html: notificationHtml,
      }),
    });

    if (!notifRes.ok) {
      const err = await notifRes.text();
      console.error('Resend notification error:', err);
    }

    // 2. Send confirmation to the person
    const confirmHtml = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #0D1117; color: #E2E8F0; padding: 32px; border-radius: 12px;">
        <div style="text-align: center; padding-bottom: 24px; border-bottom: 2px solid #F59E0B; margin-bottom: 24px;">
          <h1 style="color: #F59E0B; font-size: 24px; margin: 0;">Engenheiro Edgar</h1>
          <p style="color: #94A3B8; margin: 8px 0 0; font-size: 14px;">Engenheiro Civil — CREA-RS 243302</p>
        </div>
        <h2 style="color: #F1F5F9; font-size: 20px;">Olá, ${name}! ✅</h2>
        <p style="line-height: 1.7; color: #CBD5E1;">
          Recebi sua mensagem e retornarei o mais breve possível. Caso prefira, pode entrar em contato diretamente:
        </p>
        <div style="margin: 20px 0; padding: 16px; background: #161B22; border-radius: 8px; text-align: center;">
          <a href="https://wa.me/5554999787256" style="display: inline-block; padding: 12px 24px; background: #F59E0B; color: #0D1117; font-weight: 700; text-decoration: none; border-radius: 8px;">
            💬 Chamar no WhatsApp
          </a>
        </div>
        <p style="font-size: 13px; color: #4A5568; text-align: center; margin-top: 24px;">
          Engenheiro Edgar — Carazinho/RS<br/>
          contato@engenheiroedgar.com.br
        </p>
      </div>
    `;

    const confirmRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Engenheiro Edgar <contato@engenheiroedgar.com.br>',
        to: [email],
        subject: '✅ Edgar recebeu sua mensagem — Engenheiro Edgar',
        html: confirmHtml,
      }),
    });

    if (!confirmRes.ok) {
      const err = await confirmRes.text();
      console.error('Resend confirmation error:', err);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
