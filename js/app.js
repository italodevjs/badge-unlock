/* ============================================================
   PagFlux — protótipo de gateway de pagamento (dados fictícios)
   ============================================================ */

const BRL = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ---------- Glifos vetoriais (arte própria, sem logo de marca) ---------- */
const GLYPH = {
  pad:  '<path d="M5 8h14a4 4 0 0 1 3.9 3.1l1 4.5A2.9 2.9 0 0 1 18 18l-1.3-1.7a2 2 0 0 0-1.6-.8H8.9a2 2 0 0 0-1.6.8L6 18a2.9 2.9 0 0 1-5.9-2.4l1-4.5A4 4 0 0 1 5 8z"/><circle cx="16" cy="11.5" r="1.1"/><circle cx="18.4" cy="13.4" r="1.1"/><rect x="6" y="10.6" width="3.4" height="1.2" rx=".6"/><rect x="7.2" y="9.4" width="1.2" height="3.4" rx=".6"/>',
  play: '<path d="M8 6.5v11l9-5.5z"/>',
  music:'<path d="M16 4.5l-7 1.6V15a2.6 2.6 0 1 1-1.6-2.4V8.2l8.6-2z"/><circle cx="6" cy="15" r="2.4"/>',
  bag:  '<path d="M8 9V8a4 4 0 0 1 8 0v1h2.4l1 11.5H4.6L5.6 9zm2 0h4V8a2 2 0 0 0-4 0z"/>',
  fire: '<path d="M13 3c2 3 .4 4.6 1.7 6.4C16 8.2 16 6.6 16 6.6c2 2 3 4 3 6.6a7 7 0 1 1-13.9 0c0-3.5 2.4-5.4 3-8 .7 1.2.9 2.4.9 2.4 1-2 1-3.7 1-4.6z"/>',
  car:  '<path d="M5.2 11l1.4-3.8A2 2 0 0 1 8.5 6h7a2 2 0 0 1 1.9 1.3L18.8 11l1.2.6V16h-2.3a2 2 0 0 1-4 0h-3.4a2 2 0 0 1-4 0H4v-4.4zM7 11h10l-1-2.6H8z"/>',
};

/* ---------- Dados de vendas (giftcards variados) ---------- */
const PRODUTOS = [
  { nome: 'Gift Card PlayStation Store', g: 'pad',   c: ['#2E6BFF', '#0B2E9E'], faixa: [50, 500] },
  { nome: 'Gift Card Google Play',       g: 'play',  c: ['#34C759', '#1A73E8'], faixa: [20, 300] },
  { nome: 'Gift Card Xbox / Game Pass',  g: 'pad',   c: ['#37D451', '#0B7A1E'], faixa: [50, 400] },
  { nome: 'Gift Card Steam',             g: 'pad',   c: ['#3A6E9E', '#1B2838'], faixa: [30, 600] },
  { nome: 'Gift Card Netflix',           g: 'play',  c: ['#FF5A5F', '#B0060F'], faixa: [40, 200] },
  { nome: 'Gift Card Spotify Premium',   g: 'music', c: ['#28E07A', '#159443'], faixa: [30, 150] },
  { nome: 'Gift Card App Store / iTunes',g: 'music', c: ['#5AC8FA', '#0A84FF'], faixa: [50, 500] },
  { nome: 'Gift Card Amazon',            g: 'bag',   c: ['#FFB23E', '#E47911'], faixa: [50, 800] },
  { nome: 'Recarga Free Fire (Diamantes)',g:'fire',  c: ['#FF8A3D', '#FF3D00'], faixa: [10, 250] },
  { nome: 'Recarga Roblox (Robux)',      g: 'pad',   c: ['#FF5A52', '#A01510'], faixa: [25, 400] },
  { nome: 'Gift Card Uber',              g: 'car',   c: ['#4A4A4A', '#0A0A0A'], faixa: [30, 200] },
  { nome: 'Gift Card Nintendo eShop',    g: 'pad',   c: ['#FF5A52', '#A60010'], faixa: [50, 350] },
];

/* gera a arte do card (SVG): gradiente + brilho + glifo branco */
function cardArt(v) {
  const id = 'g' + Math.random().toString(36).slice(2, 8);
  return `<svg class="card-art" viewBox="0 0 42 42" width="42" height="42" aria-hidden="true">
    <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${v.c[0]}"/><stop offset="1" stop-color="${v.c[1]}"/>
    </linearGradient></defs>
    <rect width="42" height="42" rx="12" fill="url(#${id})"/>
    <rect x="-8" y="27" width="60" height="9" fill="rgba(255,255,255,.14)" transform="rotate(-20 21 21)"/>
    <g transform="translate(9 9) scale(1)" fill="#fff" fill-opacity=".95">${GLYPH[v.g]}</g>
  </svg>`;
}

