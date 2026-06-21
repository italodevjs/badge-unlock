# PagFlux ⚡ — Protótipo de Gateway de Pagamento (PWA)

Protótipo realista de um app de gateway de pagamento no estilo Kiwify / GhostsPay,
focado em vendas de **giftcards e produtos digitais** (PlayStation, Google Play, Steam,
Xbox, Free Fire, Roblox, etc.) com **saque via PIX**.

É um **PWA**: dá pra "Adicionar à Tela de Início" no iPhone/Android e ele abre em tela
cheia, igual um app nativo (ícone próprio, splash, sem barra do navegador).

> ⚠️ **Demonstração / dados fictícios.** Não processa pagamentos reais nem transfere dinheiro.

## Telas
- **Início** — saldo a receber (R$ 134.000), disponível p/ saque, stats, gráfico 7 dias e vendas recentes.
- **Vendas** — lista filtrável (Pagas / Pendentes / Estornadas) com giftcards variados, atualizando em tempo real.
- **Sacar** — fluxo de saque via PIX com valores rápidos e confirmação.
- **Cobrar** — gera link de pagamento + QR Code.
- **Conta** — perfil, verificações e menu.

## Como rodar
```bash
# qualquer servidor estático na raiz do projeto
python3 -m http.server 8080
# abra http://localhost:8080
```

### Instalar como app no iPhone
1. Abra a URL no **Safari**.
2. Toque em **Compartilhar** → **Adicionar à Tela de Início**.
3. Abra pelo ícone ⚡ — roda em tela cheia.

## Stack
HTML + CSS + JavaScript puro (sem dependências) · `manifest.webmanifest` · Service Worker (offline) · ícones PNG gerados.

## Estrutura
```
index.html
css/styles.css
js/app.js
sw.js
manifest.webmanifest
icons/  (192, 512, maskable, apple-touch-icon)
```
