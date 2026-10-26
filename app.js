/* ============================================================
   STATE
   ============================================================ */
/* ================= STATE ================= */
let state = {
  examPeriod: { days: 4, slots: [{label:'9:00–12:00'}, {label:'14:00–17:00'}] },
  subjects: [],
  rooms: [],
  candidates: [],       // [{assignment, score, breakdown, feasible}]
  selectedCandidate: 0
};
let uidCounter = 1;
function uid(prefix){ return prefix + (uidCounter++); }

/* ================= SAMPLE DATA ================= */
function sampleData(){
  state.examPeriod = { days: 5, slots: [{label:'9:00–12:00'}, {label:'14:00–17:00'}] };
  state.rooms = [
    { id: uid('r'), name:'Room A101', capacity:60, type:'classroom' },
    { id: uid('r'), name:'Room A102', capacity:60, type:'classroom' },
    { id: uid('r'), name:'Room B201', capacity:50, type:'classroom' },
    { id: uid('r'), name:'Lab L1', capacity:30, type:'lab' },
    { id: uid('r'), name:'Lab L2', capacity:30, type:'lab' },
    { id: uid('r'), name:'Main Hall', capacity:220, type:'hall' },
  ];
  state.subjects = [
    { id: uid('s'), code:'CS301', name:'Data Structures', group:'CSE-3A', faculty:'Dr. Rao', size:55, difficulty:'hard', roomType:'classroom' },
    { id: uid('s'), code:'CS302', name:'Operating Systems', group:'CSE-3A', faculty:'Dr. Iyer', size:55, difficulty:'hard', roomType:'classroom' },
    { id: uid('s'), code:'CS303', name:'DBMS Lab', group:'CSE-3A', faculty:'Dr. Rao', size:28, difficulty:'medium', roomType:'lab' },
    { id: uid('s'), code:'CS304', name:'Computer Networks', group:'CSE-3A', faculty:'Dr. Kapoor', size:55, difficulty:'medium', roomType:'classroom' },
    { id: uid('s'), code:'EC301', name:'Signals & Systems', group:'ECE-3B', faculty:'Dr. Menon', size:50, difficulty:'hard', roomType:'classroom' },
    { id: uid('s'), code:'EC302', name:'VLSI Design', group:'ECE-3B', faculty:'Dr. Nair', size:50, difficulty:'medium', roomType:'classroom' },
    { id: uid('s'), code:'EC303', name:'Microprocessors Lab', group:'ECE-3B', faculty:'Dr. Menon', size:26, difficulty:'medium', roomType:'lab' },
    { id: uid('s'), code:'EC304', name:'Digital Communication', group:'ECE-3B', faculty:'Dr. Pillai', size:50, difficulty:'hard', roomType:'classroom' },
    { id: uid('s'), code:'GE301', name:'Engineering Maths III', group:'CSE-3A,ECE-3B', faculty:'Dr. Verma', size:105, difficulty:'medium', roomType:'hall' },
    { id: uid('s'), code:'ME301', name:'Thermodynamics', group:'MECH-3C', faculty:'Dr. Subram.', size:48, difficulty:'hard', roomType:'classroom' },
    { id: uid('s'), code:'ME302', name:'Fluid Mechanics', group:'MECH-3C', faculty:'Dr. Kulkarni', size:48, difficulty:'medium', roomType:'classroom' },
    { id: uid('s'), code:'ME303', name:'Manufacturing Lab', group:'MECH-3C', faculty:'Dr. Subram.', size:24, difficulty:'easy', roomType:'lab' },
  ];
}

/* ============================================================
   SETUP-UI
   ============================================================ */
/* ================= RENDER: SETUP ================= */
function renderSlots(){
  const wrap = document.getElementById('slotList');
  wrap.innerHTML = '';
  state.examPeriod.slots.forEach((slot, i) => {
    const row = document.createElement('div');
    row.className = 'slot-row';
    row.innerHTML = `
      <input type="text" class="mono" data-slot-idx="${i}" value="${escapeAttr(slot.label)}" placeholder="e.g. 9:00–12:00">
      <button class="icon-btn" data-remove-slot="${i}" title="Remove slot">×</button>
    `;
    wrap.appendChild(row);
  });
}