const NOMES = ['Lucas A.', 'Maria S.', 'João P.', 'Ana C.', 'Pedro H.', 'Bia R.', 'Gabriel L.',
  'Carla M.', 'Rafael T.', 'Júlia F.', 'Mateus O.', 'Sofia N.', 'Enzo V.', 'Lara B.',
  'Thiago D.', 'Helena G.', 'Vitor S.', 'Alice M.', 'Bruno K.', 'Camila Z.'];

const METODOS = ['PIX', 'PIX', 'PIX', 'Cartão de crédito', 'Cartão de crédito', 'Boleto'];

const rand = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
const pick = arr => arr[rand(0, arr.length - 1)];

function gerarVendas(qtd) {
  const vendas = [];
  let t = Date.now();
  for (let i = 0; i < qtd; i++) {
    const p = pick(PRODUTOS);
    const valor = rand(p.faixa[0], p.faixa[1]);
    const r = Math.random();
    const status = r < 0.78 ? 'Pago' : r < 0.93 ? 'Pendente' : 'Estornado';
    t -= rand(4, 90) * 60 * 1000; // intervalos variados
    vendas.push({
      id: '#' + rand(100000, 999999),
      produto: p.nome, g: p.g, c: p.c,
      cliente: pick(NOMES),
      metodo: pick(METODOS),
      valor, status, ts: t,
    });
  }
  return vendas;
}

const VENDAS = gerarVendas(60);

/* ---------- Tempo relativo ---------- */
function tempoRel(ts) {
  const d = Math.floor((Date.now() - ts) / 60000);
  if (d < 1) return 'agora';
  if (d < 60) return `há ${d} min`;
  const h = Math.floor(d / 60);
  if (h < 24) return `há ${h}h`;
  const dias = Math.floor(h / 24);
  return `há ${dias}d`;
}

/* ---------- Render: linha de venda ---------- */
function txItem(v, big) {
  const sinal = v.status === 'Estornado' ? '-' : '+';
  const cls = v.status === 'Pago' ? 'in' : '';
  return `
    <li class="tx">
      <div class="tx-ic">${cardArt(v)}</div>
      <div class="tx-main">
        <div class="tx-title">${v.produto}</div>
        <div class="tx-sub">${big ? v.cliente + ' • ' + v.metodo + ' • ' : ''}${tempoRel(v.ts)}</div>
      </div>
      <div class="tx-right">
        <div class="tx-amt ${cls}">${sinal} ${BRL(v.valor)}</div>
        <div class="tx-status st-${v.status}">${v.status}</div>
      </div>
    </li>`;
}

function renderRecentes() {
  document.getElementById('recent-list').innerHTML =
    VENDAS.slice(0, 5).map(v => txItem(v, false)).join('');
}

let filtroAtual = 'todas';
function renderVendas() {
  const lista = filtroAtual === 'todas' ? VENDAS : VENDAS.filter(v => v.status === filtroAtual);
  document.getElementById('sales-list').innerHTML =
    lista.map(v => txItem(v, true)).join('') ||
    '<li style="text-align:center;color:var(--muted);padding:30px">Nenhuma venda neste filtro.</li>';
}

/* ---------- Gráfico ---------- */
function renderChart() {
  const dias = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
  const valores = [32, 41, 38, 52, 61, 47, 55].map(v => v + rand(-5, 8));
  const max = Math.max(...valores);
  document.getElementById('chart').innerHTML =
    valores.map(v => `<div class="bar" style="height:0" data-h="${(v / max) * 100}"></div>`).join('');
  document.getElementById('chart-x').innerHTML = dias.map(d => `<span>${d}</span>`).join('');
  requestAnimationFrame(() => {
    setTimeout(() => {
      document.querySelectorAll('#chart .bar').forEach(b => b.style.height = b.dataset.h + '%');
    }, 100);
  });
}

/* ---------- Navegação ---------- */
function go(screen) {
  document.querySelectorAll('.screen').forEach(s =>
    s.classList.toggle('active', s.dataset.screen === screen));
  document.querySelectorAll('.tab').forEach(t =>
    t.classList.toggle('active', t.dataset.go === screen));
  window.scrollTo(0, 0);
}

document.querySelectorAll('[data-go]').forEach(el =>
  el.addEventListener('click', () => go(el.dataset.go)));

/* ---------- Toast ---------- */
let toastTimer;
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove('show'), 2600);
}

