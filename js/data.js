/**
 * js/data.js
 * ─────────────────────────────────────────────
 * Toda a informação estática do modelo DICE:
 * rótulos, comentários analíticos, recomendações,
 * descrições detalhadas e interpretações por zona.
 *
 * Depende de: (nenhuma dependência)
 */

'use strict';

// ── Rótulos curtos exibidos nos cards de fator ──
// eslint-disable-next-line no-unused-vars
const LABELS = {
  D:  ['< 2 meses',       '2–4 meses',   '4–8 meses',  '> 8 meses'],
  I:  ['Muito boa',        'Boa',          'Média',       'Fraca'],
  C1: ['Muito forte',      'Favorável',    'Neutro',      'Relutante'],
  C2: ['Ansiosos',         'Dispostos',    'Relutantes',  'Fort. relutantes'],
  E:  ['< 10%',            '10–20%',       '20–40%',      '> 40%']
};

// ── Comentários analíticos curtos (modal de relatório) ──
// eslint-disable-next-line no-unused-vars
const COMMENTS = {
  D: [
    'Revisões frequentes garantem detecção precoce. Intervalo ideal.',
    'Intervalo razoável. Considere aumentar frequência.',
    'Intervalo elevado. Problemas podem acumular.',
    'Crítico. Risco aumenta exponencialmente.'
  ],
  I: [
    'Equipe altamente capaz. Principal força.',
    'Equipe competente. Verifique dedicação.',
    'Equipe com lacunas. Reforce antes do lançamento.',
    'Equipe insuficiente. Reconfiguração urgente.'
  ],
  C1: [
    'Liderança plenamente comprometida.',
    'Suporte presente, mas pode ser fortalecido.',
    'Postura neutra envia sinal ambíguo.',
    'Resistência da alta gestão é fatal.'
  ],
  C2: [
    'Equipe motivada e engajada.',
    'Disposição adequada. Mantenha comunicação.',
    'Resistência presente. Intervenções necessárias.',
    'Alta resistência. Plano de engajamento urgente.'
  ],
  E: [
    'Carga extra mínima. Baixo risco.',
    'Esforço gerenciável. Monitore sinais.',
    'Sobrecarga significativa. Remova tarefas.',
    'Nível insustentável. Alto risco de burnout.'
  ]
};

// ── Descrições longas para o PDF (por fator, por valor 1–4) ──
// eslint-disable-next-line no-unused-vars
const DETAIL = {
  D: [
    'Menos de 2 meses entre revisões formais de marco — intervalo ideal segundo o BCG. Permite detecção precoce de riscos.',
    'Entre 2 e 4 meses entre revisões — adequado para projetos de complexidade moderada.',
    'Entre 4 e 8 meses — intervalo elevado. Problemas podem acumular sem percepção da liderança.',
    'Mais de 8 meses sem revisão formal — risco exponencial. O BCG recomenda subdividir marcos imediatamente.'
  ],
  I: [
    'Equipe excelente: líder altamente capaz e respeitado, membros com habilidades adequadas e dedicação ≥ 50% ao projeto.',
    'Equipe boa: competente, mas com algumas lacunas de habilidade ou disponibilidade que merecem atenção.',
    'Equipe regular: lacunas relevantes de competência ou dedicação. Reforce a composição antes do lançamento.',
    'Equipe fraca: inadequada em múltiplas dimensões críticas. Reconfiguração urgente é necessária.'
  ],
  C1: [
    'Comprometimento muito forte: liderança comunica ativamente, com alta frequência e de forma consistente.',
    'Comprometimento favorável: suporte presente e visível, mas poderia ser mais frequente ou enfático.',
    'Postura neutra: sinal ambíguo para a organização. Funcionários tendem a interpretar como falta de prioridade.',
    'Relutância ou ausência visível da alta gestão — fator mais determinante de fracasso identificado pelo BCG.'
  ],
  C2: [
    'Colaboradores entusiasmados e engajados — apoiam ativamente a iniciativa de mudança.',
    'Colaboradores dispostos — aceitam a mudança, embora sem entusiasmo marcado.',
    'Resistência presente — intervenção de engajamento necessária; mapeie e neutralize preocupações específicas.',
    'Alta resistência ativa — requer plano estruturado de gestão da mudança antes de prosseguir.'
  ],
  E: [
    'Menos de 10% de esforço adicional — carga gerenciável. O BCG recomenda nunca ultrapassar este limite.',
    'Entre 10% e 20% de esforço extra — gerenciável, mas monitore sinais de sobrecarga.',
    'Entre 20% e 40% adicional — alto risco; remova responsabilidades não-essenciais dos envolvidos-chave.',
    'Mais de 40% adicional — insustentável. Alto risco de burnout, queda de qualidade e abandono.'
  ]
};

// ── Interpretações narrativas por zona (modal) ──
// eslint-disable-next-line no-unused-vars
const INTERP = {
  win:   'Com base na análise estatística de 225 iniciativas de mudança conduzida pelo Boston Consulting Group, este projeto apresenta <strong>alta probabilidade de atingir seus objetivos</strong>.',
  worry: 'O projeto encontra-se em zona de atenção, com <strong>resultado imprevisível</strong>. Existe risco real de desvio dos objetivos caso intervenções não sejam realizadas.',
  woe:   'O projeto encontra-se em zona de <strong>alto risco</strong>, com probabilidade significativa de fracasso ou resultado medíocre.'
};

