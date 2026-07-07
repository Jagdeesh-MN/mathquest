"use strict";

/* ═══════════════════════════════════════════════════════════════
   SPARKLE CANVAS BACKGROUND
════════════════════════════════════════════════════════════════ */
(function initSparkles() {
  const canvas = document.getElementById("sparkle-canvas");
  const ctx = canvas.getContext("2d");
  let W, H, stars = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener("resize", resize);

  function makeStar() {
    return {
      x:      Math.random() * W,
      y:      Math.random() * H,
      r:      Math.random() * 1.8 + 0.4,
      alpha:  Math.random(),
      dAlpha: (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
      size:   Math.random() * 3 + 1,
      type:   Math.random() < 0.3 ? "cross" : "dot",
    };
  }

  for (let i = 0; i < 120; i++) stars.push(makeStar());

  function drawCross(x, y, size, alpha) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 0.8;
    ctx.beginPath();
    ctx.moveTo(x - size, y); ctx.lineTo(x + size, y);
    ctx.moveTo(x, y - size); ctx.lineTo(x, y + size);
    ctx.stroke();
    // diagonal arms (smaller)
    ctx.lineWidth = 0.5;
    const d = size * 0.55;
    ctx.beginPath();
    ctx.moveTo(x - d, y - d); ctx.lineTo(x + d, y + d);
    ctx.moveTo(x + d, y - d); ctx.lineTo(x - d, y + d);
    ctx.stroke();
    ctx.restore();
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.alpha += s.dAlpha;
      if (s.alpha > 1) { s.alpha = 1; s.dAlpha *= -1; }
      if (s.alpha < 0) { s.alpha = 0; s.dAlpha *= -1; }
      if (s.type === "cross") {
        drawCross(s.x, s.y, s.size, s.alpha * 0.75);
      } else {
        ctx.save();
        ctx.globalAlpha = s.alpha * 0.6;
        ctx.fillStyle = "#ffffff";
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION HISTORY (back-button with auto-save)
════════════════════════════════════════════════════════════════ */
const navHistory = [];   // stack of { screen, domainId, skillId }

function pushNav(screen, domainId, skillId) {
  navHistory.push({ screen, domainId: domainId || state.currentDomainId, skillId: skillId || state.currentSkillId });
}

function goBack() {
  if (navHistory.length === 0) { renderDashboard(); return; }
  const prev = navHistory.pop();
  // Always save DB before navigating away
  saveDB(db);
  switch (prev.screen) {
    case "dashboard":    renderDashboard(); break;
    case "skills":       if (prev.domainId) openDomain(prev.domainId); else renderDashboard(); break;
    case "lesson":       if (prev.skillId)  openLesson(prev.skillId);  else renderDashboard(); break;
    default:             renderDashboard();
  }
}

/* ═══════════════════════════════════════════════════════════════
   STORAGE
════════════════════════════════════════════════════════════════ */
const DB_KEY = "mathquest_v3";

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    return raw ? JSON.parse(raw) : { profiles: [] };
  } catch { return { profiles: [] }; }
}
function saveDB(db) { localStorage.setItem(DB_KEY, JSON.stringify(db)); }
function getProfile(db, id) { return db.profiles.find(p => p.id === id) || null; }

function createProfile(db, name, grade, avatar) {
  const profile = {
    id: Date.now().toString(),
    name, grade, avatar,
    xp: 0, streak: 0, lastPracticeDate: null,
    achievements: [], skills: {},
  };
  db.profiles.push(profile);
  saveDB(db);
  return profile;
}

function updateSkillProgress(profile, skillId, correct, total) {
  if (!profile.skills[skillId]) profile.skills[skillId] = { level: 0, correct: 0, attempts: 0, lastDate: null };
  const s = profile.skills[skillId];
  s.correct  += correct;
  s.attempts += total;
  s.lastDate  = todayStr();
  const pct = correct / total;
  if (pct >= 0.9 && s.level < 3) s.level = 3;
  else if (pct >= 0.7 && s.level < 2) s.level = 2;
  else if (pct >= 0.5 && s.level < 1) s.level = 1;
  return s;
}

function todayStr() { return new Date().toISOString().slice(0, 10); }

function updateStreak(profile) {
  const today = todayStr();
  if (profile.lastPracticeDate === today) return;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yStr = yesterday.toISOString().slice(0, 10);
  profile.streak = (profile.lastPracticeDate === yStr) ? (profile.streak || 0) + 1 : 1;
  profile.lastPracticeDate = today;
}

/* ── Export / Import save codes ──────────────────────────────── */
function exportSaveCode(db) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(db))));
}