/* ---------- Sheet (modal) ---------- */
function openSheet(html) {
  document.getElementById('sheet-content').innerHTML = html;
  document.getElementById('sheet').classList.remove('hidden');
}
function closeSheet() {
  document.getElementById('sheet').classList.add('hidden');
}
document.getElementById('sheet').addEventListener('click', e => {
  if (e.target.id === 'sheet') closeSheet();
});

/* ---------- Saldo (mostrar/ocultar) ---------- */
let saldoVisivel = true;
document.getElementById('eye-btn').addEventListener('click', () => {
  saldoVisivel = !saldoVisivel;
  ['balance-pending', 'balance-available', 'balance-today'].forEach(id => {
    const el = document.getElementById(id);
    if (!el.dataset.real) el.dataset.real = el.textContent;
    el.textContent = saldoVisivel ? el.dataset.real : '•••••••';
  });
});

/* ---------- Filtros de vendas ---------- */
document.getElementById('chips').addEventListener('click', e => {
  const chip = e.target.closest('.chip');
  if (!chip) return;
  document.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
  chip.classList.add('active');
  filtroAtual = chip.dataset.filter;
  renderVendas();
});

/* ---------- Banco de dados (Supabase) ---------- */
const SB_URL = 'https://fhdecbihrigfdnybfzyh.supabase.co';
const SB_KEY = 'sb_publishable_Ck4vPY6YAOk5SJ-WV7Pokg_AXKyE2QW';
const sb = (window.supabase && window.supabase.createClient)
  ? window.supabase.createClient(SB_URL, SB_KEY)
  : null;

const conta = { pending: 193480, available: 90000 };

function renderSaldos() {
  const setVal = (id, v) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = BRL(v);
    if (el.dataset.real !== undefined) el.dataset.real = BRL(v);
  };
  setVal('balance-pending', conta.pending);
  setVal('balance-available', conta.available);
  setVal('wd-available', conta.available);
}

async function carregarConta() {
  if (!sb) return;
  try {
    const { data } = await sb.from('pagflux_account').select('pending,available').eq('id', 1).single();
    if (data) {
      conta.pending = Number(data.pending);
      conta.available = Number(data.available);
      renderSaldos();
    }
  } catch (_) {}
}

async function salvarConta() {
  if (!sb) return;
  try {
    await sb.from('pagflux_account')
      .update({ pending: conta.pending, available: conta.available, updated_at: new Date().toISOString() })
      .eq('id', 1);
  } catch (_) {}
}

/* ---------- Saque ---------- */
const wdInput = document.getElementById('wd-input');

document.querySelectorAll('.wd-quick button').forEach(b =>
  b.addEventListener('click', () => {
    const amt = b.dataset.amt === 'max' ? conta.available : Number(b.dataset.amt);
    wdInput.value = amt.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }));

document.getElementById('btn-withdraw').addEventListener('click', () => {
  const valor = parseFloat((wdInput.value || '0').replace(/\./g, '').replace(',', '.'));
  const chave = document.getElementById('pix-key').value.trim();
  const tipo = document.getElementById('pix-type').value;
  if (!valor || valor <= 0) return toast('Digite um valor para sacar.');
  if (valor > conta.available) return toast('Valor acima do disponível.');
  if (!chave) return toast('Informe a chave PIX de destino.');

  // desconta do disponível e do saldo total, e persiste no banco
  conta.available -= valor;
  conta.pending = Math.max(0, conta.pending - valor);
  renderSaldos();
  salvarConta();
  // registra o saque como PENDENTE (aguardando aprovação)
  if (sb) sb.from('pagflux_withdrawals').insert({ amount: valor, pix_type: tipo, pix_key: chave, status: 'pendente' }).then(() => {}, () => {});

  openSheet(`
    <h3>Saque solicitado</h3>
    <p>${BRL(valor)} via PIX (${tipo}) para <b>${chave}</b>.</p>
    <p style="margin-top:8px">Status: <b style="color:var(--warn)">Pendente</b> — aguardando aprovação.</p>
    <p style="margin-top:4px">Disponível restante: <b>${BRL(conta.available)}</b></p>
    <button class="btn-primary" onclick="closeSheet()">Entendi</button>
    <p style="margin-top:14px;text-align:center;opacity:.5;font-size:11px">Protótipo — nenhum valor real é transferido.</p>
  `);
  wdInput.value = '';
});

