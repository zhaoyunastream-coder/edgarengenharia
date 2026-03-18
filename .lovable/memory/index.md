# Memory: index.md
Updated: today

Civil engineering website for Edgar Alexandre Kmiecik, Carazinho/RS, CREA-RS 243302

## Design System
- Theme: Dark "Precision Architecture" — steel/concrete/blueprint aesthetic
- Background: #0A0C0F, Cards: #111318, Accent: amber #F59E0B, Secondary: blue #3B82F6
- Fonts: Bebas Neue (headings), DM Sans (body) via Google Fonts
- All colors defined as HSL in index.css tokens

## Brand
- Name: **ENGENHEIRO Edgar** (renamed from EDGAR Engenharia / EAK Engenharia)
- Email: contato@engenheiroedgar.com.br
- Domain: engenheiroedgar.com.br

## Stack
- React + TypeScript + Vite + Tailwind + Framer Motion
- Supabase (URL: anqvmuufszvjvfnktefe.supabase.co) for blog_posts + contact_submissions
- Supabase anon key stored as VITE_SUPABASE_ANON_KEY
- Resend API for contact email notifications (Edge Function: send-contact-email)

## Routes
- / (landing), /blog (listing), /blog/:slug (detail), /contato (contact form)

## Key Decisions
- All text in Portuguese (Brazil)
- WhatsApp floating button on all pages
- Blueprint grid CSS background pattern
- Supabase tables: blog_posts, contact_submissions with RLS
- Deploy target: Cloudflare Pages (SPA with _redirects)
- Hero stats: only 2 (15+ Anos, 100% Regularizados) — "200+ Projetos" removed
