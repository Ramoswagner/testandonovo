/**
 * js/ui.js
 * ─────────────────────────────────────────────
 * Todas as interações de UI:
 * - selectFactor: seleciona um botão de opção
 * - update: sincroniza DOM com o estado atual
 * - resetAll: volta tudo para valor 1
 * - switchTab: alterna entre Analisador e Guia
 * - Cursor Wagner (event delegation)
 * - Inicialização no DOMContentLoaded
 *
 * Depende de: state.js, calc.js, chart.js
 */

'use strict';

// ══════════════════════════════════════════════
// Seleção de fator
// ══════════════════════════════════════════════

/**
 * Chamado pelo onclick dos botões de opção.
 * Atualiza classes visuais, atributos ARIA e o estado.
 * @param {HTMLElement} btn - o botão clicado
 */
// eslint-disable-next-line no-unused-vars
function selectFactor(btn) {
  const group  = btn.closest('[data-factor]');
  const factor = group.dataset.factor;

  // Atualiza visual e ARIA em todos os botões do grupo
  group.querySelectorAll('.opt-btn').forEach(b => {
    b.classList.remove('selected');
    b.setAttribute('aria-checked', 'false');
  });
  btn.classList.add('selected');
  btn.setAttribute('aria-checked', 'true');

  // Atualiza o estado (dispara update() via Proxy em state.js)
  setFactorRaw(factor, parseInt(btn.dataset.val, 10));
  update();

  // Exibe o campo de justificativa do fator selecionado
  const justDiv = document.getElementById('just-' + factor);
  if (justDiv) justDiv.classList.add('visible');

  // FIX #05 — painel contextual para touch: mostra o tooltip do botão selecionado
  // abaixo do grupo de opções em dispositivos sem hover (mobile/tablet)
  const tipPanel = group.parentElement.querySelector('.factor-tip-panel');
  if (tipPanel) {
    const tipEl = btn.querySelector('.tip');
    tipPanel.innerHTML = tipEl ? tipEl.innerHTML : '';
    tipPanel.classList.add('visible');
  }

  // FIX #04 — persiste estado após cada seleção
  if (typeof persistState === 'function') persistState();
}

// ══════════════════════════════════════════════
// Update principal — sincroniza todo o DOM
// ══════════════════════════════════════════════

/**
 * Recalcula o score e atualiza todos os elementos
 * da interface que dependem do estado.
 * Chamado automaticamente pelo Proxy de state.js
 * e diretamente quando necessário.
 */
// eslint-disable-next-line no-unused-vars
function update() {
  const score = calcScore();
  const z     = zone(score);
  const zl    = zoneLabel(score);

  // ── Bloco de resultado ──
  const rb = document.getElementById('resultBlock');
  if (!rb) return;
  rb.className = 'result-block ' + z;
  document.getElementById('scoreNum').textContent  = score;
  document.getElementById('zonePill').textContent  = '● ' + zl;
  document.getElementById('resultMsg').textContent = msg(z);

  // ── Chips da fórmula ──
  document.getElementById('fD').textContent    = `D=${getFactorValue('D')}`;
  document.getElementById('fI').textContent    = `2×I=${2 * getFactorValue('I')}`;
  document.getElementById('fC1').textContent   = `2×C1=${2 * getFactorValue('C1')}`;
  document.getElementById('fC2').textContent   = `C2=${getFactorValue('C2')}`;
  document.getElementById('fE').textContent    = `E=${getFactorValue('E')}`;
  document.getElementById('fTotal').textContent = score;

  // ── Breakdown ──
  document.getElementById('bdD').textContent  = getFactorValue('D');
  document.getElementById('bdI').textContent  = 2 * getFactorValue('I');
  document.getElementById('bdC1').textContent = 2 * getFactorValue('C1');
  document.getElementById('bdC2').textContent = getFactorValue('C2');
  document.getElementById('bdE').textContent  = getFactorValue('E');

  _setBar('barD',  getFactorValue('D'),         4);
  _setBar('barI',  2 * getFactorValue('I'),      8);
  _setBar('barC1', 2 * getFactorValue('C1'),     8);
  _setBar('barC2', getFactorValue('C2'),          4);
  _setBar('barE',  getFactorValue('E'),           4);

  // ── Aria-label do canvas (acessibilidade) ──
  const canvas = document.getElementById('diceChart');
  if (canvas) {
    canvas.setAttribute('aria-label', `Gráfico DICE: pontuação ${score}, zona ${zl}`);
  }

  // ── Gráfico ──
  drawChart(score);
}

/**
 * Atualiza a largura de uma barra de breakdown.
 * @param {string} id
 * @param {number} val
 * @param {number} max
 */
function _setBar(id, val, max) {
  const el = document.getElementById(id);
  if (el) el.style.width = Math.round(val / max * 100) + '%';
}