// ── Recomendações para o modal (ícone + título + texto) ──
// eslint-disable-next-line no-unused-vars
const RECS_MODAL = {
  win: [
    { icon: '📊', title: 'Mantenha a trajetória',    text: 'A estrutura atual está alinhada com projetos de sucesso na base de dados do BCG.' },
    { icon: '📝', title: 'Documente as práticas',    text: 'Registre os fatores de sucesso para replicação em futuras iniciativas.' },
    { icon: '🔬', title: 'Monitore indicadores',     text: 'Continue acompanhando os fatores DICE em revisões trimestrais.' }
  ],
  worry: [
    { icon: '🎯', title: 'Identifique os fatores críticos',    text: 'Foque nos fatores com pontuação mais elevada para intervenção imediata.' },
    { icon: '📅', title: 'Aumente frequência de revisões',     text: 'Reduza o intervalo entre marcos para detectar desvios precocemente.' },
    { icon: '👥', title: 'Fortaleça o comprometimento',        text: 'Engaje a alta gestão para comunicação mais clara e visível.' }
  ],
  woe: [
    { icon: '🔄', title: 'Reestruture o projeto',         text: 'Reavalie escopo, equipe e cronograma antes de prosseguir.' },
    { icon: '⏸️', title: 'Considere pausa estratégica',   text: 'Avalie se o momento é adequado para continuar ou se é necessário replanejar.' },
    { icon: '📋', title: 'Auditoria independente',        text: 'Traga especialistas externos para avaliar a viabilidade do projeto.' }
  ]
};

// ── Recomendações para o PDF (numeradas, texto longo) ──
// eslint-disable-next-line no-unused-vars
const RECS_PDF = {
  win: [
    { n: '01', t: 'Mantenha a cadência de revisões formais',
      d: 'A frequência de revisões está contribuindo diretamente para o desempenho atual. Formalize checkpoints como marcos de aprendizado — não apenas de status.' },
    { n: '02', t: 'Documente e institucionalize as boas práticas',
      d: 'Projetos na Zona WIN são oportunidades raras de aprendizado organizacional. Registre os fatores que contribuíram para a boa avaliação.' },
    { n: '03', t: 'Recalcule o DICE em cada marco principal',
      d: 'O score atual não é permanente. Monitore proativamente os fatores a cada revisão e atue antes de qualquer deterioração.' },
    { n: '04', t: 'Sustente o engajamento dos colaboradores',
      d: 'Mesmo com C2 favorável, a comunicação consistente é essencial para preservar o engajamento nas fases de implementação detalhada.' }
  ],
  worry: [
    { n: '01', t: 'Priorize cirurgicamente os fatores críticos',
      d: 'Identifique os dois fatores DICE com notas mais altas e concentre toda a energia de intervenção neles.' },
    { n: '02', t: 'Aumente a frequência dos marcos de revisão',
      d: 'Se D está elevado, redefina o cronograma criando checkpoints intermediários.' },
    { n: '03', t: 'Mobilize a alta gestão para sinalização clara',
      d: 'C1 tem peso dobrado no cálculo. Uma série de ações visíveis pode impactar significativamente o score total em curto prazo.' },
    { n: '04', t: 'Mapeie e neutralize focos de resistência',
      d: 'Realize conversas 1:1 com líderes informais de opinião nas áreas mais afetadas.' }
  ],
  woe: [
    { n: '01', t: 'Avalie uma pausa estratégica antes de prosseguir',
      d: 'Antes de prosseguir com investimentos adicionais, avalie se o momento organizacional é propício.' },
    { n: '02', t: 'Recomponha a liderança e a equipe do projeto',
      d: 'O fator I tem peso dobrado no cálculo e é o preditor unitário mais forte identificado no estudo.' },
    { n: '03', t: 'Reestruture o programa em fases menores',
      d: 'Divida o projeto em iniciativas menores com escopo bem definido, marcos frequentes e equipes dedicadas.' },
    { n: '04', t: 'Implante um programa formal de gestão da resistência',
      d: 'Com C2 elevado, a resistência dos impactados é um risco estrutural que demanda tratamento específico.' }
  ]
};

// ── Mapa de cores por zona (para PDF e modal) ──
// eslint-disable-next-line no-unused-vars
const ZONE_COLORS = {
  win:   '#03A63C',
  worry: '#D97706',
  woe:   '#DC2626'
};

// eslint-disable-next-line no-unused-vars
const ZONE_BG = {
  win:   '#f0fdf4',
  worry: '#fffbeb',
  woe:   '#fef2f2'
};

// eslint-disable-next-line no-unused-vars
const ZONE_BORDER = {
  win:   '#bbf7d0',
  worry: '#fde68a',
  woe:   '#fecaca'
};

// eslint-disable-next-line no-unused-vars
const ZONE_LABEL = {
  win:   'WIN — Zona de Sucesso',
  worry: 'WORRY — Zona de Atenção',
  woe:   'WOE — Zona de Perigo'
};

// ── Cores por nível de risco (1–4) ──
// eslint-disable-next-line no-unused-vars
const RISK_COLOR = {
  1: '#03A63C',
  2: '#D97706',
  3: '#EA580C',
  4: '#DC2626'
};

// eslint-disable-next-line no-unused-vars
const RISK_LABEL = {
  1: 'BAIXO RISCO',
  2: 'MODERADO',
  3: 'ELEVADO',
  4: 'CRÍTICO'
};