function importSaveCode(code) {
  try {
    const json = decodeURIComponent(escape(atob(code.trim())));
    return JSON.parse(json);
  } catch {
    return null;
  }
}

/* ── Sync URL (encodes save data as URL hash so it works on GitHub Pages) ── */
function buildSyncURL() {
  const code = exportSaveCode(db);
  const base = window.location.href.split('#')[0].split('?')[0];
  return `${base}?sync=${encodeURIComponent(code)}`;
}

function checkURLSync() {
  // On load, check if there's a ?sync= param (iPad opening sync link)
  const params = new URLSearchParams(window.location.search);
  const syncCode = params.get('sync');
  if (syncCode) {
    const imported = importSaveCode(decodeURIComponent(syncCode));
    if (imported && Array.isArray(imported.profiles) && imported.profiles.length > 0) {
      // Merge: update existing profiles, add new ones
      imported.profiles.forEach(imp => {
        const idx = db.profiles.findIndex(p => p.id === imp.id);
        if (idx >= 0) {
          // Keep the one with more XP / more recent activity
          const existing = db.profiles[idx];
          const useImp = (imp.xp || 0) >= (existing.xp || 0);
          if (useImp) db.profiles[idx] = imp;
        } else {
          db.profiles.push(imp);
        }
      });
      saveDB(db);
      // Clean URL without reloading
      const cleanURL = window.location.href.split('?')[0];
      window.history.replaceState({}, '', cleanURL);
      showToast('✅ Progress synced from link!');
    }
  }
}

/* ── QR code generator ───────────────────────────────────────── */
let qrInstance = null;
function renderQRCode(url) {
  const container = document.getElementById('qr-code');
  container.innerHTML = '';
  if (typeof QRCode !== 'undefined') {
    qrInstance = new QRCode(container, {
      text: url,
      width: 180,
      height: 180,
      colorDark: '#1a0d2e',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.M,
    });
  } else {
    container.innerHTML = `<p style="font-size:.8rem;color:var(--text-muted);word-break:break-all;max-width:260px">${url}</p>`;
  }
}

/* ═══════════════════════════════════════════════════════════════
   APP STATE
════════════════════════════════════════════════════════════════ */
let db = loadDB();
let state = {
  profileId: null,
  viewGrade: 5,
  currentDomainId: null,
  currentSkillId: null,
  session: null,
};
function currentProfile() { return getProfile(db, state.profileId); }

/* ═══════════════════════════════════════════════════════════════
   SCREEN MANAGEMENT
════════════════════════════════════════════════════════════════ */
const SCREENS = ["welcome","dashboard","skills","lesson","practice","results","achievements"];
function showScreen(id) {
  SCREENS.forEach(s => {
    const el = document.getElementById(`screen-${s}`);
    if (el) el.classList.toggle("active", s === id);
  });
}

/* ═══════════════════════════════════════════════════════════════
   CONFETTI
════════════════════════════════════════════════════════════════ */
function launchConfetti() {
  const canvas = document.getElementById("confetti-canvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random() * canvas.width, y: -10,
    r: Math.random() * 7 + 3,
    c: `hsl(${Math.random() * 360},90%,60%)`,
    vx: (Math.random() - .5) * 3, vy: Math.random() * 4 + 2,
    spin: Math.random() * .2 - .1, angle: 0,
  }));
  let frame;
  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.angle += p.spin;
      ctx.save();
      ctx.translate(p.x, p.y); ctx.rotate(p.angle);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.r, -p.r / 2, p.r * 2, p.r);
      ctx.restore();
    });
    if (particles.some(p => p.y < canvas.height + 20)) {
      frame = requestAnimationFrame(draw);
    } else { ctx.clearRect(0, 0, canvas.width, canvas.height); }
  }
  cancelAnimationFrame(frame);
  draw();
  setTimeout(() => { cancelAnimationFrame(frame); ctx.clearRect(0, 0, canvas.width, canvas.height); }, 3500);
}

/* ═══════════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.add("hidden"), 2600);
}

/* ═══════════════════════════════════════════════════════════════
   ACHIEVEMENTS
════════════════════════════════════════════════════════════════ */
function grantAchievement(profile, id) {
  if (!profile || profile.achievements.includes(id)) return;
  const ach = ACHIEVEMENTS.find(a => a.id === id);
  if (!ach) return;
  profile.achievements.push(id);
  profile.xp = (profile.xp || 0) + ach.xp;
  showToast(`${ach.icon} Achievement: ${ach.name}!`);
}