function renderSubjects(){
  const body = document.getElementById('subjectsBody');
  body.innerHTML = '';
  state.subjects.forEach(subj => {
    const tr = document.createElement('tr');
    tr.dataset.id = subj.id;
    tr.innerHTML = `
      <td><input type="text" class="mono" data-field="code" value="${escapeAttr(subj.code)}"></td>
      <td><input type="text" data-field="name" value="${escapeAttr(subj.name)}"></td>
      <td><input type="text" data-field="group" value="${escapeAttr(subj.group)}" placeholder="e.g. CSE-3A"></td>
      <td><input type="text" data-field="faculty" value="${escapeAttr(subj.faculty)}"></td>
      <td><input type="number" min="1" data-field="size" value="${subj.size}"></td>
      <td>
        <select data-field="difficulty">
          <option value="easy" ${subj.difficulty==='easy'?'selected':''}>Easy</option>
          <option value="medium" ${subj.difficulty==='medium'?'selected':''}>Medium</option>
          <option value="hard" ${subj.difficulty==='hard'?'selected':''}>Hard</option>
        </select>
      </td>
      <td>
        <select data-field="roomType">
          <option value="classroom" ${subj.roomType==='classroom'?'selected':''}>Classroom</option>
          <option value="lab" ${subj.roomType==='lab'?'selected':''}>Lab</option>
          <option value="hall" ${subj.roomType==='hall'?'selected':''}>Hall</option>
        </select>
      </td>
      <td><button class="icon-btn" data-remove-subject="${subj.id}" title="Remove">×</button></td>
    `;
    body.appendChild(tr);
  });
}

function renderRooms(){
  const body = document.getElementById('roomsBody');
  body.innerHTML = '';
  state.rooms.forEach(room => {
    const tr = document.createElement('tr');
    tr.dataset.id = room.id;
    tr.innerHTML = `
      <td><input type="text" data-field="name" value="${escapeAttr(room.name)}"></td>
      <td><input type="number" min="1" data-field="capacity" value="${room.capacity}"></td>
      <td>
        <select data-field="type">
          <option value="classroom" ${room.type==='classroom'?'selected':''}>Classroom</option>
          <option value="lab" ${room.type==='lab'?'selected':''}>Lab</option>
          <option value="hall" ${room.type==='hall'?'selected':''}>Hall</option>
        </select>
      </td>
      <td><button class="icon-btn" data-remove-room="${room.id}" title="Remove">×</button></td>
    `;
    body.appendChild(tr);
  });
}

function escapeAttr(str){
  return String(str==null?'':str).replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;');
}

function renderSetup(){
  document.getElementById('daysInput').value = state.examPeriod.days;
  renderSlots();
  renderSubjects();
  renderRooms();
}

/* ================= SETUP EVENT WIRING ================= */
document.getElementById('daysInput').addEventListener('input', e => {
  const v = parseInt(e.target.value, 10);
  state.examPeriod.days = (isNaN(v) || v < 1) ? 1 : Math.min(v, 21);
});

document.getElementById('addSlotBtn').addEventListener('click', () => {
  state.examPeriod.slots.push({ label: 'New slot' });
  renderSlots();
});

document.getElementById('slotList').addEventListener('input', e => {
  const idx = e.target.getAttribute('data-slot-idx');
  if (idx !== null) state.examPeriod.slots[+idx].label = e.target.value;
});
document.getElementById('slotList').addEventListener('click', e => {
  const idx = e.target.getAttribute('data-remove-slot');
  if (idx !== null){
    if (state.examPeriod.slots.length <= 1){ toast('At least one slot per day is required.'); return; }
    state.examPeriod.slots.splice(+idx, 1);
    renderSlots();
  }
});

document.getElementById('addSubjectBtn').addEventListener('click', () => {
  state.subjects.push({ id: uid('s'), code:'', name:'', group:'', faculty:'', size:30, difficulty:'medium', roomType:'classroom' });
  renderSubjects();
});
document.getElementById('subjectsBody').addEventListener('input', e => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const subj = state.subjects.find(s => s.id === tr.dataset.id); if (!subj) return;
  const field = e.target.getAttribute('data-field');
  if (!field) return;
  subj[field] = (field === 'size') ? Math.max(1, parseInt(e.target.value,10) || 1) : e.target.value;
});
document.getElementById('subjectsBody').addEventListener('click', e => {
  const id = e.target.getAttribute('data-remove-subject');
  if (id){ state.subjects = state.subjects.filter(s => s.id !== id); renderSubjects(); }
});

document.getElementById('addRoomBtn').addEventListener('click', () => {
  state.rooms.push({ id: uid('r'), name:'', capacity:40, type:'classroom' });
  renderRooms();
});
document.getElementById('roomsBody').addEventListener('input', e => {
  const tr = e.target.closest('tr'); if (!tr) return;
  const room = state.rooms.find(r => r.id === tr.dataset.id); if (!room) return;
  const field = e.target.getAttribute('data-field');
  if (!field) return;
  room[field] = (field === 'capacity') ? Math.max(1, parseInt(e.target.value,10) || 1) : e.target.value;
});
document.getElementById('roomsBody').addEventListener('click', e => {
  const id = e.target.getAttribute('data-remove-room');
  if (id){ state.rooms = state.rooms.filter(r => r.id !== id); renderRooms(); }
});

