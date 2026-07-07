"use strict";

/* ═══════════════════════════════════════════════════════════════
   SPARKLE CANVAS BACKGROUND
════════════════════════════════════════════════════════════════ */
(function initSparkles() {
  const canvas = document.getElementById("sparkle-canvas");
  const ctx = canvas.getContext("2d");
  let W, H;
  function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
  resize();
  window.addEventListener("resize", resize);
  const stars = Array.from({ length: 120 }, () => ({
    x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight,
    r: Math.random() * 1.8 + 0.4, alpha: Math.random(),
    dAlpha: (Math.random() * 0.008 + 0.003) * (Math.random() < 0.5 ? 1 : -1),
    size: Math.random() * 3 + 1, type: Math.random() < 0.3 ? "cross" : "dot",
  }));
  function drawCross(x, y, sz, a) {
    ctx.save(); ctx.globalAlpha = a; ctx.strokeStyle = "#fff"; ctx.lineWidth = 0.8;
    ctx.beginPath(); ctx.moveTo(x-sz,y); ctx.lineTo(x+sz,y); ctx.moveTo(x,y-sz); ctx.lineTo(x,y+sz); ctx.stroke();
    ctx.lineWidth = 0.5; const d = sz*.55;
    ctx.beginPath(); ctx.moveTo(x-d,y-d); ctx.lineTo(x+d,y+d); ctx.moveTo(x+d,y-d); ctx.lineTo(x-d,y+d); ctx.stroke();
    ctx.restore();
  }
  function tick() {
    ctx.clearRect(0, 0, W, H);
    stars.forEach(s => {
      s.alpha += s.dAlpha;
      if (s.alpha > 1) { s.alpha = 1; s.dAlpha *= -1; }
      if (s.alpha < 0) { s.alpha = 0; s.dAlpha *= -1; }
      s.type === "cross" ? drawCross(s.x, s.y, s.size, s.alpha * 0.75)
        : (ctx.save(), ctx.globalAlpha = s.alpha * 0.6, ctx.fillStyle = "#fff",
           ctx.beginPath(), ctx.arc(s.x, s.y, s.r, 0, Math.PI*2), ctx.fill(), ctx.restore());
    });
    requestAnimationFrame(tick);
  }
  tick();
})();

/* ═══════════════════════════════════════════════════════════════
   FIXED PROFILE DEFINITIONS
   Two hardcoded profiles — Veeya Grade 5 and Veeya Grade 6
   These IDs are stable so progress persists across devices.
════════════════════════════════════════════════════════════════ */
const VEEYA_PROFILES = [
  { id: "veeya-grade5", name: "Veeya", grade: 5, avatar: "🦁" },
  { id: "veeya-grade6", name: "Veeya", grade: 6, avatar: "🦋" },
];

function emptyProfile(def) {
  return { ...def, xp: 0, streak: 0, lastPracticeDate: null, achievements: [], skills: {} };
}

/* ═══════════════════════════════════════════════════════════════
   STORAGE  — localStorage + auto-save hooks
════════════════════════════════════════════════════════════════ */
const DB_KEY = "mathquest_veeya_v1";

function loadDB() {
  try {
    const raw = localStorage.getItem(DB_KEY);
    const db = raw ? JSON.parse(raw) : { profiles: [] };
    // Ensure both Veeya profiles always exist
    VEEYA_PROFILES.forEach(def => {
      if (!db.profiles.find(p => p.id === def.id)) {
        db.profiles.push(emptyProfile(def));
      }
    });
    return db;
  } catch {
    return { profiles: VEEYA_PROFILES.map(emptyProfile) };
  }
}

function saveDB() {
  try { localStorage.setItem(DB_KEY, JSON.stringify(db)); } catch(e) { console.warn("Save failed", e); }
}

