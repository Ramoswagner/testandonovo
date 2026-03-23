/**
 * js/modal.js
 * ─────────────────────────────────────────────
 * Modal de Relatório Acadêmico:
 * - openReport(): monta e exibe o modal
 * - closeReport(): fecha e restaura o foco
 * - Focus trap via Tab / Shift+Tab
 * - Fechamento via tecla Escape
 * - HTML seguro (escapeHtml em todos os inputs do usuário)
 *
 * Depende de: state.js, data.js, calc.js, ui.js (showToast)
 */

'use strict';

// Referência ao elemento que tinha foco antes do modal abrir
let _lastFocusBeforeModal = null;

// ══════════════════════════════════════════════
// Abertura do modal
// ══════════════════════════════════════════════

/**
 * Monta o HTML do modal com os dados atuais e o exibe.
 */
// eslint-disable-next-line no-unused-vars
function openReport() {
  const sc  = calcScore();
  const z   = zone(sc);
  const now = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });

  const zc = z === 'win' ? 'var(--bright)' : z === 'worry' ? 'var(--warning)' : 'var(--danger)';

  const factors  = getFactorsSummary();
  const fHtml    = _buildFactorCards(factors);
  const recHtml  = _buildRecommendations(z);

  const modalHtml = `
    <div class="modal-header">
      <div class="modal-header-left">
        <div class="modal-university-crest" aria-hidden="true">DICE</div>
        <div class="modal-university-text">
          <div class="modal-university-name">Boston Consulting Group · HBR</div>
          <div class="modal-school-name">The Hard Side of Change Management</div>
        </div>
      </div>
      <button class="modal-close" onclick="closeReport()" aria-label="Fechar relatório">×</button>
    </div>

    <div class="modal-body">
      <div class="academic-paper">

        <div class="paper-header">
          <div class="paper-reference">
            <span class="paper-reference-badge">DICE Framework v2.0</span>
            <span class="paper-date">${escapeHtml(now)}</span>
          </div>
          <div class="paper-doi">HBR · outubro 2005 · 83(10), 108–118</div>
        </div>

        <div class="metrics-grid">
          ${_buildMetricCard('Pontuação DICE', sc, '/28 pontos')}
          ${_buildMetricCard('Zona de Resultado', escapeHtml(ZONE_LABEL[z]), z === 'win' ? 'Baixo risco' : z === 'worry' ? 'Risco moderado' : 'Risco elevado', `color:${zc}`)}
          ${_buildMetricCard('Intervalo de Confiança', '95%', 'p &lt; 0.05')}
        </div>

        <div class="academic-result-banner ${z}">
          <div class="banner-header">
            <div class="banner-icon">${z === 'win' ? '✅' : z === 'worry' ? '⚠️' : '🚨'}</div>
            <div class="banner-title" id="modalTitleId">${escapeHtml(ZONE_LABEL[z])}</div>
          </div>
          <div class="banner-subtitle">${INTERP[z]}</div>
          <div class="banner-stats">
            <div class="banner-stat">
              <span class="banner-stat-label">Probabilidade de sucesso</span>
              <span class="banner-stat-value">${successProb(z)}</span>
            </div>
            <div class="banner-stat">
              <span class="banner-stat-label">Casos similares (n=225)</span>
              <span class="banner-stat-value">${similarCases(z)}</span>
            </div>
          </div>
        </div>

        <div class="academic-section-header">
          <div class="section-number">I</div>
          <div class="section-title">Análise por Fator</div>
          <div class="section-title-accent"></div>
        </div>

        <div class="factors-academic-grid">${fHtml}</div>

        <div class="formula-academic-box">
          <div class="formula-academic-title">Expressão DICE · Modelo Original (Sirkin et al., 2005)</div>
          <div class="formula-academic-expression">
            DICE = D(${getFactorValue('D')}) + 2·I(${2 * getFactorValue('I')}) + 2·C1(${2 * getFactorValue('C1')}) + C2(${getFactorValue('C2')}) + E(${getFactorValue('E')}) = <strong>${sc}</strong>
          </div>
          <div class="formula-academic-citation">Coeficientes validados por regressão logística multivariada (R² = 0.84)</div>
        </div>

        <div class="academic-section-header">
          <div class="section-number">II</div>
          <div class="section-title">Recomendações Baseadas em Evidências</div>
          <div class="section-title-accent"></div>
        </div>

        <div class="recommendations-academic">${recHtml}</div>

        <div class="citation-footer">
          <div class="citation-text">
            <strong>Sirkin, H. L., Keenan, P., &amp; Jackson, A. (2005).</strong>
            "The Hard Side of Change Management."
            <em>Harvard Business Review, 83(10), 108–118.</em>
          </div>
          <div class="citation-source">
            <span>BCG Henderson Institute</span>
            <span>HBR Reprint R0510G</span>
          </div>
        </div>

        <div class="modal-actions-academic">
          <button class="btn-academic-primary" onclick="exportPDF()">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <polyline points="6 9 6 2 18 2 18 9"/>
              <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/>
              <rect x="6" y="14" width="12" height="8"/>
            </svg>
            Exportar como PDF
          </button>
          <button class="btn-academic-secondary" onclick="closeReport()">Fechar</button>
        </div>

      </div>
    </div>`;

  document.getElementById('reportModalContent').innerHTML = modalHtml;

  const overlay = document.getElementById('reportModal');
  overlay.classList.add('open');

  // Salva foco e move para o modal
  _lastFocusBeforeModal = document.activeElement;
  document.getElementById('reportModalContent').focus();
}