document.getElementById('loadSampleBtn').addEventListener('click', () => {
  sampleData();
  renderSetup();
});
document.getElementById('clearSubjectsBtn').addEventListener('click', () => {
  if (!confirm('Remove all subjects?')) return;
  state.subjects = []; renderSubjects();
});
document.getElementById('clearRoomsBtn').addEventListener('click', () => {
  if (!confirm('Remove all rooms?')) return;
  state.rooms = []; renderRooms();
});

/* ================= TABS ================= */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('view-' + btn.dataset.tab).classList.add('active');
  });
});

/* ============================================================
   SOLVER
   ============================================================ */
/* ================= SOLVER CORE ================= */
function groupsOf(subject){ return subject.group.split(',').map(g=>g.trim()).filter(Boolean); }
function groupsOverlap(a,b){ const ga=groupsOf(a), gb=groupsOf(b); return ga.some(g=>gb.includes(g)); }

function roomCompatible(room, subject){
  if (subject.roomType === 'hall') return room.type === 'hall';
  if (subject.roomType === 'lab') return room.type === 'lab';
  return room.type === 'classroom' || room.type === 'hall';
}

function buildSlotsList(examPeriod){
  const slots = [];
  for (let d=0; d<examPeriod.days; d++){
    for (let s=0; s<examPeriod.slots.length; s++) slots.push({day:d, slot:s});
  }
  return slots;
}

function buildInitialDomains(subjects, rooms, slotList){
  const domains = {};
  for (const subj of subjects){
    const compatibleRooms = rooms.filter(r => r.capacity >= subj.size && roomCompatible(r, subj));
    const domain = [];
    for (const sl of slotList){
      for (const r of compatibleRooms) domain.push({ day: sl.day, slot: sl.slot, roomId: r.id });
    }
    domains[subj.id] = domain;
  }
  return domains;
}

function conflictsVal(subjA, valA, subjB, valB){
  if (valA.day === valB.day && valA.slot === valB.slot){
    if (valA.roomId === valB.roomId) return 'room';
    if (groupsOverlap(subjA, subjB)) return 'group';
    if (subjA.faculty && subjA.faculty === subjB.faculty) return 'faculty';
  }
  return null;
}

