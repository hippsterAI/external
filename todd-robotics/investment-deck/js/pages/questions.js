/**
 * pages/questions.js — Q&A page renderer.
 * All Q&A content lives in QA_DATA in config.js — edit there to add/update questions.
 */

window.renderQuestions = function() {
  const rows = QA_DATA.map(section => `
    <div class="qm-sec">${section.section}</div>
    ${section.questions.map(q => `
      <div class="qm-row">
        <div class="qm-q">
          <span class="qm-n">${q.n}</span>
          <span class="qm-t">${q.q}</span>
        </div>
        <div class="qm-a">${q.a}</div>
      </div>
    `).join('')}
  `).join('');

  setContent(`
    ${pageHeader('Your <span>Questions</span>', `// ${QA_DATA.reduce((t, s) => t + s.questions.length, 0)} questions · straight answers · everything visible`)}
    ${rows}
  `);
};