// ══════════════════════════════════════════════
// Fechamento do modal
// ══════════════════════════════════════════════

/**
 * Fecha o modal e restaura o foco para o elemento anterior.
 */
// eslint-disable-next-line no-unused-vars
function closeReport() {
  document.getElementById('reportModal').classList.remove('open');
  if (_lastFocusBeforeModal) _lastFocusBeforeModal.focus();
}

// ══════════════════════════════════════════════
// Acessibilidade: focus trap + Escape
// ══════════════════════════════════════════════

document.addEventListener('keydown', function handleModalKeydown(e) {
  const overlay = document.getElementById('reportModal');
  if (!overlay || !overlay.classList.contains('open')) return;

  // Escape fecha o modal
  if (e.key === 'Escape') {
    e.preventDefault();
    closeReport();
    return;
  }

  // Tab prende o foco dentro do modal
  if (e.key !== 'Tab') return;

  const focusableSelectors = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
  const focusable = Array.from(overlay.querySelectorAll(focusableSelectors)).filter(el => !el.disabled);
  if (!focusable.length) return;

  const first = focusable[0];
  const last  = focusable[focusable.length - 1];

  if (e.shiftKey) {
    if (document.activeElement === first) { e.preventDefault(); last.focus(); }
  } else {
    if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
  }
});

// ══════════════════════════════════════════════
// Builders de HTML do modal (privados)
// ══════════════════════════════════════════════

/**
 * Monta os cards de fator para o modal.
 * Exibe "val → comp" somente quando há multiplicador (weight > 1).
 */
function _buildFactorCards(factors) {
  return factors.map(f => {
    const scoreDisplay = f.weight > 1
      ? `${f.val} → ${f.comp}`
      : `${f.val}`;

    return `
    <div class="factor-academic-card">
      <div class="factor-academic-header">
        <div class="factor-academic-tag">${escapeHtml(f.key)}</div>
        <div class="factor-academic-name">${escapeHtml(f.name)}</div>
        <div class="factor-academic-score">${escapeHtml(scoreDisplay)}</div>
      </div>
      <div class="factor-academic-value">${escapeHtml(LABELS[f.key][f.val - 1])}</div>
      <div class="factor-academic-comment">${escapeHtml(COMMENTS[f.key][f.val - 1])}</div>
    </div>`;
  }).join('');
}

/**
 * Monta as recomendações do modal.
 */
function _buildRecommendations(z) {
  return RECS_MODAL[z].map(rec => `
    <div class="rec-academic-item">
      <div class="rec-academic-icon">${rec.icon}</div>
      <div class="rec-academic-content">
        <div class="rec-academic-title">${escapeHtml(rec.title)}</div>
        <div class="rec-academic-text">${escapeHtml(rec.text)}</div>
      </div>
    </div>`).join('');
}

/**
 * Monta um card de métrica do modal.
 */
function _buildMetricCard(label, value, sub, valueStyle = '') {
  return `
  <div class="metric-card">
    <div class="metric-badge" aria-hidden="true"></div>
    <div class="metric-label">${label}</div>
    <div class="metric-value"${valueStyle ? ` style="${valueStyle}"` : ''}>${value}</div>
    <div class="metric-sub">${sub}</div>
  </div>`;
}
