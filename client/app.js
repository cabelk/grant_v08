const scoresEl = document.getElementById('scores');
const toggleBtn = document.getElementById('toggle');
const scorecard = document.getElementById('scorecard');

async function loadScores(){
  try{
    const r = await fetch('/api/score');
    if (!r.ok) throw new Error('api failed');
    const j = await r.json();
    renderScores(j);
  } catch(e){
    // fallback to bundled scorecard.json for static hosting (gh-pages)
    try {
      const r2 = await fetch('./scorecard.json');
      if (r2.ok) {
        const j2 = await r2.json();
        renderScores(j2);
        return;
      }
    } catch(_){}
    scoresEl.textContent = 'Error loading scores';
  }
}

// Executive summary fetch & toggle
const execToggle = document.getElementById('execToggle');
const execSummary = document.getElementById('execSummary');
execToggle.addEventListener('click', async () => {
  if (execSummary.style.display === 'none') {
    // load the markdown file and render simple formatting
    try {
      const r = await fetch('./executive-summary.md');
      if (r.ok) {
        const text = await r.text();
        execSummary.textContent = text;
      } else {
        execSummary.textContent = 'Executive summary not available';
      }
    } catch (e) {
      execSummary.textContent = 'Executive summary not available';
    }
    execSummary.style.display = 'block';
    execToggle.textContent = 'Hide Executive Summary';
  } else {
    execSummary.style.display = 'none';
    execToggle.textContent = 'Executive Summary';
  }
});

function renderScores(data){
  scoresEl.innerHTML = '';
  // header summary
  const header = document.createElement('div');
  header.className = 'score-item';
  header.innerHTML = `<strong>App</strong><span>${data.appScore}</span>`;
  scoresEl.appendChild(header);
  const header2 = document.createElement('div');
  header2.className = 'score-item';
  header2.innerHTML = `<strong>LOM</strong><span>${data.lomScore}</span>`;
  scoresEl.appendChild(header2);

  const list = document.createElement('div');
  list.style.marginTop = '8px';
  data.details.forEach(d => {
    const el = document.createElement('div');
    el.className = 'score-item';
    const pct = Math.round((d.score / d.max) * 100);
    el.innerHTML = `<div style="width:70%"><strong>${d.id}</strong><div class=\"scorebar\"><i style=\"width:${pct}%\"></i></div></div><div style=\"text-align:right;min-width:56px\">${d.score}/${d.max}<div><a href=\"${d.evidence}\" target=\"_blank\">evidence</a></div></div>`;
    list.appendChild(el);
  });
  scoresEl.appendChild(list);
  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = `Updated: ${new Date(data.generated_at).toLocaleString()}`;
  scoresEl.appendChild(meta);

  // CI evidence card
  if (data.ci) {
    const ciCard = document.createElement('div');
    ciCard.className = 'ci-card';
    const passed = data.ci.e2e_passed ? 'passed' : 'failed';
    const runLink = data.ci.run_url ? `<a href="${data.ci.run_url}" target="_blank">CI run</a>` : 'CI run';
    ciCard.innerHTML = `<strong>CI</strong><span class="ci-${passed}">${passed}</span><div style="font-size:12px;margin-top:6px">${runLink} • <a href="#" id="viewScorecard">View scorecard</a></div>`;
    scoresEl.appendChild(ciCard);
  }
}

// Modal interactions for viewing CI scorecard JSON
document.addEventListener('click', (ev) => {
  if (ev.target && ev.target.id === 'viewScorecard') {
    ev.preventDefault();
    fetch('/api/score').then(r => r.json()).then(j => {
      const modal = document.getElementById('modal');
      const pre = document.getElementById('modalContent');
      pre.textContent = JSON.stringify(j, null, 2);
      modal.setAttribute('aria-hidden', 'false');
    }).catch(() => alert('Failed to load scorecard'));
  }
});

document.getElementById('modalClose').addEventListener('click', ()=>{
  document.getElementById('modal').setAttribute('aria-hidden','true');
});

// close modal on backdrop click
document.querySelector('.modal-backdrop').addEventListener('click', ()=>{
  document.getElementById('modal').setAttribute('aria-hidden','true');
});

toggleBtn.addEventListener('click', ()=>{
  if (scorecard.style.height && scorecard.style.height !== '40px'){
    scorecard.style.height = '40px';
    toggleBtn.textContent = 'Expand';
  } else {
    scorecard.style.height = '';
    toggleBtn.textContent = 'Collapse';
  }
});

// Simple drag
const handle = scorecard.querySelector('.handle');
let dragging=false, offsetX=0, offsetY=0;
handle.addEventListener('pointerdown', e=>{ dragging=true; offsetX=e.clientX - scorecard.offsetLeft; offsetY=e.clientY - scorecard.offsetTop; handle.setPointerCapture(e.pointerId);});
window.addEventListener('pointermove', e=>{ if(!dragging) return; scorecard.style.left = (e.clientX - offsetX) + 'px'; scorecard.style.top = (e.clientY - offsetY) + 'px'; scorecard.style.right='auto'; scorecard.style.bottom='auto'; });
window.addEventListener('pointerup', e=>{ dragging=false; });

loadScores();