function getProfile(id) { return db.profiles.find(p => p.id === id); }

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
  profile.streak = (profile.lastPracticeDate === yesterday.toISOString().slice(0,10))
    ? (profile.streak || 0) + 1 : 1;
  profile.lastPracticeDate = today;
}

/* ── Export / Import (base64 encoded JSON) ─────────────────── */
function exportCode() {
  return btoa(unescape(encodeURIComponent(JSON.stringify(db))));
}

function importCode(raw) {
  try {
    const text = raw.trim();
    // Support pasting a full sync URL or just the code
    const urlMatch = text.match(/[?&]sync=([^&]+)/);
    const code = urlMatch ? decodeURIComponent(urlMatch[1]) : text;
    const imported = JSON.parse(decodeURIComponent(escape(atob(code))));
    if (!imported || !Array.isArray(imported.profiles)) return false;
    // Merge: for each matching profile ID take the one with more XP (more progress)
    imported.profiles.forEach(imp => {
      const idx = db.profiles.findIndex(p => p.id === imp.id);
      if (idx >= 0) {
        const existing = db.profiles[idx];
        // Use imported if it has equal or more XP — always favour the richer save
        if ((imp.xp || 0) >= (existing.xp || 0)) db.profiles[idx] = imp;
      }
    });
    saveDB();
    return true;
  } catch { return false; }
}

function buildSyncURL() {
  const base = window.location.href.split('?')[0].split('#')[0];
  return `${base}?sync=${encodeURIComponent(exportCode())}`;
}

function checkURLSync() {
  const params = new URLSearchParams(window.location.search);
  const syncParam = params.get("sync");
  if (syncParam) {
    if (importCode(`?sync=${syncParam}`)) showToast("✅ Progress synced!");
    window.history.replaceState({}, "", window.location.pathname);
  }
}

/* ═══════════════════════════════════════════════════════════════
   APP STATE
════════════════════════════════════════════════════════════════ */
let db = loadDB();
let state = {
  profileId: null,   // "veeya-grade5" or "veeya-grade6"
  viewGrade: 5,
  currentDomainId: null,
  currentSkillId: null,
  session: null,
};
function currentProfile() { return getProfile(state.profileId); }

/* ═══════════════════════════════════════════════════════════════
   NAVIGATION HISTORY
════════════════════════════════════════════════════════════════ */
const navHistory = [];
function pushNav(screen, domainId, skillId) {
  navHistory.push({ screen, domainId: domainId || state.currentDomainId, skillId: skillId || state.currentSkillId });
}
function goBack() {
  saveDB();
  if (navHistory.length === 0) { renderWelcome(); return; }
  const prev = navHistory.pop();
  switch (prev.screen) {
    case "welcome":   renderWelcome(); break;
    case "dashboard": renderDashboard(); break;
    case "skills":    prev.domainId ? openDomain(prev.domainId) : renderDashboard(); break;
    case "lesson":    prev.skillId  ? openLesson(prev.skillId)  : renderDashboard(); break;
    default:          renderDashboard();
  }
}

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
  canvas.width = window.innerWidth; canvas.height = window.innerHeight;
  const particles = Array.from({ length: 140 }, () => ({
    x: Math.random()*canvas.width, y: -10, r: Math.random()*7+3,
    c: `hsl(${Math.random()*360},90%,60%)`, vx: (Math.random()-.5)*3,
    vy: Math.random()*4+2, spin: Math.random()*.2-.1, angle: 0,
  }));
  let frame;
  function draw() {
    ctx.clearRect(0,0,canvas.width,canvas.height);
    particles.forEach(p => {
      p.x+=p.vx; p.y+=p.vy; p.angle+=p.spin;
      ctx.save(); ctx.translate(p.x,p.y); ctx.rotate(p.angle);
      ctx.fillStyle=p.c; ctx.fillRect(-p.r,-p.r/2,p.r*2,p.r); ctx.restore();
    });
    if (particles.some(p=>p.y<canvas.height+20)) frame=requestAnimationFrame(draw);
    else ctx.clearRect(0,0,canvas.width,canvas.height);
  }
  cancelAnimationFrame(frame); draw();
  setTimeout(()=>{cancelAnimationFrame(frame);ctx.clearRect(0,0,canvas.width,canvas.height);},3500);
}

