/* ============================================================
   PagFlux — protótipo de gateway de pagamento (dados fictícios)
   ============================================================ */

const BRL = n => n.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

/* ---------- Dados de vendas (giftcards variados) ---------- */
const PRODUTOS = [
  { nome: 'Gift Card PlayStation Store', ic: '🎮', faixa: [50, 500] },
  { nome: 'Gift Card Google Play', ic: '▶️', faixa: [20, 300] },
  { nome: 'Gift Card Xbox / Game Pass', ic: '🟢', faixa: [50, 400] },
  { nome: 'Gift Card Steam', ic: '🕹️', faixa: [30, 600] },
  { nome: 'Gift Card Netflix', ic: '🎬', faixa: [40, 200] },
  { nome: 'Gift Card Spotify Premium', ic: '🎧', faixa: [30, 150] },
  { nome: 'Gift Card App Store / iTunes', ic: '🍎', faixa: [50, 500] },
  { nome: 'Gift Card Amazon', ic: '📦', faixa: [50, 800] },
  { nome: 'Recarga Free Fire (Diamantes)', ic: '🔥', faixa: [10, 250] },
  { nome: 'Recarga Roblox (Robux)', ic: '🟥', faixa: [25, 400] },
  { nome: 'Gift Card Uber', ic: '🚗', faixa: [30, 200] },
  { nome: 'Gift Card Nintendo eShop', ic: '🍄', faixa: [50, 350] },
];

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
      produto: p.nome, ic: p.ic,
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
      <div class="tx-ic">${v.ic}</div>
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

/* ---------- Saque ---------- */
const DISPONIVEL = 28450;
const wdInput = document.getElementById('wd-input');

document.querySelectorAll('.wd-quick button').forEach(b =>
  b.addEventListener('click', () => {
    const amt = b.dataset.amt === 'max' ? DISPONIVEL : Number(b.dataset.amt);
    wdInput.value = amt.toLocaleString('pt-BR', { minimumFractionDigits: 2 });
  }));

document.getElementById('btn-withdraw').addEventListener('click', () => {
  const valor = parseFloat((wdInput.value || '0').replace(/\./g, '').replace(',', '.'));
  if (!valor || valor <= 0) return toast('Digite um valor para sacar.');
  if (valor > DISPONIVEL) return toast('Valor acima do disponível.');
  openSheet(`
    <h3>Saque solicitado ✅</h3>
    <p>${BRL(valor)} será enviado via PIX para <b>caetanoitalo69@icloud.com</b>. Normalmente cai em segundos.</p>
    <button class="btn-primary" onclick="closeSheet()">Entendi</button>
    <p style="margin-top:14px;text-align:center;opacity:.5;font-size:11px">Protótipo — nenhum valor real é transferido.</p>
  `);
  wdInput.value = '';
});

document.getElementById('change-pix').addEventListener('click', () =>
  toast('Gerenciamento de chaves PIX (demo).'));

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
  renderRecentes();
  if (document.querySelector('[data-screen="vendas"]').classList.contains('active')) renderVendas();
}, 22000);
