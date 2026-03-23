/**
 * js/chart.js
 * ─────────────────────────────────────────────
 * Renderização do gráfico DICE via Canvas 2D.
 * Suporte completo a HiDPI / Retina.
 * Null guard: seguro mesmo se o canvas não existir.
 *
 * Depende de: (nenhuma — recebe score como argumento)
 */

'use strict';

/**
 * Retorna o elemento canvas, ou null se não existir.
 * @returns {HTMLCanvasElement|null}
 */
function getCanvas() {
  return document.getElementById('diceChart');
}

/**
 * Configura as dimensões do canvas respeitando o
 * devicePixelRatio para evitar borrão em telas Retina.
 * @param {HTMLCanvasElement} canvas
 * @returns {{ ctx: CanvasRenderingContext2D, W: number, H: number, dpr: number }}
 */
function setupCanvas(canvas) {
  // offsetWidth/offsetHeight refletem as dimensões CSS reais após layout.
  // Com aspect-ratio:900/380 no CSS, offsetHeight já é proporcional.
  // Retornam 0 antes do layout completar — neste caso abortamos.
  const displayW = canvas.offsetWidth;
  const displayH = canvas.offsetHeight || Math.round(displayW * 380 / 900);
  if (!displayW || !displayH) return null;

  const dpr  = window.devicePixelRatio || 1;
  const physW = Math.round(displayW * dpr);
  const physH = Math.round(displayH * dpr);

  // Só redimensiona o buffer físico quando necessário.
  // O CSS (width:100% + aspect-ratio) controla o tamanho visual — não tocamos no style.
  if (canvas.width !== physW || canvas.height !== physH) {
    canvas.width  = physW;
    canvas.height = physH;
  }

  const ctx = canvas.getContext('2d');
  // Reset de qualquer transformação acumulada, depois escala HiDPI limpa.
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(dpr, dpr);
  return { ctx, W: displayW, H: displayH };
}

/**
 * Desenha o gráfico DICE completo no canvas.
 * Margens e labels são adaptados ao tamanho real do canvas
 * para funcionar corretamente em mobile.
 * @param {number} score - score atual (7–28)
 */
// eslint-disable-next-line no-unused-vars
function drawChart(score) {
  const canvas = getCanvas();
  if (!canvas) return; // null guard

  const setup = setupCanvas(canvas);
  if (!setup) return; // canvas não tem dimensões ainda — aguarda ResizeObserver
  const { ctx, W, H } = setup;

  // Margens responsivas: menores em telas estreitas
  const mobile = W < 500;
  // ML e MR equilibrados em mobile: diferença de só 8px
  // evita que o conteúdo pareça deslocado para a direita do centro
  const ML = mobile ? 36  : 120;
  const MR = mobile ? 8   : 20;
  const MT = mobile ? 24  : 50;
  const MB = mobile ? 28  : 50;
  const PW = W - ML - MR;
  const PH = H - MT - MB;

  // Em mobile, mostra labels a cada 3 posicoes no eixo X
  const xStep = mobile ? 3 : 1;
  // Font size responsivo — unificado (#14: variáveis redundantes mescladas em fz)
  const fz = mobile ? '9px' : '11px';

  // Conversores de coordenadas do modelo → pixels
  const px = x => ML + (x - 7) / 21 * PW;
  const py = y => MT + (1 - y / 5) * PH;

  // Reset completo antes de desenhar (evita artefatos de globalAlpha acumulado)
  ctx.clearRect(0, 0, W, H);
  ctx.globalAlpha = 1;

  // ── Fundo ──
  const transparent = document.getElementById('transparentToggle')?.checked ?? false;
  if (!transparent) {
    ctx.fillStyle = '#0B1E33';
    ctx.fillRect(0, 0, W, H);
    const bg = ctx.createLinearGradient(ML, MT, ML + PW, MT + PH);
    bg.addColorStop(0, 'rgba(196,163,90,0.12)');
    bg.addColorStop(1, 'rgba(11,30,51,0.8)');
    ctx.fillStyle = bg;
    ctx.fillRect(ML, MT, PW, PH);
  }

  // ── Polígonos de zona ──
  _drawZonePolygons(ctx, px, py);

  // ── Barra de labels inferior ──
  const bh = PH * (0.6 / 5);
  const by = py(0) - bh;
  _drawZoneBar(ctx, px, by, bh, transparent, fz);

  // ── Separadores verticais de zona ──
  _drawZoneDividers(ctx, px, py, transparent);

  // ── Grid de eixos ──
  _drawGrid(ctx, px, py, ML, PW, transparent, fz, xStep);

  // ── Marcador do score ──
  _drawScoreMarker(ctx, px, py, score, by, mobile);
}

// ─────────────────── Funções auxiliares de desenho ───────────────────

function _drawZonePolygons(ctx, px, py) {
  // Salva e restaura o estado: garante que globalAlpha não vaza
  ctx.save();

  ctx.globalAlpha = 0.65;
  ctx.beginPath();
  ctx.moveTo(px(7), py(5)); ctx.lineTo(px(14), py(5));
  ctx.lineTo(px(14), py(4)); ctx.lineTo(px(9), py(4));
  ctx.closePath();
  ctx.fillStyle = '#03A63C'; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(px(14), py(5)); ctx.lineTo(px(17), py(5));
  ctx.lineTo(px(17), py(1.75)); ctx.lineTo(px(14), py(4));
  ctx.closePath();
  ctx.fillStyle = '#F2B705'; ctx.fill();

  ctx.globalAlpha = 0.55;
  ctx.beginPath();
  ctx.moveTo(px(17), py(5)); ctx.lineTo(px(18), py(5));
  ctx.lineTo(px(21), py(3)); ctx.lineTo(px(25), py(3));
  ctx.lineTo(px(28), py(1)); ctx.lineTo(px(18), py(1));
  ctx.lineTo(px(17), py(1.75));
  ctx.closePath();
  ctx.fillStyle = '#F25C5C'; ctx.fill();

  ctx.restore(); // globalAlpha volta a 1
}