// ══════════════════════════════════════════════
// Reset
// ══════════════════════════════════════════════

/**
 * Reseta todos os fatores para o valor 1
 * e limpa campos de justificativa.
 */
// eslint-disable-next-line no-unused-vars
function resetAll() {
  document.querySelectorAll('.factor-options').forEach(group => {
    group.querySelectorAll('.opt-btn').forEach((btn, i) => {
      btn.classList.toggle('selected', i === 0);
      btn.setAttribute('aria-checked', i === 0 ? 'true' : 'false');
    });
    setFactorRaw(group.dataset.factor, 1);
  });

  // Oculta e limpa justificativas
  document.querySelectorAll('.factor-justification').forEach(el => {
    el.classList.remove('visible');
  });
  ['justD', 'justI', 'justC1', 'justC2', 'justE'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });

  update();
  if (typeof persistState === 'function') persistState();
  showToast('Valores resetados');
}

// ══════════════════════════════════════════════
// Navegação por tabs
// ══════════════════════════════════════════════

/**
 * Alterna entre a view do Analisador e a do Guia.
 * Usa event.target.closest('.tab-btn') para funcionar
 * corretamente mesmo quando o clique cai em um filho SVG.
 * @param {string} id - 'analyzer' | 'guide'
 * @param {Event}  event
 */
// eslint-disable-next-line no-unused-vars
function switchTab(id, event) {
  document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.remove('active');
    btn.setAttribute('aria-selected', 'false');
  });

  document.getElementById('view-' + id).classList.add('active');

  if (event) {
    const btn = event.target.closest('.tab-btn');
    if (btn) {
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
    }
  }
}

// ══════════════════════════════════════════════
// Toast
// ══════════════════════════════════════════════

/**
 * Exibe uma notificação temporária no canto inferior direito.
 * @param {string} message
 */
// eslint-disable-next-line no-unused-vars
function showToast(message) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = message;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2800);
}

// ══════════════════════════════════════════════
// Cursor Wagner (event delegation)
// ══════════════════════════════════════════════
(function initCursor() {
  const co   = document.getElementById('co');
  const ci   = document.getElementById('ci');
  const cdot = document.getElementById('cdot');
  if (!co) return;

  let mx = 0, my = 0, ox = 0, oy = 0, ix = 0, iy = 0;
  // FIX #13 — pause loop after 3s of inactivity to save CPU/battery
  let idle = false;
  let idleTimer = null;
  let rafId = null;

  function resume() {
    idle = false;
    if (!rafId) loop();
  }

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    clearTimeout(idleTimer);
    resume();
    idleTimer = setTimeout(() => { idle = true; rafId = null; }, 3000);
  });

  // Event delegation: funciona para elementos injetados dinamicamente (modal, etc.)
  const INTERACTIVE = 'a, button, [onclick], input, textarea, select, [role="button"]';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(INTERACTIVE)) document.body.classList.add('ch');
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(INTERACTIVE)) document.body.classList.remove('ch');
  });

  function loop() {
    if (idle) { rafId = null; return; }
    ox += (mx - 22 - ox) * 0.08;
    oy += (my - 22 - oy) * 0.08;
    ix += (mx -  8 - ix) * 0.18;
    iy += (my -  8 - iy) * 0.18;
    co.style.transform   = `translate3d(${ox}px,${oy}px,0)`;
    ci.style.transform   = `translate3d(${ix}px,${iy}px,0)`;
    cdot.style.transform = `translate3d(${mx - 1.5}px,${my - 1.5}px,0)`;
    rafId = requestAnimationFrame(loop);
  }
  loop();
})();

// ══════════════════════════════════════════════
// Inicialização
// ══════════════════════════════════════════════

// FIX #04 — restaura estado salvo, depois sincroniza a UI
(function initFromStorage() {
  const restored = typeof restoreState === 'function' && restoreState();
  if (restored) {
    // Sincroniza botões selecionados com o estado restaurado
    document.querySelectorAll('.factor-options').forEach(group => {
      const factor = group.dataset.factor;
      const val    = typeof getFactorValue === 'function' ? getFactorValue(factor) : 1;
      group.querySelectorAll('.opt-btn').forEach(btn => {
        const isSelected = parseInt(btn.dataset.val, 10) === val;
        btn.classList.toggle('selected', isSelected);
        btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
      });
    });
  }
  update();

  // Persiste quando o usuário edita qualquer justificativa
  ['justD','justI','justC1','justC2','justE'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', () => {
      if (typeof persistState === 'function') persistState();
    });
  });
  // Persiste quando o nome do projeto muda
  const pn = document.getElementById('projectName');
  if (pn) pn.addEventListener('input', () => {
    if (typeof persistState === 'function') persistState();
  });
})();