/* ═══════════════════════════════════════════════════════════════
   TOAST
════════════════════════════════════════════════════════════════ */
let toastTimer;
function showToast(msg) {
  const t = document.getElementById("toast");
  t.textContent = msg; t.classList.remove("hidden");
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
  if (correct > 0) grantAchievement(profile, "first_correct");
  if (correct === total && total >= 5) grantAchievement(profile, "perfect_score");
  if ((profile.xp||0) >= 100) grantAchievement(profile, "xp_100");
  if ((profile.xp||0) >= 500) grantAchievement(profile, "xp_500");
  if ((profile.streak||0) >= 3) grantAchievement(profile, "day_streak_3");
  if ((profile.streak||0) >= 7) grantAchievement(profile, "day_streak_7");
  if (state.profileId === "veeya-grade5") grantAchievement(profile, "g5_started");
  if (state.profileId === "veeya-grade6") grantAchievement(profile, "g6_started");
}

/* ═══════════════════════════════════════════════════════════════
   WELCOME SCREEN — two Veeya cards
════════════════════════════════════════════════════════════════ */
function renderWelcome() {
  // Update each card's stats from live profile data
  VEEYA_PROFILES.forEach(def => {
    const p = getProfile(def.id);
    const statsEl = document.getElementById(`vstats-${def.grade}`);
    if (!p || !statsEl) return;

    const domains = CURRICULUM[def.grade] || [];
    const allSkills = domains.flatMap(d => d.skills);
    const mastered = allSkills.filter(s => (p.skills[s.id]?.level || 0) >= 2).length;
    const pct = allSkills.length ? Math.round(mastered / allSkills.length * 100) : 0;
    const xp = p.xp || 0;
    const streak = p.streak || 0;

    statsEl.innerHTML = `
      <span style="color:var(--green)">✓ ${mastered}/${allSkills.length} skills</span><br>
      <span>⭐ ${xp} XP &nbsp;🔥 ${streak} day streak</span>`;
  });

  showScreen("welcome");
}

function selectProfile(profileId) {
  state.profileId = profileId;
  state.viewGrade = getProfile(profileId).grade;
  navHistory.length = 0; // clear back history on profile select
  saveDB();
  renderDashboard();
}

/* ═══════════════════════════════════════════════════════════════
   DASHBOARD
════════════════════════════════════════════════════════════════ */
function renderDashboard() {
  const p = currentProfile();
  if (!p) { renderWelcome(); return; }

  document.getElementById("hdr-player-name").textContent = `${p.name} · Grade ${p.grade}`;
  document.getElementById("hdr-grade-badge").textContent = `Grade ${p.grade}`;
  document.getElementById("hdr-xp").textContent = `⭐ ${p.xp || 0} XP`;
  document.getElementById("dash-streak").textContent = p.streak || 0;

  const domains = CURRICULUM[p.grade] || [];
  const allSkills = domains.flatMap(d => d.skills);
  const mastered = allSkills.filter(s => (p.skills[s.id]?.level || 0) >= 2).length;
  const pct = allSkills.length ? Math.round(mastered / allSkills.length * 100) : 0;
  document.getElementById("dash-overall-bar").style.width = pct + "%";
  document.getElementById("dash-overall-pct").textContent = pct + "%";

  // Remove grade tabs — each profile is locked to its grade
  const tabs = document.getElementById("grade-tabs");
  if (tabs) tabs.style.display = "none";

  renderDomainList();
  showScreen("dashboard");
}