function _drawZoneBar(ctx, px, by, bh, transparent, fz) {
  ctx.fillStyle = '#03A63C';
  ctx.fillRect(px(7),  by, px(14) - px(7),  bh);
  ctx.fillStyle = '#F2B705';
  ctx.fillRect(px(14), by, px(17) - px(14), bh);
  ctx.fillStyle = '#F25C5C';
  ctx.fillRect(px(17), by, px(28) - px(17), bh);

  ctx.font          = `bold ${fz} "Cormorant Garamond",serif`;
  ctx.textAlign     = 'center';
  ctx.textBaseline  = 'middle';
  ctx.fillStyle     = transparent ? 'rgba(255,255,255,0.9)' : '#fff';
  ctx.fillText('WIN',   px(10.5), by + bh / 2);
  ctx.fillText('WORRY', px(15.5), by + bh / 2);
  ctx.fillText('WOE',   px(22.5), by + bh / 2);
}

function _drawZoneDividers(ctx, px, py, transparent) {
  ctx.save();
  ctx.strokeStyle = transparent ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.35)';
  ctx.lineWidth   = 1;
  ctx.setLineDash([5, 5]);
  ctx.beginPath(); ctx.moveTo(px(14), py(5)); ctx.lineTo(px(14), py(0)); ctx.stroke();
  ctx.setLineDash([]);
  ctx.strokeStyle = transparent ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.15)';
  ctx.beginPath(); ctx.moveTo(px(17), py(5)); ctx.lineTo(px(17), py(0)); ctx.stroke();
  ctx.restore();
}

function _drawGrid(ctx, px, py, ML, PW, transparent, fz, xStep) {
  const tc = transparent ? 'rgba(200,210,230,0.85)' : '#8A9BB5';
  const gc = transparent ? 'rgba(255,255,255,0.1)'  : 'rgba(255,255,255,0.05)';

  // Eixo Y — labels apenas em 0, 2, 4 em mobile para não poluir
  ctx.font          = `${fz} "Inter",sans-serif`;
  ctx.textAlign     = 'right';
  ctx.textBaseline  = 'middle';
  ctx.fillStyle     = tc;
  for (let y = 0; y <= 5; y++) {
    const yy = py(y);
    if (xStep > 1 && y % 2 !== 0) { // mobile: só pares
      ctx.save(); ctx.strokeStyle = gc; ctx.lineWidth = 0.5;
      ctx.beginPath(); ctx.moveTo(ML, yy); ctx.lineTo(ML + PW, yy); ctx.stroke();
      ctx.restore();
      continue;
    }
    ctx.fillText(y, ML - 6, yy);
    ctx.save(); ctx.strokeStyle = gc; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(ML, yy); ctx.lineTo(ML + PW, yy); ctx.stroke();
    ctx.restore();
  }

  // Eixo X — pula labels conforme xStep para evitar sobreposição
  ctx.textAlign    = 'center';
  ctx.textBaseline = 'top';
  ctx.fillStyle    = tc;
  for (let x = 7; x <= 28; x++) {
    const xx = px(x);
    ctx.save(); ctx.strokeStyle = transparent ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.12)';
    ctx.lineWidth = 1;
    ctx.beginPath(); ctx.moveTo(xx, py(0)); ctx.lineTo(xx, py(0) + 3); ctx.stroke();
    ctx.restore();
    if ((x - 7) % xStep === 0) ctx.fillText(x, xx, py(0) + 5);
  }
}

// ResizeObserver: redesenha quando o canvas muda de tamanho.
// Cobre rotação de tela, redimensionamento de janela e
// transição entre layout desktop (2 colunas) e mobile (1 coluna).
(function initResizeObserver() {
  const canvas = getCanvas();
  if (!canvas || typeof ResizeObserver === 'undefined') return;

  let _raf = null;
  const observer = new ResizeObserver(() => {
    // Debounce via requestAnimationFrame para evitar múltiplos redesenhos
    if (_raf) cancelAnimationFrame(_raf);
    _raf = requestAnimationFrame(() => {
      if (typeof calcScore === 'function') drawChart(calcScore());
    });
  });
  observer.observe(canvas);
})();

function _drawScoreMarker(ctx, px, py, score, by, mobile) {
  const xm = px(score);
  const yd = py(1.5);
  const r  = mobile ? 5 : 7;
  const fz = mobile ? '9px' : '12px';

  ctx.save();
  ctx.shadowColor = 'rgba(196,163,90,0.9)';
  ctx.shadowBlur  = mobile ? 8 : 15;
  ctx.strokeStyle = 'rgba(255,255,255,0.9)';
  ctx.lineWidth   = 1.5;
  ctx.setLineDash([3, 3]);
  ctx.beginPath(); ctx.moveTo(xm, py(5)); ctx.lineTo(xm, by); ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(xm, yd, r, 0, Math.PI * 2);
  ctx.fillStyle   = '#D8B87A';
  ctx.shadowColor = '#D8B87A';
  ctx.shadowBlur  = mobile ? 8 : 15;
  ctx.fill();
  ctx.shadowBlur  = 0;

  ctx.font          = `bold ${fz} "Inter",sans-serif`;
  ctx.textAlign     = 'center';
  ctx.textBaseline  = 'middle';
  ctx.fillStyle     = '#0B1E33';
  ctx.fillText(score, xm, yd);
}