function checkAchievements(profile, correct, total) {
  if (correct > 0)          grantAchievement(profile, "first_correct");
  if (correct === total && total >= 5) grantAchievement(profile, "perfect_score");
  if ((profile.xp || 0) >= 100) grantAchievement(profile, "xp_100");
  if ((profile.xp || 0) >= 500) grantAchievement(profile, "xp_500");
  if ((profile.streak || 0) >= 3) grantAchievement(profile, "day_streak_3");
  if ((profile.streak || 0) >= 7) grantAchievement(profile, "day_streak_7");
  const g = state.currentSkillId?.[0];
  if (g === "5") grantAchievement(profile, "g5_started");
  if (g === "6") grantAchievement(profile, "g6_started");
}

/* ═══════════════════════════════════════════════════════════════
   WELCOME
════════════════════════════════════════════════════════════════ */
const AVATARS = ["🦁","🐯","🐻","🐼","🦊","🐶","🐱","🐸","🦋","🦄","🐬","🦅","🐲","🌟","⚡","🎀","🌈","🍄"];

function renderWelcome() {
  const list = document.getElementById("profile-list");
  list.innerHTML = "";
  db.profiles.forEach(p => {
    const card = document.createElement("div");
    card.className = "profile-card";
    card.innerHTML = `<div class="profile-avatar">${p.avatar || "🦁"}</div>
      <div class="profile-pname">${p.name}</div>
      <div class="profile-grade">Grade ${p.grade}</div>`;
    card.addEventListener("click", () => selectProfile(p.id));
    list.appendChild(card);
  });
  showScreen("welcome");
}

function openAddProfileModal() {
  document.getElementById("input-profile-name").value = "";
  document.getElementById("modal-add-profile").classList.remove("hidden");
  const picker = document.getElementById("avatar-picker");
  picker.innerHTML = "";
  picker._selected = AVATARS[0];
  AVATARS.forEach(a => {
    const btn = document.createElement("button");
    btn.className = "avatar-opt" + (a === AVATARS[0] ? " selected" : "");
    btn.textContent = a;
    btn.addEventListener("click", () => {
      picker.querySelectorAll(".avatar-opt").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      picker._selected = a;
    });
    picker.appendChild(btn);
  });
  const chips = document.querySelectorAll(".grade-chip");
  chips.forEach(c => {
    c.classList.toggle("active", c.dataset.grade === "5");
    c.onclick = () => { chips.forEach(x => x.classList.remove("active")); c.classList.add("active"); };
  });
}

function saveNewProfile() {
  const name = document.getElementById("input-profile-name").value.trim();
  if (!name) { showToast("Please enter a name!"); return; }
  const grade = parseInt(document.querySelector(".grade-chip.active")?.dataset.grade || "5");
  const avatar = document.getElementById("avatar-picker")._selected || AVATARS[0];
  const profile = createProfile(db, name, grade, avatar);
  document.getElementById("modal-add-profile").classList.add("hidden");
  selectProfile(profile.id);
}

function selectProfile(id) {
  state.profileId = id;
  const p = currentProfile();
  state.viewGrade = p.grade;
  document.getElementById("modal-add-profile").classList.add("hidden");
  renderDashboard();
}

/* ═══════════════════════════════════════════════════════════════
   SAVE / LOAD
════════════════════════════════════════════════════════════════ */
function openSaveLoadModal() {
  const code = exportSaveCode(db);
  document.getElementById("save-code-output").value = code;
  document.getElementById("load-code-input").value = "";
  // Reset to save tab
  document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === "save"));
  document.getElementById("tab-save").classList.add("active");
  document.getElementById("tab-load").classList.remove("active");
  document.getElementById("tab-sync").classList.remove("active");
  document.getElementById("modal-save-load").classList.remove("hidden");
}