function mulberry32(seed){
  return function(){
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pickMRV(unassigned, domains, rng){
  let bestSize = Infinity, ties = [];
  for (const id of unassigned){
    const size = domains[id].length;
    if (size < bestSize){ bestSize = size; ties = [id]; }
    else if (size === bestSize) ties.push(id);
  }
  return ties[Math.floor(rng()*ties.length)];
}

function forwardCheck(assignedId, assignedVal, unassigned, domains, subjectsById){
  const removed = {};
  for (const id of unassigned){
    if (id === assignedId) continue;
    const before = domains[id];
    const kept = [], rem = [];
    for (const v of before){
      if (conflictsVal(subjectsById[assignedId], assignedVal, subjectsById[id], v)) rem.push(v);
      else kept.push(v);
    }
    if (rem.length){ domains[id] = kept; removed[id] = rem; }
  }
  return removed;
}
function restoreDomains(removed, domains){
  for (const id in removed) domains[id] = domains[id].concat(removed[id]);
}

function backtrack(unassigned, domains, assignment, subjectsById, rng, stats, deadline){
  if (Date.now() > deadline){ stats.timedOut = true; return null; }
  if (unassigned.length === 0) return assignment;
  stats.nodes++;
  const id = pickMRV(unassigned, domains, rng);
  const rest = unassigned.filter(u => u !== id);
  const values = domains[id].slice().sort(() => rng()-0.5);
  for (const val of values){
    let ok = true;
    for (const otherId in assignment){
      if (conflictsVal(subjectsById[id], val, subjectsById[otherId], assignment[otherId])){ ok = false; break; }
    }
    if (!ok) continue;
    assignment[id] = val;
    const savedDomain = domains[id];
    domains[id] = [val];
    const removed = forwardCheck(id, val, rest, domains, subjectsById);
    const emptyDomain = rest.some(rid => domains[rid].length === 0);
    if (!emptyDomain){
      const result = backtrack(rest, domains, assignment, subjectsById, rng, stats, deadline);
      if (result) return result;
    } else {
      stats.backtracks++;
    }
    restoreDomains(removed, domains);
    domains[id] = savedDomain;
    delete assignment[id];
    if (Date.now() > deadline){ stats.timedOut = true; return null; }
  }
  return null;
}

function solveOnce(subjects, rooms, examPeriod, seed, budgetMs){
  const slotList = buildSlotsList(examPeriod);
  const domains = buildInitialDomains(subjects, rooms, slotList);
  const subjectsById = {}; subjects.forEach(s => subjectsById[s.id] = s);
  const rng = mulberry32(seed);
  const unassigned = subjects.map(s=>s.id).sort(()=>rng()-0.5);
  const stats = { nodes:0, backtracks:0, timedOut:false };
  const t0 = Date.now();
  const assignment = backtrack(unassigned, domains, {}, subjectsById, rng, stats, t0 + budgetMs);
  stats.timeMs = Date.now() - t0;
  return { assignment, stats, feasible: !!assignment };
}

/* ---- soft-constraint scoring & explanation ---- */
function scoreAssignment(assignment, subjects){
  const subjectsById = {}; subjects.forEach(s => subjectsById[s.id] = s);
  const groupSet = new Set();
  subjects.forEach(s => groupsOf(s).forEach(g => groupSet.add(g)));
  const groups = [...groupSet];

  let penalty = 0;
  const notes = [];

  // Difficulty clustering: hard exams for same group same day / consecutive day
  for (const g of groups){
    const examsOfGroup = subjects.filter(s => groupsOf(s).includes(g) && assignment[s.id]);
    for (let i=0;i<examsOfGroup.length;i++){
      for (let j=i+1;j<examsOfGroup.length;j++){
        const a = examsOfGroup[i], b = examsOfGroup[j];
        if (a.difficulty !== 'hard' || b.difficulty !== 'hard') continue;
        const va = assignment[a.id], vb = assignment[b.id];
        const dayDiff = Math.abs(va.day - vb.day);
        if (dayDiff === 0){
          penalty += 10;
          notes.push(`${g}: ${a.code} and ${b.code} are both hard exams on the same day (Day ${va.day+1}) (−10)`);
        } else if (dayDiff === 1){
          penalty += 4;
          notes.push(`${g}: ${a.code} and ${b.code} are hard exams on consecutive days (Day ${Math.min(va.day,vb.day)+1} → ${Math.max(va.day,vb.day)+1}) (−4)`);
        }
      }
    }
  }

  // Daily load balance: fair share = ceil(count/days)
  const daysCount = state.examPeriod.days; // fair share is judged over the whole exam period
  for (const g of groups){
    const examsOfGroup = subjects.filter(s => groupsOf(s).includes(g) && assignment[s.id]);
    if (!examsOfGroup.length) continue;
    const fairShare = Math.max(1, Math.ceil(examsOfGroup.length / Math.max(daysCount,1)));
    const perDay = {};
    examsOfGroup.forEach(s => { const d = assignment[s.id].day; perDay[d] = (perDay[d]||0)+1; });
    Object.keys(perDay).forEach(d => {
      const excess = perDay[d] - fairShare;
      if (excess > 0){
        penalty += excess * 3;
        notes.push(`${g}: Day ${(+d)+1} has ${perDay[d]} exams vs a fair share of ${fairShare} (−${excess*3})`);
      }
    });
  }

  const score = Math.max(0, Math.min(100, 100 - penalty));
  return { score, penalty, notes };
}

function assignmentSignature(assignment){
  return Object.keys(assignment).sort().map(k => `${k}:${assignment[k].day}-${assignment[k].slot}-${assignment[k].roomId}`).join('|');
}

function generateCandidates(subjects, rooms, examPeriod){
  const seenSigs = new Set();
  const feasibleCandidates = [];
  let anyFeasible = false;
  const maxSeeds = 30;
  const perSolveBudget = 250; // ms
  const overallDeadline = Date.now() + 4000;

  for (let seed=1; seed<=maxSeeds; seed++){
    if (Date.now() > overallDeadline) break;
    const r = solveOnce(subjects, rooms, examPeriod, seed, perSolveBudget);
    if (r.feasible){
      anyFeasible = true;
      const imp = improve(r.assignment, subjects, rooms, examPeriod); // local search (optimizer.js)
      r.stats.moves = imp.moves;
      const sig = assignmentSignature(r.assignment);
      if (!seenSigs.has(sig)){
        seenSigs.add(sig);
        const { score, penalty, notes } = scoreAssignment(r.assignment, subjects);
        feasibleCandidates.push({ assignment:r.assignment, score, penalty, notes, stats:r.stats });
      }
    }
    if (feasibleCandidates.length >= 4) break;
  }
  feasibleCandidates.sort((a,b) => b.score - a.score);
  return { candidates: feasibleCandidates.slice(0,3), feasible: anyFeasible, triedSeeds: Math.min(maxSeeds, seenSigs.size || maxSeeds) };
}

/* ============================================================
   OPTIMIZER
   ============================================================ */
/* Moves one exam at a time to another hard-valid (day, slot, room); keeps the move only if the penalty drops. */
function improve(assignment, subjects, rooms, period, iterations = 500){
  const domains = buildInitialDomains(subjects, rooms, buildSlotsList(period));
  let best = scoreAssignment(assignment, subjects).penalty, moves = 0;
  for (let i = 0; i < iterations && best > 0; i++){
    const s = subjects[Math.floor(Math.random() * subjects.length)];
    const dom = domains[s.id]; if (!dom.length) continue;
    const v = dom[Math.floor(Math.random() * dom.length)], old = assignment[s.id];
    if (old.day === v.day && old.slot === v.slot && old.roomId === v.roomId) continue;
    if (subjects.some(o => o.id !== s.id && conflictsVal(s, v, o, assignment[o.id]))) continue; // hard constraints stay intact
    assignment[s.id] = v;
    const p = scoreAssignment(assignment, subjects).penalty;
    if (p < best){ best = p; moves++; } else assignment[s.id] = old;
  }
  return { moves };
}

/* ============================================================
   RESULTS-UI
   ============================================================ */
/* ================= GENERATE BUTTON ================= */
document.getElementById('generateBtn').addEventListener('click', () => {
  if (state.subjects.length === 0){ toast('Add at least one subject in Setup first.'); return; }
  if (state.rooms.length === 0){ toast('Add at least one room in Setup first.'); return; }

  const btn = document.getElementById('generateBtn');
  btn.disabled = true; btn.textContent = 'Generating…';

  setTimeout(() => {
    const t0 = performance.now();
    const { candidates, feasible } = generateCandidates(state.subjects, state.rooms, state.examPeriod);
    const elapsed = Math.round(performance.now() - t0);

    state.candidates = candidates;
    state.selectedCandidate = 0;

    btn.disabled = false; btn.textContent = '✦ Generate Timetable';

    if (!feasible){
      showInfeasible(elapsed);
      return;
    }
    renderTimetableView(elapsed);
    renderCompareView();
    renderCheckView();

    // switch to timetable tab
    document.querySelector('.tab-btn[data-tab="timetable"]').click();
  }, 30);
});

function showInfeasible(elapsed){
  document.getElementById('timetableEmpty').style.display = 'block';
  document.getElementById('timetableEmpty').innerHTML = `
    <h3>No conflict-free timetable found</h3>
    <div>The constraints as configured couldn't be satisfied within the search budget (${elapsed} ms). Try adding more rooms, more exam days, or check for subjects that need a room type you haven't defined.</div>`;
  document.getElementById('timetableContent').style.display = 'none';
  document.getElementById('compareEmpty').style.display = 'block';
  document.getElementById('compareContent').style.display = 'none';
  document.getElementById('checkEmpty').style.display = 'block';
  document.getElementById('checkContent').style.display = 'none';
  document.querySelector('.tab-btn[data-tab="timetable"]').click();
}

/* ================= RENDER: TIMETABLE ================= */
function currentCandidate(){ return state.candidates[state.selectedCandidate]; }

function renderTimetableView(elapsedMs){
  document.getElementById('timetableEmpty').style.display = 'none';
  document.getElementById('timetableContent').style.display = 'block';

  const cand = currentCandidate();
  document.getElementById('solverSummary').textContent =
    `Backtracking search with MRV variable ordering and forward-checking constraint propagation, run across multiple restarts to compare candidate timetables.`;
  document.getElementById('solverStats').innerHTML = `
    <span>Search nodes: <strong>${cand.stats.nodes}</strong></span>
    <span>Backtracks: <strong>${cand.stats.backtracks}</strong></span>
    <span>Solve time: <strong>${cand.stats.timeMs} ms</strong></span>
    <span>Local-search moves: <strong>${cand.stats.moves||0}</strong></span>
      <span>Total run time: <strong>${elapsedMs} ms</strong></span>
  `;

  document.getElementById('hardComplianceNum').textContent = '100%';
  document.getElementById('optScoreNum').textContent = cand.score + '/100';
  document.getElementById('candidateCountNum').textContent = state.candidates.length;

  populateFilters();
  renderGrid();
}

function populateFilters(){
  const groupSel = document.getElementById('filterGroup');
  const facSel = document.getElementById('filterFaculty');
  const roomSel = document.getElementById('filterRoom');
  const groups = new Set(), facs = new Set();
  state.subjects.forEach(s => { groupsOf(s).forEach(g=>groups.add(g)); if (s.faculty) facs.add(s.faculty); });

  groupSel.innerHTML = '<option value="">All groups</option>' + [...groups].sort().map(g=>`<option value="${escapeAttr(g)}">${escapeAttr(g)}</option>`).join('');
  facSel.innerHTML = '<option value="">All faculty</option>' + [...facs].sort().map(f=>`<option value="${escapeAttr(f)}">${escapeAttr(f)}</option>`).join('');
  roomSel.innerHTML = '<option value="">All rooms</option>' + state.rooms.map(r=>`<option value="${r.id}">${escapeAttr(r.name)}</option>`).join('');

  [groupSel, facSel, roomSel].forEach(sel => sel.onchange = renderGrid);
}

function renderGrid(){
  const cand = currentCandidate();
  if (!cand) return;
  const assignment = cand.assignment;
  const groupFilter = document.getElementById('filterGroup').value;
  const facFilter = document.getElementById('filterFaculty').value;
  const roomFilter = document.getElementById('filterRoom').value;

  const grid = document.getElementById('ttGrid');
  const nSlots = state.examPeriod.slots.length;
  grid.style.gridTemplateColumns = `70px repeat(${nSlots}, 1fr)`;
  grid.innerHTML = '';

  // header row
  grid.appendChild(el('div', 'tt-head-cell', ''));
  state.examPeriod.slots.forEach(sl => {
    grid.appendChild(el('div', 'tt-head-cell mono', sl.label));
  });

  const roomsById = {}; state.rooms.forEach(r => roomsById[r.id] = r);

  for (let d=0; d<state.examPeriod.days; d++){
    grid.appendChild(el('div', 'tt-day-label', 'Day ' + (d+1)));
    for (let s=0; s<nSlots; s++){
      const cell = document.createElement('div');
      const examsHere = state.subjects.filter(subj => {
        const v = assignment[subj.id];
        if (!v || v.day !== d || v.slot !== s) return false;
        if (groupFilter && !groupsOf(subj).includes(groupFilter)) return false;
        if (facFilter && subj.faculty !== facFilter) return false;
        if (roomFilter && v.roomId !== roomFilter) return false;
        return true;
      });
      cell.className = 'tt-cell' + (examsHere.length ? '' : ' empty');
        cell.dataset.day = d; cell.dataset.slot = s;
      examsHere.forEach(subj => {
        const v = assignment[subj.id];
        const room = roomsById[v.roomId];
        const chip = document.createElement('div');
        chip.className = 'exam-chip d-' + subj.difficulty;
          chip.draggable = true; chip.dataset.id = subj.id;
        chip.innerHTML = `
          <div class="top-row"><span class="diff-dot diff-${subj.difficulty}"></span>${escapeAttr(subj.code)}</div>
          <div class="meta">${escapeAttr(groupsOf(subj).join(', '))} · ${escapeAttr(subj.faculty)}</div>
          <div class="meta mono">${room?escapeAttr(room.name):'—'}</div>
        `;
        cell.appendChild(chip);
      });
      grid.appendChild(cell);
    }
  }
}

function el(tag, cls, text){ const e=document.createElement(tag); e.className=cls; e.textContent=text; return e; }

/* ================= RENDER: COMPARE ================= */
function renderCompareView(){
  document.getElementById('compareEmpty').style.display = 'none';
  document.getElementById('compareContent').style.display = 'block';
  const grid = document.getElementById('compareGrid');
  grid.innerHTML = '';

  state.candidates.forEach((cand, idx) => {
    const card = document.createElement('div');
    card.className = 'cand-card' + (idx === 0 ? ' winner' : '');
    const noteItems = cand.notes.slice(0,4).map(n => `<li>${escapeAttr(n)}</li>`).join('');
    card.innerHTML = `
      ${idx===0 ? '<div class="cand-tag">Selected</div>' : ''}
      <div style="font-size:12.5px; color:var(--ink-soft); font-weight:600;">Candidate ${idx+1}</div>
      <div class="cand-score">${cand.score}<span style="font-size:14px; color:var(--ink-faint);">/100</span></div>
      <div style="font-size:12px; color:var(--ink-faint); margin-top:2px;">100% hard-constraint compliant</div>
      <ul class="cand-list">${noteItems || '<li>No soft-constraint penalties found.</li>'}</ul>
      ${idx!==0 ? `<div class="table-toolbar" style="justify-content:flex-start; margin-top:14px;"><button class="btn btn-ghost btn-sm" data-view-cand="${idx}">View this timetable</button></div>` : ''}
    `;
    grid.appendChild(card);
  });

  grid.querySelectorAll('[data-view-cand]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.selectedCandidate = parseInt(btn.getAttribute('data-view-cand'),10);
      renderTimetableView(0);
      renderCheckView();
      document.querySelector('.tab-btn[data-tab="timetable"]').click();
    });
  });

  const whyPanel = document.getElementById('whyPanel');
  const whyList = document.getElementById('whyList');
  if (state.candidates.length > 1){
    const best = state.candidates[0], runnerUp = state.candidates[1];
    whyPanel.style.display = 'block';
    const diff = runnerUp.score - best.score; // negative, best - runnerUp actually
    const gap = best.score - runnerUp.score;
    const items = [];
    items.push(`Candidate 1 scores ${best.score}/100 versus ${runnerUp.score}/100 for the next-best option — a ${gap}-point margin, entirely from soft-constraint penalties since every candidate satisfies all hard constraints.`);
    const runnerNotesNotInBest = runnerUp.notes.filter(n => !best.notes.includes(n));
    if (runnerNotesNotInBest.length){
      items.push(`The runner-up introduces issues Candidate 1 avoids: ${runnerNotesNotInBest.slice(0,3).join('; ')}.`);
    } else if (best.notes.length === 0) {
      items.push(`Candidate 1 has no soft-constraint penalties at all — no student group faces back-to-back hard exams or an unbalanced daily load.`);
    }
    whyList.innerHTML = items.map(i => `<li>${i}</li>`).join('');
  } else {
    whyPanel.style.display = 'none';
  }
}

