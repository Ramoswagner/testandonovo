/**
 * js/calc.js
 * ─────────────────────────────────────────────
 * Lógica de cálculo pura do modelo DICE.
 * Sem efeitos colaterais, sem manipulação de DOM.
 *
 * Depende de: state.js (getFactorValue)
 */

'use strict';

/**
 * Calcula o score DICE com base no estado atual.
 * Fórmula: D + 2·I + 2·C1 + C2 + E
 * @returns {number} score entre 7 e 28
 */
// eslint-disable-next-line no-unused-vars
function calcScore() {
  return getFactorValue('D')
    + 2 * getFactorValue('I')
    + 2 * getFactorValue('C1')
    + getFactorValue('C2')
    + getFactorValue('E');
}

/**
 * Retorna a zona de resultado dado um score.
 * @param {number} score
 * @returns {'win'|'worry'|'woe'}
 */
// eslint-disable-next-line no-unused-vars
function zone(score) {
  if (score <= 14) return 'win';
  if (score <= 17) return 'worry';
  return 'woe';
}

/**
 * Retorna o label curto da zona.
 * @param {number} score
 * @returns {'WIN'|'WORRY'|'WOE'}
 */
// eslint-disable-next-line no-unused-vars
function zoneLabel(score) {
  if (score <= 14) return 'WIN';
  if (score <= 17) return 'WORRY';
  return 'WOE';
}

/**
 * Retorna a mensagem de resultado exibida no bloco principal.
 * @param {'win'|'worry'|'woe'} z
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function msg(z) {
  if (z === 'win')   return 'Alta probabilidade de sucesso. Mantenha a gestão do projeto como está.';
  if (z === 'worry') return 'Zona de atenção. Identifique os fatores críticos e atue para reduzir o escore.';
  return 'Zona crítica. Alta probabilidade de fracasso. Ações corretivas imediatas necessárias.';
}

/**
 * Retorna a probabilidade de sucesso textual por zona.
 * @param {'win'|'worry'|'woe'} z
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function successProb(z) {
  if (z === 'win')   return '>85%';
  if (z === 'worry') return '50–70%';
  return '<30%';
}

/**
 * Retorna o nível de risco textual por zona.
 * @param {'win'|'worry'|'woe'} z
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function riskLevel(z) {
  if (z === 'win')   return 'Baixo';
  if (z === 'worry') return 'Moderado';
  return 'Elevado';
}

/**
 * Retorna a taxa de casos similares bem-sucedidos
 * a partir do estudo n=225 do BCG.
 * @param {'win'|'worry'|'woe'} z
 * @returns {string}
 */
// eslint-disable-next-line no-unused-vars
function similarCases(z) {
  if (z === 'win')   return '78%';
  if (z === 'worry') return '45%';
  return '12%';
}

/**
 * Retorna os fatores formatados para relatórios.
 * Cada objeto contém key, name, val bruto, comp ponderado e max.
 * @returns {Array<{key, name, val, comp, max, weight}>}
 */
// eslint-disable-next-line no-unused-vars
function getFactorsSummary() {
  return [
    { key: 'D',  name: 'Duração',     val: getFactorValue('D'),  comp: getFactorValue('D'),           max: 4, weight: 1 },
    { key: 'I',  name: 'Integridade', val: getFactorValue('I'),  comp: 2 * getFactorValue('I'),       max: 8, weight: 2 },
    { key: 'C1', name: 'Alta Gestão', val: getFactorValue('C1'), comp: 2 * getFactorValue('C1'),      max: 8, weight: 2 },
    { key: 'C2', name: 'Impactados',  val: getFactorValue('C2'), comp: getFactorValue('C2'),           max: 4, weight: 1 },
    { key: 'E',  name: 'Esforço',     val: getFactorValue('E'),  comp: getFactorValue('E'),            max: 4, weight: 1 }
  ];
}

/**
 * Retorna os fatores com as descrições longas para o PDF.
 * @returns {Array}
 */
// eslint-disable-next-line no-unused-vars
function getFactorsForPDF() {
  return [
    { key: 'D',  long: 'D — Duração entre marcos de revisão',               val: getFactorValue('D'),  comp: getFactorValue('D'),       max: 4, weight: 1 },
    { key: 'I',  long: 'I — Integridade e capacidade da equipe',            val: getFactorValue('I'),  comp: 2 * getFactorValue('I'),   max: 8, weight: 2 },
    { key: 'C1', long: 'C1 — Compromisso da alta gestão',                   val: getFactorValue('C1'), comp: 2 * getFactorValue('C1'),  max: 8, weight: 2 },
    { key: 'C2', long: 'C2 — Compromisso dos colaboradores impactados',     val: getFactorValue('C2'), comp: getFactorValue('C2'),       max: 4, weight: 1 },
    { key: 'E',  long: 'E — Esforço adicional exigido',                     val: getFactorValue('E'),  comp: getFactorValue('E'),        max: 4, weight: 1 }
  ];
}
