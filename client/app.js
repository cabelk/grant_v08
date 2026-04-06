const scoresEl = document.getElementById('scores');
const toggleBtn = document.getElementById('toggle');
const scorecard = document.getElementById('scorecard');

async function loadScores(){
  try{
    const r = await fetch('/api/score');
    const j = await r.json();
    renderScores(j);
  } catch(e){
    scoresEl.textContent = 'Error loading scores';
  }
}

function renderScores(data){
  scoresEl.innerHTML = '';
  const app = document.createElement('div');
  app.className = 'score-item';
  app.innerHTML = `<strong>App</strong><span>${data.appScore}</span>`;
  scoresEl.appendChild(app);
  const lom = document.createElement('div');
  lom.className = 'score-item';
  lom.innerHTML = `<strong>LOM</strong><span>${data.lomScore}</span>`;
  scoresEl.appendChild(lom);
  const list = document.createElement('div');
  list.style.marginTop = '8px';
  data.details.forEach(d => {
    const el = document.createElement('div');
    el.className = 'score-item';
    el.innerHTML = `<span>${d.id} (${d.score}/${d.max})</span><a href="${d.evidence}" target="_blank">link</a>`;
    list.appendChild(el);
  });
  scoresEl.appendChild(list);
}

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