/* ================= RENDER: CONFLICT CHECK ================= */
function renderCheckView(){
  document.getElementById('checkEmpty').style.display = 'none';
  document.getElementById('checkContent').style.display = 'block';
  const list = document.getElementById('checkList');
  list.innerHTML = '';

  const cand = currentCandidate();
  const assignment = cand.assignment;
  const subjects = state.subjects;
  const roomsById = {}; state.rooms.forEach(r => roomsById[r.id] = r);

  const violations = { group:[], faculty:[], room:[], capacity:[], type:[] };

  for (let i=0;i<subjects.length;i++){
    for (let j=i+1;j<subjects.length;j++){
      const a = subjects[i], b = subjects[j];
      const va = assignment[a.id], vb = assignment[b.id];
      if (!va || !vb) continue;
      if (va.day===vb.day && va.slot===vb.slot){
        if (va.roomId === vb.roomId) violations.room.push(`${a.code} and ${b.code} both booked in the same room, same slot`);
        if (groupsOverlap(a,b)) violations.group.push(`${a.code} and ${b.code} clash for group(s) ${groupsOf(a).filter(g=>groupsOf(b).includes(g)).join(', ')}`);
        if (a.faculty && a.faculty===b.faculty) violations.faculty.push(`${a.code} and ${b.code} both need ${a.faculty} at the same time`);
      }
    }
  }
  subjects.forEach(s => {
    const v = assignment[s.id]; if (!v) return;
    const room = roomsById[v.roomId];
    if (!room) return;
    if (room.capacity < s.size) violations.capacity.push(`${s.code} has ${s.size} students but ${room.name} holds ${room.capacity}`);
    if (!roomCompatible(room, s)) violations.type.push(`${s.code} needs a ${s.roomType} but was placed in ${room.name} (${room.type})`);
  });

  const rows = [
    { title:'No student-group clashes', key:'group', desc:'No cohort is asked to sit two exams in the same slot.' },
    { title:'No faculty clashes', key:'faculty', desc:'No invigilator/faculty member is needed in two places at once.' },
    { title:'No room double-booking', key:'room', desc:'Every room hosts at most one exam per slot.' },
    { title:'Room capacity respected', key:'capacity', desc:"Every exam fits within its assigned room's capacity." },
    { title:'Room type matches requirement', key:'type', desc:'Lab exams are in labs; hall exams are in halls; classroom exams have a suitable room.' },
  ];

  rows.forEach(row => {
    const issues = violations[row.key];
    const pass = issues.length === 0;
    const div = document.createElement('div');
    div.className = 'check-row';
    div.innerHTML = `
      <div class="check-icon ${pass?'pass':'fail'}">${pass ? '✓' : '!'}</div>
      <div>
        <div class="check-title">${row.title} — ${pass?'Pass':'Fail (' + issues.length + ')'}</div>
        <div class="check-detail">${pass ? row.desc : issues.slice(0,5).join('<br>')}</div>
      </div>
    `;
    list.appendChild(div);
  });
}