function renderDomainList() {
  const p = currentProfile();
  const domains = CURRICULUM[p.grade] || [];
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
      <div class="domain-progress-bar">
        <div class="domain-progress-fill" style="width:${pct}%"></div>
      </div>`;
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
  const examples = buildWorkedExamples(skillId, 2);

  body.innerHTML = lesson
    ? lesson.body + examples
    : `<h3>${skill?.name || skillId}</h3>
       <p>Study these worked examples, then practice!</p>
       ${examples}`;

  showScreen("lesson");
}

function buildWorkedExamples(skillId, count) {
  let html = `<div class="worked-examples"><div class="examples-heading">📝 Worked Examples</div>`;
  for (let i = 0; i < count; i++) {
    try {
      const q = generateQuestion(skillId);
      if (!q || !q.question) continue;
      html += `<div class="example-block">
        <div class="example-num">Example ${i + 1}</div>
        <div class="example-q">${q.question}</div>`;
      if (q.hint) html += `<div class="example-hint">💡 ${q.hint}</div>`;
      if (q.type === "mc" && q.options) {
        html += `<div class="example-options">`;
        q.options.forEach(opt => {
          const isAns = String(opt) === String(q.answer);
          html += `<div class="example-option ${isAns?"example-correct":""}">${isAns?"✓ ":""}${opt}</div>`;
        });
        html += `</div>`;
      } else {
        html += `<div class="example-answer"><span class="ans-label">Answer:</span> <strong>${q.answer}</strong></div>`;
      }
      html += `</div>`;
    } catch(e) { /* skip */ }
  }
  return html + `</div>`;
}

/* ═══════════════════════════════════════════════════════════════
   PRACTICE SESSION
════════════════════════════════════════════════════════════════ */
const SESSION_SIZE = 10;
const LIVES = 3;

function startPractice() {
  pushNav("lesson", state.currentDomainId, state.currentSkillId);
  const questions = generateSessionQuestions(state.currentSkillId, SESSION_SIZE);
  state.session = { questions, qIndex: 0, correct: 0, lives: LIVES, answers: [], streak: 0 };

  const skill = Object.values(CURRICULUM).flat().flatMap(d => d.skills).find(s => s.id === state.currentSkillId);
  document.getElementById("prac-skill-name").textContent = skill?.name || state.currentSkillId;

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
    case "drag":  renderMCOptions(q); break;  // fallback drag→mc
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
    const h = document.createElement("div");
    h.className = "lesson-example";
    h.innerHTML = `<small>💡 Hint: ${q.hint}</small>`;
    area.appendChild(h);
  }
  const wrap = document.createElement("div");
  wrap.className = "text-input-wrap";
  const input = document.createElement("input");
  input.type = "text"; input.placeholder = "Type your answer…";
  input.autocomplete = "off"; input.autocorrect = "off"; input.spellcheck = false;
  input.setAttribute("inputmode","decimal");
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
  wrap.appendChild(input); wrap.appendChild(btn);
  area.appendChild(wrap);
  setTimeout(() => { try { input.focus(); } catch{} }, 300);
}

const CORRECT_MSGS = ["Great job! 🌟","Correct! Keep going!","Excellent! 🎉","You got it! ⭐","Perfect! 🏆","Brilliant! ✨"];
const WRONG_MSGS   = ["Not quite!","Almost there!","Good try!","The answer is:"];

function submitAnswer(isCorrect, q) {
  const sess = state.session;
  sess.answers.push(isCorrect);
  if (isCorrect) {
    sess.correct++;
    sess.streak = (sess.streak || 0) + 1;
    const p = currentProfile();
    if (sess.streak >= 3)  grantAchievement(p, "streak_3");
    if (sess.streak >= 10) grantAchievement(p, "streak_10");
  } else {
    sess.lives--;
    sess.streak = 0;
    renderLives();
  }
  // Auto-save after every answer
  saveDB();
  renderDots();
  showFeedback(isCorrect, q);
}

function showFeedback(isCorrect, q) {
  const bar = document.getElementById("feedback-bar");
  bar.classList.remove("hidden","correct-fb","wrong-fb");
  bar.classList.add(isCorrect ? "correct-fb" : "wrong-fb");
  document.getElementById("feedback-icon").textContent = isCorrect ? "✅" : "❌";
  const msgs = isCorrect ? CORRECT_MSGS : WRONG_MSGS;
  const msg = msgs[Math.floor(Math.random() * msgs.length)];
  document.getElementById("feedback-msg").innerHTML = isCorrect
    ? msg : `${msg} <strong>${q.answer}</strong>`;
  document.getElementById("btn-next-question").onclick = () => {
    if (state.session.lives <= 0) { endSession(); return; }
    state.session.qIndex++;
    if (state.session.qIndex >= state.session.questions.length) endSession();
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

  // Auto-save immediately
  saveDB();

  document.getElementById("results-emoji").textContent   = pct>=90?"🏆":pct>=70?"🌟":pct>=50?"😊":"💪";
  document.getElementById("results-heading").textContent = pct>=90?"Outstanding!":pct>=70?"Well done!":pct>=50?"Good effort!":"Keep practicing!";
  document.getElementById("res-correct").textContent     = `${correct}/${total}`;
  document.getElementById("res-pct").textContent         = pct + "%";
  document.getElementById("res-xp").textContent          = `+${xpEarned}`;
  document.getElementById("res-stars").textContent       = "⭐".repeat(skillData.level) + "☆".repeat(3-skillData.level);

  if (pct >= 90) launchConfetti();
  showScreen("results");
}

function goToNextSkill() {
  const domain = Object.values(CURRICULUM).flat().find(d => d.skills.some(s => s.id === state.currentSkillId));
  if (!domain) { renderDashboard(); return; }
  const idx = domain.skills.findIndex(s => s.id === state.currentSkillId);
  if (idx < domain.skills.length - 1) { openLesson(domain.skills[idx+1].id); return; }
  const p = currentProfile();
  const domains = CURRICULUM[p.grade] || [];
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
   SYNC / SHARE
════════════════════════════════════════════════════════════════ */
let qrInstance = null;
function openSyncModal() {
  const url = buildSyncURL();
  document.getElementById("tab-sync-out").classList.add("active");
  document.getElementById("tab-sync-in").classList.remove("active");
  document.querySelectorAll("#modal-save-load .tab-btn").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === "sync-out"));
  document.getElementById("load-code-input").value = "";

  // Render QR
  const container = document.getElementById("qr-code");
  container.innerHTML = "";
  if (typeof QRCode !== "undefined") {
    new QRCode(container, { text: url, width: 180, height: 180,
      colorDark: "#1a0d2e", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
  } else {
    container.textContent = url;
  }
  document.getElementById("btn-copy-sync-url").dataset.url = url;
  document.getElementById("modal-save-load").classList.remove("hidden");
}

/* ═══════════════════════════════════════════════════════════════
   EVENT LISTENERS
════════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", () => {

  // ── Welcome screen ─────────────────────────────────────────
  document.getElementById("btn-veeya5").addEventListener("click", () => selectProfile("veeya-grade5"));
  document.getElementById("btn-veeya6").addEventListener("click", () => selectProfile("veeya-grade6"));

  document.getElementById("btn-welcome-sync").addEventListener("click", () =>
    document.getElementById("modal-welcome-sync").classList.remove("hidden"));
  document.getElementById("btn-cancel-sync").addEventListener("click", () =>
    document.getElementById("modal-welcome-sync").classList.add("hidden"));
  document.getElementById("btn-confirm-sync").addEventListener("click", () => {
    const raw = document.getElementById("input-sync-code").value.trim();
    if (!raw) { showToast("Paste a sync code first!"); return; }
    if (importCode(raw)) {
      document.getElementById("modal-welcome-sync").classList.add("hidden");
      showToast("✅ Progress loaded!");
      renderWelcome();
    } else {
      showToast("❌ Invalid code. Check and try again.");
    }
  });
  document.getElementById("modal-welcome-sync").addEventListener("click", function(e) {
    if (e.target === this) this.classList.add("hidden");
  });

  // ── Dashboard ───────────────────────────────────────────────
  document.getElementById("btn-switch-profile").addEventListener("click", () => { saveDB(); renderWelcome(); });
  document.getElementById("btn-open-save").addEventListener("click", openSyncModal);
  document.getElementById("btn-open-achievements").addEventListener("click", renderAchievements);

  // ── Sync modal tabs ─────────────────────────────────────────
  document.querySelectorAll("#modal-save-load .tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tab = btn.dataset.tab;
      document.querySelectorAll("#modal-save-load .tab-btn").forEach(b => b.classList.toggle("active", b.dataset.tab === tab));
      document.getElementById("tab-sync-out").classList.toggle("active", tab === "sync-out");
      document.getElementById("tab-sync-in").classList.toggle("active", tab === "sync-in");
    });
  });

  document.getElementById("btn-copy-sync-url").addEventListener("click", function() {
    const url = this.dataset.url || buildSyncURL();
    navigator.clipboard?.writeText(url).catch(() => {});
    showToast("🔗 Sync link copied! Open it on any device.");
  });

  document.getElementById("btn-download-save").addEventListener("click", () => {
    const blob = new Blob([exportCode()], { type: "text/plain" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "mathquest-veeya-save.txt"; a.click();
    showToast("⬇ Save file downloaded!");
  });

  document.getElementById("btn-apply-load").addEventListener("click", () => {
    const raw = document.getElementById("load-code-input").value.trim();
    if (!raw) { showToast("Paste a code first!"); return; }
    if (importCode(raw)) {
      document.getElementById("modal-save-load").classList.add("hidden");
      showToast("✅ Progress loaded!");
      renderDashboard();
    } else {
      showToast("❌ Invalid code.");
    }
  });

  document.getElementById("btn-close-save-load").addEventListener("click", () =>
    document.getElementById("modal-save-load").classList.add("hidden"));
  document.getElementById("modal-save-load").addEventListener("click", function(e) {
    if (e.target === this) this.classList.add("hidden");
  });

  // ── Skills ──────────────────────────────────────────────────
  document.getElementById("btn-back-skills").addEventListener("click", () => { saveDB(); goBack(); });

  // ── Lesson ──────────────────────────────────────────────────
  document.getElementById("btn-back-lesson").addEventListener("click", () => { saveDB(); goBack(); });
  document.getElementById("btn-start-practice").addEventListener("click", startPractice);

  // ── Practice ────────────────────────────────────────────────
  document.getElementById("btn-exit-practice").addEventListener("click", () => {
    const sess = state.session;
    if (sess && sess.answers.length > 0) {
      const p = currentProfile();
      updateSkillProgress(p, state.currentSkillId, sess.correct, sess.answers.length);
      updateStreak(p);
      saveDB();
      showToast("✅ Progress saved!");
    }
    goBack();
  });

  // ── Results ─────────────────────────────────────────────────
  document.getElementById("btn-retry-skill").addEventListener("click", () => { saveDB(); startPractice(); });
  document.getElementById("btn-next-skill").addEventListener("click", () => { saveDB(); goToNextSkill(); });
  document.getElementById("btn-results-home").addEventListener("click", () => { saveDB(); renderDashboard(); });

  // ── Achievements ─────────────────────────────────────────────
  document.getElementById("btn-back-achievements").addEventListener("click", () => { saveDB(); goBack(); });

  // ── Auto-save when switching away / closing ──────────────────
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") saveDB(); });
  window.addEventListener("pagehide", saveDB);
  window.addEventListener("beforeunload", saveDB);

  // ── Check for ?sync= URL param ───────────────────────────────
  checkURLSync();

  // ── Boot ─────────────────────────────────────────────────────
  renderWelcome();
});
