/**
 * js/state.js
 * ─────────────────────────────────────────────
 * Estado global encapsulado via Proxy.
 * Qualquer atribuição (_state.D = x) é feita
 * pelo setter interno — garantindo que update()
 * seja sempre chamado automaticamente.
 *
 * Exporta também escapeHtml() para uso em todos
 * os módulos que montam HTML dinâmico.
 */

'use strict';

// ── Estado interno (não exposto diretamente) ──
const _state = { D: 1, I: 1, C1: 1, C2: 1, E: 1 };

// ── Proxy público: state.D = 2 chama update() ──
// eslint-disable-next-line no-unused-vars
const state = new Proxy(_state, {
  set(target, key, value) {
    if (!(key in target)) return false;
    target[key] = value;
    if (typeof update === 'function') update();
    return true;
  },
  get(target, key) {
    return target[key];
  }
});

/**
 * Lê o valor bruto de um fator sem passar pelo Proxy.
 * Usado internamente nos cálculos e na exportação.
 * @param {string} factor - 'D' | 'I' | 'C1' | 'C2' | 'E'
 * @returns {number}
 */
function getFactorValue(factor) {
  return _state[factor];
}

/**
 * Define o valor de um fator sem passar pelo Proxy
 * (usado pelo reset, que precisa modificar todos os
 * fatores antes de chamar update() uma única vez).
 * @param {string} factor
 * @param {number} value
 */
function setFactorRaw(factor, value) {
  _state[factor] = value;
}

/**
 * Sanitiza uma string para inserção segura em innerHTML.
 * Previne XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g,  '&amp;')
    .replace(/</g,  '&lt;')
    .replace(/>/g,  '&gt;')
    .replace(/"/g,  '&quot;')
    .replace(/'/g,  '&#39;');
}

// ══════════════════════════════════════════════
// FIX #04 — Persistência via localStorage
// Salva estado, nome do projeto e justificativas
// a cada mudança. Restaura na inicialização.
// ══════════════════════════════════════════════

const STORAGE_KEY = 'dice_state_v1';

/**
 * Salva o estado atual no localStorage.
 * Chamado após cada mudança de fator ou justificativa.
 */
// eslint-disable-next-line no-unused-vars
function persistState() {
  try {
    const snapshot = {
      factors: { D: _state.D, I: _state.I, C1: _state.C1, C2: _state.C2, E: _state.E },
      project: document.getElementById('projectName')?.value || '',
      just: {
        D:  document.getElementById('justD')?.value  || '',
        I:  document.getElementById('justI')?.value  || '',
        C1: document.getElementById('justC1')?.value || '',
        C2: document.getElementById('justC2')?.value || '',
        E:  document.getElementById('justE')?.value  || ''
      }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
  } catch (_) { /* storage indisponível — falha silenciosa */ }
}

/**
 * Restaura o estado salvo do localStorage.
 * Retorna true se havia dados para restaurar.
 * @returns {boolean}
 */
// eslint-disable-next-line no-unused-vars
function restoreState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return false;
    const snap = JSON.parse(raw);

    // Restaura fatores
    if (snap.factors) {
      ['D', 'I', 'C1', 'C2', 'E'].forEach(k => {
        if (snap.factors[k]) setFactorRaw(k, snap.factors[k]);
      });
    }

    // Restaura nome do projeto (aguarda DOM pronto)
    if (snap.project) {
      const pn = document.getElementById('projectName');
      if (pn) pn.value = snap.project;
    }

    // Restaura justificativas e torna campos visíveis
    if (snap.just) {
      ['D', 'I', 'C1', 'C2', 'E'].forEach(k => {
        const el = document.getElementById('just' + k);
        if (el && snap.just[k]) {
          el.value = snap.just[k];
          const wrapper = document.getElementById('just-' + k);
          if (wrapper) wrapper.classList.add('visible');
        }
      });
    }

    return true;
  } catch (_) { return false; }
}