function applyLoad(code) {
  const imported = importSaveCode(code);
  if (!imported || !Array.isArray(imported.profiles)) {
    showToast("❌ Invalid save code. Please check and try again."); return false;
  }
  // Merge: keep local profiles not in imported, add imported ones
  imported.profiles.forEach(imp => {
    const existing = db.profiles.findIndex(p => p.id === imp.id);
    if (existing >= 0) db.profiles[existing] = imp;
    else db.profiles.push(imp);
  });
  saveDB(db);
  showToast("✅ Progress loaded!");
  return true;
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════ */
function renderDashboard() {
  const p = currentProfile();
  document.getElementById("hdr-player-name").textContent = p.name;
  document.getElementById("hdr-grade-badge").textContent = `Grade ${p.grade}`;
  document.getElementById("hdr-xp").textContent = `⭐ ${p.xp || 0} XP`;
  document.getElementById("dash-streak").textContent = p.streak || 0;

  let total = 0, done = 0;
  Object.values(CURRICULUM).forEach(domains =>
    domains.forEach(d => d.skills.forEach(s => {
      total++;
      if ((p.skills[s.id]?.level || 0) >= 2) done++;
    }))
  );
  const pct = total ? Math.round(done / total * 100) : 0;
  document.getElementById("dash-overall-bar").style.width = pct + "%";
  document.getElementById("dash-overall-pct").textContent = pct + "%";

  document.querySelectorAll(".grade-tab").forEach(tab => {
    tab.classList.toggle("active", parseInt(tab.dataset.grade) === state.viewGrade);
    tab.onclick = () => {
      state.viewGrade = parseInt(tab.dataset.grade);
      renderDomainList();
      document.querySelectorAll(".grade-tab").forEach(t =>
        t.classList.toggle("active", parseInt(t.dataset.grade) === state.viewGrade));
    };
  });

  renderDomainList();
  showScreen("dashboard");
}

function renderDomainList() {
  const p = currentProfile();
  const domains = CURRICULUM[state.viewGrade] || [];
  const list = document.getElementById("domain-list");
  list.innerHTML = "";
  domains.forEach(domain => {
    const skills = domain.skills;
    const mastered = skills.filter(s => (p.skills[s.id]?.level || 0) >= 2).length;
    const pct = skills.length ? Math.round(mastered / skills.length * 100) : 0;
    const card = document.createElement("div");
    card.className = "domain-card";
    card.innerHTML = `
      <div class="domain-card-header">
        <div class="domain-icon">${domain.icon}</div>
        <div class="domain-info">
          <div class="domain-name">${domain.name}</div>
          <div class="domain-meta">${mastered}/${skills.length} skills · ${domain.standard}</div>
        </div>
        <div class="domain-arrow">›</div>
      </div>
      <div class="domain-progress-bar"><div class="domain-progress-fill" style="width:${pct}%"></div></div>`;
    card.addEventListener("click", () => openDomain(domain.id));
    list.appendChild(card);
  });
}

/* ═══════════════════════════════════════════════════════════════
   SKILLS
════════════════════════════════════════════════════════════════ */
function openDomain(domainId) {
  pushNav("dashboard");
  state.currentDomainId = domainId;
  const domain = Object.values(CURRICULUM).flat().find(d => d.id === domainId);
  if (!domain) return;
  document.getElementById("skill-domain-title").textContent = domain.name;
  const p = currentProfile();
  const list = document.getElementById("skill-list");
  list.innerHTML = "";
  domain.skills.forEach((skill, i) => {
    const level = p.skills[skill.id]?.level || 0;
    const badgeClass = level >= 2 ? "badge-mastered" : level >= 1 ? "badge-progress" : "badge-new";
    const badgeText  = level >= 2 ? "✓ Mastered" : level >= 1 ? "In Progress" : "New";
    const item = document.createElement("div");
    item.className = "skill-item" + (level >= 2 ? " mastered" : "");
    item.innerHTML = `
      <div class="skill-num">${i + 1}</div>
      <div class="skill-info">
        <div class="skill-name">${skill.name}</div>
        <div class="skill-code">${skill.id}</div>
      </div>
      <span class="skill-badge ${badgeClass}">${badgeText}</span>`;
    item.addEventListener("click", () => openLesson(skill.id));
    list.appendChild(item);
  });
  showScreen("skills");
}

/* ═══════════════════════════════════════════════════════════════
   LESSON
════════════════════════════════════════════════════════════════ */
function openLesson(skillId) {
  pushNav("skills", state.currentDomainId);
  state.currentSkillId = skillId;
  const skill  = Object.values(CURRICULUM).flat().flatMap(d => d.skills).find(s => s.id === skillId);
  const lesson = LESSONS[skillId];
  document.getElementById("lesson-title").textContent = skill?.name || skillId;
  const body = document.getElementById("lesson-body");
  body.innerHTML = lesson ? lesson.body
    : `<h3>${skill?.name || skillId}</h3>
       <p>Practice this skill to improve your understanding. Questions are matched exactly to the Grade ${skillId[0]} curriculum standard.</p>
       <div class="tip">💡 Read each question carefully and show your work!</div>`;
  showScreen("lesson");
}

/* ═══════════════════════════════════════════════════════════════
   PRACTICE SESSION
════════════════════════════════════════════════════════════════ */
const SESSION_SIZE = 10;
const LIVES = 3;

function startPractice() {
  pushNav("lesson", state.currentDomainId, state.currentSkillId);
  const skillId = state.currentSkillId;
  const questions = generateSessionQuestions(skillId, SESSION_SIZE);
  state.session = { questions, qIndex: 0, correct: 0, lives: LIVES, answers: [], streak: 0 };

  const skill = Object.values(CURRICULUM).flat().flatMap(d => d.skills).find(s => s.id === skillId);
  document.getElementById("prac-skill-name").textContent = skill?.name || skillId;

  // Show avatar
  const p = currentProfile();
  document.getElementById("prac-avatar-icon").textContent = p.avatar || "🦁";
  document.getElementById("prac-avatar-name").textContent = p.name;

  renderDots(); renderLives(); renderQuestion();
  showScreen("practice");
}

function renderDots() {
  const { questions, qIndex, answers } = state.session;
  const container = document.getElementById("prac-dots");
  container.innerHTML = "";
  questions.forEach((_, i) => {
    const dot = document.createElement("div");
    dot.className = "dot";
    if (i < answers.length) dot.classList.add(answers[i] ? "correct" : "wrong");
    else if (i === qIndex) dot.classList.add("current");
    container.appendChild(dot);
  });
}

function renderLives() {
  const container = document.getElementById("prac-lives");
  container.innerHTML = "";
  for (let i = 0; i < LIVES; i++) {
    const span = document.createElement("span");
    span.textContent = i < state.session.lives ? "❤️" : "🖤";
    container.appendChild(span);
  }
}

/* ── Render question ─────────────────────────────────────────── */
function renderQuestion() {
  const sess = state.session;
  if (sess.qIndex >= sess.questions.length) { endSession(); return; }
  const q = sess.questions[sess.qIndex];

  document.getElementById("q-type-badge").textContent = q.typeBadge || "Question";
  document.getElementById("q-text").innerHTML = q.question || "";
  document.getElementById("q-visual").innerHTML = "";
  document.getElementById("q-options").innerHTML = "";
  document.getElementById("q-input-area").innerHTML = "";
  document.getElementById("q-drag-area").innerHTML = "";
  document.getElementById("feedback-bar").classList.add("hidden");
  document.getElementById("feedback-bar").classList.remove("correct-fb","wrong-fb");

  switch (q.type) {
    case "mc":    renderMCOptions(q); break;
    case "drag":  renderDragDrop(q); break;
    default:      renderInputQuestion(q); break;
  }

  renderDots();
  const card = document.getElementById("question-card");
  card.classList.remove("bounce-in");
  void card.offsetWidth;
  card.classList.add("bounce-in");
}

function renderMCOptions(q) {
  const container = document.getElementById("q-options");
  const opts = q.options || [];
  container.classList.toggle("single-col", opts.some(o => String(o).length > 22));
  opts.forEach(opt => {
    const btn = document.createElement("button");
    btn.className = "option-btn";
    btn.innerHTML = String(opt);
    btn.addEventListener("click", () => {
      if (!document.getElementById("feedback-bar").classList.contains("hidden")) return;
      container.querySelectorAll(".option-btn").forEach(b => b.disabled = true);
      const isCorrect = String(opt) === String(q.answer);
      btn.classList.add(isCorrect ? "correct" : "wrong");
      if (!isCorrect) container.querySelectorAll(".option-btn").forEach(b => {
        if (String(b.innerHTML) === String(q.answer)) b.classList.add("reveal");
      });
      submitAnswer(isCorrect, q);
    });
    container.appendChild(btn);
  });
}

function renderInputQuestion(q) {
  const area = document.getElementById("q-input-area");

  if (q.hint) {
    const hint = document.createElement("div");
    hint.className = "lesson-example";
    hint.innerHTML = `<small>💡 Hint: ${q.hint}</small>`;
    area.appendChild(hint);
  }

  const wrap = document.createElement("div");
  wrap.className = "text-input-wrap";
  const input = document.createElement("input");
  input.type = "text";
  input.placeholder = "Type your answer…";
  input.autocomplete = "off";
  input.autocorrect = "off";
  input.spellcheck = false;
  input.setAttribute("inputmode", "decimal");

  const btn = document.createElement("button");
  btn.className = "btn btn-primary submit-btn";
  btn.textContent = "Check";

  function submit() {
    if (btn.disabled) return;
    const raw = input.value.trim();
    if (!raw) { showToast("Type an answer first!"); return; }
    const norm = s => s.replace(/\s+/g," ").trim().toLowerCase().replace(/\$/g,"").replace(/,/g,"");
    const isCorrect = norm(raw) === norm(String(q.answer));
    input.classList.add(isCorrect ? "correct" : "wrong");
    btn.disabled = true;
    submitAnswer(isCorrect, q);
  }
  btn.addEventListener("click", submit);
  input.addEventListener("keydown", e => { if (e.key === "Enter") submit(); });
  wrap.appendChild(input);
  wrap.appendChild(btn);
  area.appendChild(wrap);
  setTimeout(() => { try { input.focus(); } catch {} }, 300);
}

function renderDragDrop(q) {
  if (!q.ddItems) { renderMCOptions(q); return; }
  const area = document.getElementById("q-drag-area");
  area.innerHTML = `<div class="dd-question">${q.ddQuestion || q.question}</div>`;
  const zonesDiv = document.createElement("div"); zonesDiv.className = "dd-zones";
  const chipsDiv = document.createElement("div"); chipsDiv.className = "dd-chips";
  const answers = {};

  q.ddZones.forEach(z => {
    const zone = document.createElement("div");
    zone.className = "dd-zone"; zone.dataset.id = z.id;
    zone.textContent = z.label;
    zone.addEventListener("dragover", e => { e.preventDefault(); zone.classList.add("over"); });
    zone.addEventListener("dragleave", () => zone.classList.remove("over"));
    zone.addEventListener("drop", e => {
      e.preventDefault(); zone.classList.remove("over");
      const chipId = e.dataTransfer.getData("chipId");
      const chip = document.querySelector(`[data-chip="${chipId}"]`);
      if (chip) { answers[z.id] = chipId; zone.textContent = chip.textContent; zone.classList.add("filled"); chip.classList.add("used"); }
    });
    zonesDiv.appendChild(zone);
  });

  q.ddItems.forEach(item => {
    const chip = document.createElement("div");
    chip.className = "dd-chip"; chip.draggable = true;
    chip.dataset.chip = item.id; chip.textContent = item.label;
    chip.addEventListener("dragstart", e => { e.dataTransfer.setData("chipId", item.id); chip.classList.add("dragging"); });
    chip.addEventListener("dragend", () => chip.classList.remove("dragging"));
    let clone;
    chip.addEventListener("touchstart", e => {
      const t = e.touches[0];
      clone = chip.cloneNode(true);
      clone.style.cssText = "position:fixed;opacity:.8;pointer-events:none;z-index:9999;";
      document.body.appendChild(clone);
    }, { passive: true });
    chip.addEventListener("touchmove", e => {
      e.preventDefault();
      const t = e.touches[0];
      if (clone) { clone.style.left = t.clientX - 30 + "px"; clone.style.top = t.clientY - 20 + "px"; }
    }, { passive: false });
    chip.addEventListener("touchend", e => {
      if (clone) { document.body.removeChild(clone); clone = null; }
      const t = e.changedTouches[0];
      const el = document.elementFromPoint(t.clientX, t.clientY);
      const zone = el?.closest(".dd-zone");
      if (zone) { answers[zone.dataset.id] = item.id; zone.textContent = chip.textContent; zone.classList.add("filled"); chip.classList.add("used"); }
    });
    chipsDiv.appendChild(chip);
  });

  area.appendChild(zonesDiv);
  area.appendChild(chipsDiv);
  const checkBtn = document.createElement("button");
  checkBtn.className = "btn btn-primary";
  checkBtn.textContent = "Check";
  checkBtn.addEventListener("click", () => {
    const isCorrect = q.ddZones.every(z => answers[z.id] === z.answer);
    submitAnswer(isCorrect, q);
  });
  area.appendChild(checkBtn);
}

function submitAnswer(isCorrect, q) {
  const sess = state.session;
  sess.answers.push(isCorrect);
  if (isCorrect) {
    sess.correct++;
    sess.streak = (sess.streak || 0) + 1;
    if (sess.streak >= 3)  grantAchievement(currentProfile(), "streak_3");
    if (sess.streak >= 10) grantAchievement(currentProfile(), "streak_10");
  } else {
    sess.lives--;
    sess.streak = 0;
    renderLives();
  }
  renderDots();
  showFeedback(isCorrect, q);
}

const CORRECT_MSGS = ["Great job! 🌟","Correct! Keep going!","Excellent! 🎉","You got it! ⭐","Perfect! 🏆","Brilliant! ✨"];
const WRONG_MSGS   = ["Not quite!","Keep trying!","Almost!","The correct answer was:"];

function showFeedback(isCorrect, q) {
  const bar  = document.getElementById("feedback-bar");
  const icon = document.getElementById("feedback-icon");
  const msg  = document.getElementById("feedback-msg");
  const btn  = document.getElementById("btn-next-question");
  bar.classList.remove("hidden","correct-fb","wrong-fb");
  bar.classList.add(isCorrect ? "correct-fb" : "wrong-fb");
  icon.textContent = isCorrect ? "✅" : "❌";
  if (isCorrect) {
    msg.textContent = CORRECT_MSGS[Math.floor(Math.random() * CORRECT_MSGS.length)];
  } else {
    const prefix = WRONG_MSGS[Math.floor(Math.random() * WRONG_MSGS.length)];
    msg.innerHTML = `${prefix} <strong>${q.answer}</strong>`;
  }
  btn.onclick = () => {
    const sess = state.session;
    if (sess.lives <= 0) { endSession(); return; }
    sess.qIndex++;
    if (sess.qIndex >= sess.questions.length) endSession();
    else renderQuestion();
  };
}

/* ═══════════════════════════════════════════════════════════════
   END SESSION
════════════════════════════════════════════════════════════════ */
function endSession() {
  const sess  = state.session;
  const total   = sess.answers.length;
  const correct = sess.correct;
  const pct     = total > 0 ? Math.round(correct / total * 100) : 0;
  let xpEarned  = correct * 5 + (pct >= 90 ? 20 : 0);

  const p = currentProfile();
  p.xp = (p.xp || 0) + xpEarned;
  updateStreak(p);
  const skillData = updateSkillProgress(p, state.currentSkillId, correct, total);
  grantAchievement(p, "skill_done");
  checkAchievements(p, correct, total);

  const domain = Object.values(CURRICULUM).flat().find(d => d.skills.some(s => s.id === state.currentSkillId));
  if (domain && domain.skills.every(s => (p.skills[s.id]?.level || 0) >= 2)) grantAchievement(p, "domain_done");

  saveDB(db);

  document.getElementById("results-emoji").textContent   = pct >= 90 ? "🏆" : pct >= 70 ? "🌟" : pct >= 50 ? "😊" : "💪";
  document.getElementById("results-heading").textContent = pct >= 90 ? "Outstanding!" : pct >= 70 ? "Well done!" : pct >= 50 ? "Good effort!" : "Keep practicing!";
  document.getElementById("res-correct").textContent     = `${correct}/${total}`;
  document.getElementById("res-pct").textContent         = pct + "%";
  document.getElementById("res-xp").textContent          = `+${xpEarned}`;
  document.getElementById("res-stars").textContent       = "⭐".repeat(skillData.level) + "☆".repeat(3 - skillData.level);

  if (pct >= 90) launchConfetti();
  showScreen("results");
}

function goToNextSkill() {
  const domain = Object.values(CURRICULUM).flat().find(d => d.skills.some(s => s.id === state.currentSkillId));
  if (!domain) { renderDashboard(); return; }
  const idx = domain.skills.findIndex(s => s.id === state.currentSkillId);
  if (idx < domain.skills.length - 1) { openLesson(domain.skills[idx + 1].id); return; }
  const p = currentProfile();
  const domains = CURRICULUM[state.viewGrade] || [];
  for (const d of domains) {
    const unmastered = d.skills.find(s => (p.skills[s.id]?.level || 0) < 2);
    if (unmastered) { openLesson(unmastered.id); return; }
  }
  renderDashboard();
}

/* ═══════════════════════════════════════════════════════════════
   ACHIEVEMENTS
════════════════════════════════════════════════════════════════ */
function renderAchievements() {
  const p = currentProfile();
  const list = document.getElementById("achievements-list");
  list.innerHTML = "";
  ACHIEVEMENTS.forEach(ach => {
    const unlocked = p.achievements.includes(ach.id);
    const item = document.createElement("div");
    item.className = "achievement-item" + (unlocked ? "" : " locked");
    item.innerHTML = `<div class="ach-icon">${unlocked ? ach.icon : "🔒"}</div>
      <div class="ach-info"><div class="ach-name">${ach.name}</div><div class="ach-desc">${ach.desc} · +${ach.xp} XP</div></div>`;
    list.appendChild(item);
  });
  showScreen("achievements");
}

/* ═══════════════════════════════════════════════════════════════
   EVENT LISTENERS
════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {
  // Welcome
  document.getElementById("btn-add-profile").addEventListener("click", openAddProfileModal);
  document.getElementById("btn-cancel-profile").addEventListener("click", () => document.getElementById("modal-add-profile").classList.add("hidden"));
  document.getElementById("btn-save-profile").addEventListener("click", saveNewProfile);
  document.getElementById("input-profile-name").addEventListener("keydown", e => { if (e.key==="Enter") saveNewProfile(); });

  // Load from welcome
  document.getElementById("btn-open-load").addEventListener("click", () => document.getElementById("modal-load").classList.remove("hidden"));
  document.getElementById("btn-cancel-load").addEventListener("click", () => document.getElementById("modal-load").classList.add("hidden"));
  document.getElementById("btn-confirm-load").addEventListener("click", () => {
    const code = document.getElementById("input-load-code").value.trim();
    if (applyLoad(code)) { document.getElementById("modal-load").classList.add("hidden"); renderWelcome(); }
  });

  // Modal backdrop close
  ["modal-add-profile","modal-load","modal-save-load"].forEach(id => {
    document.getElementById(id).addEventListener("click", function(e) { if (e.target===this) this.classList.add("hidden"); });
  });

  // Dashboard
  document.getElementById("btn-switch-profile").addEventListener("click", renderWelcome);
  document.getElementById("btn-open-save").addEventListener("click", openSaveLoadModal);
  document.getElementById("btn-open-achievements").addEventListener("click", renderAchievements);

  // Save/Load modal tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
      document.getElementById("tab-save").classList.toggle("active", tab === "save");
      document.getElementById("tab-load").classList.toggle("active", tab === "load");
      document.getElementById("tab-sync").classList.toggle("active", tab === "sync");
      if (tab === "sync") {
        const url = buildSyncURL();
        renderQRCode(url);
        document.getElementById("btn-copy-sync-url").dataset.url = url;
      }
    });
  });

  document.getElementById("btn-copy-code").addEventListener("click", () => {
    const ta = document.getElementById("save-code-output");
    ta.select();
    try { navigator.clipboard.writeText(ta.value); } catch { document.execCommand("copy"); }
    showToast("✅ Save code copied!");
  });

  document.getElementById("btn-download-save").addEventListener("click", () => {
    const p = currentProfile();
    const blob = new Blob([document.getElementById("save-code-output").value], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `mathquest-${p.name.replace(/\s+/g,"-")}.txt`;
    a.click();
    showToast("⬇ Save file downloaded!");
  });

  document.getElementById("btn-apply-load").addEventListener("click", () => {
    const code = document.getElementById("load-code-input").value.trim();
    if (applyLoad(code)) {
      document.getElementById("modal-save-load").classList.add("hidden");
      renderDashboard();
    }
  });

  document.getElementById("btn-copy-sync-url").addEventListener("click", function() {
    const url = this.dataset.url || buildSyncURL();
    try { navigator.clipboard.writeText(url); } catch { }
    showToast("🔗 Sync link copied!");
  });

  document.getElementById("btn-close-save-load").addEventListener("click", () => document.getElementById("modal-save-load").classList.add("hidden"));

  // Skills
  document.getElementById("btn-back-skills").addEventListener("click", () => { saveDB(db); goBack(); });

  // Lesson
  document.getElementById("btn-back-lesson").addEventListener("click", () => { saveDB(db); goBack(); });
  document.getElementById("btn-start-practice").addEventListener("click", startPractice);

  // Practice — back arrow: silently save partial progress and go back
  document.getElementById("btn-exit-practice").addEventListener("click", () => {
    const sess = state.session;
    if (sess && sess.answers.length > 0) {
      const p = currentProfile();
      updateSkillProgress(p, state.currentSkillId, sess.correct, sess.answers.length);
      updateStreak(p);
      saveDB(db);
      showToast("✅ Progress saved!");
    }
    goBack();
  });

  // Results
  document.getElementById("btn-retry-skill").addEventListener("click", () => { saveDB(db); startPractice(); });
  document.getElementById("btn-next-skill").addEventListener("click", () => { saveDB(db); goToNextSkill(); });
  document.getElementById("btn-results-home").addEventListener("click", () => { saveDB(db); renderDashboard(); });

  // Achievements
  document.getElementById("btn-back-achievements").addEventListener("click", () => { saveDB(db); goBack(); });

  // Auto-save when user switches apps / closes tab (critical for iPad)
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") saveDB(db);
  });
  window.addEventListener("pagehide", () => saveDB(db));
  window.addEventListener("beforeunload", () => saveDB(db));

  // Check for ?sync= URL param (opening sync link on another device)
  checkURLSync();

  renderWelcome();
});