/* ============================================================
   EDITOR
   ============================================================ */
/* editor.js — drag-and-drop editing: move an exam to another slot; hard constraints are enforced */
let dragId = null;
function findPlacement(id, day, slot){
  const s = state.subjects.find(x => x.id === id), a = currentCandidate().assignment, cur = a[id];
  const rooms = state.rooms.filter(r => r.capacity >= s.size && roomCompatible(r, s))
    .sort((x, y) => (y.id === cur.roomId) - (x.id === cur.roomId) || x.capacity - y.capacity);
  for (const r of rooms){
    const v = { day, slot, roomId: r.id };
    if (!state.subjects.some(o => o.id !== id && a[o.id] && conflictsVal(s, v, o, a[o.id]))) return v;
  }
  return null;
}
function clearDrop(){ document.querySelectorAll('.tt-cell').forEach(c => c.classList.remove('ok', 'over')); }
const gridEl = document.getElementById('ttGrid');
gridEl.addEventListener('dragstart', e => {
  const chip = e.target.closest('.exam-chip'); if (!chip) return;
  dragId = chip.dataset.id; chip.classList.add('dragging'); e.dataTransfer.effectAllowed = 'move'; e.dataTransfer.setData('text/plain', dragId);
  const cur = currentCandidate().assignment[dragId];
  gridEl.querySelectorAll('.tt-cell').forEach(c => {
    const d = +c.dataset.day, s = +c.dataset.slot;
    if (!(d === cur.day && s === cur.slot) && findPlacement(dragId, d, s)) c.classList.add('ok');
  });
});
gridEl.addEventListener('dragend', () => { dragId = null; clearDrop(); gridEl.querySelectorAll('.dragging').forEach(c => c.classList.remove('dragging')); });
gridEl.addEventListener('dragover', e => { const c = e.target.closest('.tt-cell.ok'); if (c) e.preventDefault(); });
gridEl.addEventListener('dragenter', e => { const c = e.target.closest('.tt-cell'); if (c && c.classList.contains('ok')) c.classList.add('over'); });
gridEl.addEventListener('dragleave', e => { const c = e.target.closest('.tt-cell'); if (c && !c.contains(e.relatedTarget)) c.classList.remove('over'); });
gridEl.addEventListener('drop', e => {
  const c = e.target.closest('.tt-cell'); if (!c || !dragId || !c.classList.contains('ok')) return;
  e.preventDefault();
  const v = findPlacement(dragId, +c.dataset.day, +c.dataset.slot), cand = currentCandidate();
  cand.assignment[dragId] = v;
  Object.assign(cand, scoreAssignment(cand.assignment, state.subjects));
  const s = state.subjects.find(x => x.id === dragId), room = state.rooms.find(r => r.id === v.roomId);
  dragId = null; clearDrop();
  renderGrid(); renderCheckView(); renderCompareView();
  document.getElementById('optScoreNum').textContent = cand.score + '/100';
  toast(`Moved ${s.code} → Day ${v.day + 1}, ${state.examPeriod.slots[v.slot].label}, ${room.name} · score ${cand.score}/100`);
});