/* ---------- Histórico de saques (lê do banco) ---------- */
async function abrirSaques() {
  openSheet('<h3>Histórico de saques</h3><p>Carregando…</p>');
  if (!sb) {
    document.getElementById('sheet-content').innerHTML =
      '<h3>Histórico de saques</h3><p>Sem conexão com o banco no momento.</p>';
    return;
  }
  let linhas = '';
  try {
    const { data } = await sb.from('pagflux_withdrawals')
      .select('amount,pix_type,pix_key,status,created_at')
      .order('created_at', { ascending: false }).limit(30);
    if (data && data.length) {
      linhas = data.map(w => {
        const d = new Date(w.created_at).toLocaleString('pt-BR');
        return `<li class="tx" style="padding:12px 0;border-bottom:1px solid var(--line)">
          <div class="tx-main">
            <div class="tx-title">${BRL(Number(w.amount))}</div>
            <div class="tx-sub">${w.pix_type} • ${w.pix_key} • ${d}</div>
          </div>
          <div class="tx-right"><div class="tx-status st-${w.status === 'pendente' ? 'Pendente' : 'Pago'}">${w.status}</div></div>
        </li>`;
      }).join('');
    } else {
      linhas = '<li style="text-align:center;color:var(--muted);padding:24px">Nenhum saque ainda.</li>';
    }
  } catch (_) {
    linhas = '<li style="text-align:center;color:var(--muted);padding:24px">Erro ao carregar.</li>';
  }
  document.getElementById('sheet-content').innerHTML =
    `<h3>Histórico de saques</h3><ul class="tx-list" style="max-height:55vh;overflow:auto">${linhas}</ul>
     <button class="btn-primary" onclick="closeSheet()" style="margin-top:14px">Fechar</button>`;
}
document.getElementById('menu-saques')?.addEventListener('click', abrirSaques);

/* ---------- Cobrar (link de pagamento) ---------- */
document.getElementById('qa-cobrar').addEventListener('click', () => {
  openSheet(`
    <h3>Receber pagamento</h3>
    <p>Compartilhe o código PIX ou o link de cobrança com seu cliente.</p>
    <div class="qr">${qrSVG()}</div>
    <div class="copy-box">
      <code>pagflux.com/pay/ITALO-${rand(1000, 9999)}</code>
      <button class="link-btn" id="copy-link">Copiar</button>
    </div>
    <button class="btn-primary" onclick="closeSheet()">Fechar</button>
  `);
  document.getElementById('copy-link').addEventListener('click', () => {
    navigator.clipboard?.writeText('https://pagflux.com/pay/ITALO').catch(() => {});
    toast('Link copiado!');
  });
});

/* ---------- QR fake (decorativo) ---------- */
function qrSVG() {
  const n = 21, cell = 7;
  let rects = '';
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++)
      if (Math.random() > 0.5) rects += `<rect x="${x * cell}" y="${y * cell}" width="${cell}" height="${cell}" fill="#000"/>`;
  // cantos do QR
  const finder = (ox, oy) =>
    `<rect x="${ox}" y="${oy}" width="${cell * 7}" height="${cell * 7}" fill="#000"/>
     <rect x="${ox + cell}" y="${oy + cell}" width="${cell * 5}" height="${cell * 5}" fill="#fff"/>
     <rect x="${ox + cell * 2}" y="${oy + cell * 2}" width="${cell * 3}" height="${cell * 3}" fill="#000"/>`;
  return `<svg width="150" height="150" viewBox="0 0 ${n * cell} ${n * cell}">
    <rect width="100%" height="100%" fill="#fff"/>${rects}
    ${finder(0, 0)}${finder(cell * 14, 0)}${finder(0, cell * 14)}</svg>`;
}

/* ---------- Botões diversos ---------- */
document.getElementById('qa-extrato').addEventListener('click', () => go('vendas'));
document.getElementById('btn-bell').addEventListener('click', () => toast('Nenhuma notificação nova.'));
document.getElementById('btn-filter')?.addEventListener('click', () => toast('Filtros avançados (demo).'));
document.getElementById('tab-more').addEventListener('click', () => go('conta'));

/* ---------- Init ---------- */
renderRecentes();
renderVendas();
renderChart();
carregarConta();

window.addEventListener('load', () => {
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('fade');
    document.getElementById('app').classList.remove('hidden');
    setTimeout(() => splash.remove(), 500);
  }, 1100);
});

/* ---------- Service worker (PWA) ---------- */
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () =>
    navigator.serviceWorker.register('sw.js').catch(() => {}));
}

/* simula vendas chegando em tempo real */
setInterval(() => {
  const nova = gerarVendas(1)[0];
  nova.ts = Date.now();
  nova.status = 'Pago';
  VENDAS.unshift(nova);
  if (VENDAS.length > 80) VENDAS.pop();
  // cada venda aprovada soma ao saldo total e ao disponível para saque
  conta.available += nova.valor;
  conta.pending += nova.valor;
  renderSaldos();
  salvarConta();
  renderRecentes();
  if (document.querySelector('[data-screen="vendas"]').classList.contains('active')) renderVendas();
}, 22000);