/* ============================================================
   MAIN
   ============================================================ */
const STORE = 'ettg.v2';
function save(){ try{ localStorage.setItem(STORE, JSON.stringify({examPeriod:state.examPeriod, subjects:state.subjects, rooms:state.rooms})); }catch(e){} }
function load(){
  try{
    const d = JSON.parse(localStorage.getItem(STORE));
    if (d && d.subjects && d.rooms && d.examPeriod){ state.examPeriod = d.examPeriod; state.subjects = d.subjects; state.rooms = d.rooms; uidCounter = 5000; return true; }
  }catch(e){}
  return false;
}
function toast(msg){
  const t = document.getElementById('toast'); t.textContent = msg; t.classList.add('show');
  clearTimeout(toast.h); toast.h = setTimeout(() => t.classList.remove('show'), 2600);
}
function renderStats(){
  const n = state.examPeriod.days * state.examPeriod.slots.length;
  document.getElementById('statExams').textContent = state.subjects.length;
  document.getElementById('statRooms').textContent = state.rooms.length;
  document.getElementById('statSlots').textContent = n;
  document.getElementById('statCap').textContent = state.rooms.reduce((a, r) => a + (+r.capacity || 0), 0);
}
function setTheme(t){
  document.documentElement.dataset.theme = t;
  document.getElementById('themeBtn').textContent = t === 'dark' ? '☀ Light' : '☾ Dark';
  try{ localStorage.setItem('ettg.theme', t); }catch(e){}
}
function exportCSV(){
  const c = state.candidates[state.selectedCandidate];
  if (!c){ toast('Generate a timetable first.'); return; }
  const room = Object.fromEntries(state.rooms.map(r => [r.id, r.name]));
  const rows = [['Day','Slot','Code','Subject','Group(s)','Faculty','Room','Difficulty']];
  state.subjects.map(s => ({s, v:c.assignment[s.id]})).filter(x => x.v)
    .sort((a, b) => a.v.day - b.v.day || a.v.slot - b.v.slot)
    .forEach(({s, v}) => rows.push([v.day + 1, state.examPeriod.slots[v.slot].label, s.code, s.name, s.group, s.faculty, room[v.roomId] || '', s.difficulty]));
  const csv = rows.map(r => r.map(x => '"' + String(x).replace(/"/g, '""') + '"').join(',')).join('\n');
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([csv], {type:'text/csv'})); a.download = 'exam-timetable.csv'; a.click();
  toast('Timetable exported as CSV');
}

/* wiring */
document.getElementById('themeBtn').onclick = () => setTheme(document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark');
document.getElementById('exportBtn').onclick = exportCSV;
document.getElementById('printBtn').onclick = () => { // light theme + landscape page for a clean PDF
  const t = document.documentElement.dataset.theme; setTheme('light'); window.print(); setTheme(t);
};
['input', 'click'].forEach(ev => document.addEventListener(ev, () => setTimeout(() => { renderStats(); save(); }, 0)));

/* init */
setTheme((() => { try{ return localStorage.getItem('ettg.theme'); }catch(e){ return null; } })() || (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'));
if (!load()) sampleData();
renderSetup();
renderStats();

