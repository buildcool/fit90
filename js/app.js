/* ==========================================================================
   app.js — rendering and interaction. Loaded last; calls initApp() at the end.
   Classic script, so every function here is global and the inline onclick
   handlers in index.html keep working.
   ========================================================================== */

let currentDateStr = new Date().toISOString().split("T")[0];
if (currentDateStr < PROGRAM.startDate) currentDateStr = PROGRAM.startDate;
let selectedWorkoutDay = 1;
let deferredPrompt = null;
let restTimer = null;
let modalExerciseId = null;
let modalShowWrong = false;
let planSection = "overview";

const TABS = ["workout", "schedule", "diet", "apt", "metrics", "plan"];

/* ---------------------------------------------------------------- install */
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("sw.js").catch(() => {});
  });
}
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault();
  deferredPrompt = e;
  const btn = document.getElementById("installAppBtn");
  if (btn) btn.classList.remove("hidden");
});
window.addEventListener("appinstalled", () => {
  const btn = document.getElementById("installAppBtn");
  if (btn) btn.classList.add("hidden");
});
async function triggerInstall() {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  await deferredPrompt.userChoice;
  deferredPrompt = null;
  const btn = document.getElementById("installAppBtn");
  if (btn) btn.classList.add("hidden");
}

/* ------------------------------------------------------------------- init */
function initApp() {
  const picker = document.getElementById("datePicker");
  picker.value = currentDateStr;
  picker.min = PROGRAM.startDate;
  picker.addEventListener("change", e => {
    currentDateStr = e.target.value || PROGRAM.startDate;
    selectedWorkoutDay = getWorkoutDayForDate(currentDateStr);
    renderAll();
  });
  selectedWorkoutDay = getWorkoutDayForDate(currentDateStr);
  renderAll();
}

function renderAll() {
  updateTopDashboard();
  renderDaySelector();
  renderWorkoutList();
  renderScheduleList();
  renderDietList();
  renderAptView();
  renderMetricsView();
  renderPlanView();
}

function esc(s) {
  return String(s == null ? "" : s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

/* --------------------------------------------------------------- dashboard */
function dayTotals() {
  const state = loadDayState(currentDateStr);
  const dayNum = getProgramDayNumber(currentDateStr);
  const targets = getTargetsForDay(dayNum);
  const schedule = getScheduleForDate(currentDateStr);
  const exercises = getDayExercises(selectedWorkoutDay);

  let protein = 0, kcal = 0, carbs = 0, fat = 0, cost = 0, mealsDone = 0;
  DIET_DATA.forEach(m => {
    const opt = m.options[state.mealOptionSelected[m.id] || 0];
    if (state.mealsDone[m.id]) {
      protein += opt.protein; kcal += opt.kcal; carbs += opt.carbs; fat += opt.fat;
      mealsDone++;
    }
    cost += opt.cost;
  });

  let totalSets = 0, doneSets = 0;
  exercises.forEach(ex => {
    const p = getPrescription(dayNum, ex);
    totalSets += p.sets;
    doneSets += Math.min(p.sets, setsCompleted(state, ex.id));
  });

  const schedDone = schedule.filter(s => state.scheduleDone[s.id]).length;
  const habitsDone = APT_HABITS.filter(h => state.aptHabits[h.id]).length;

  const totalTasks = schedule.length + DIET_DATA.length + totalSets + APT_HABITS.length;
  const doneTasks = schedDone + mealsDone + doneSets + habitsDone;

  return {
    state, dayNum, targets, schedule, exercises,
    protein, kcal, carbs, fat, cost, mealsDone,
    totalSets, doneSets, schedDone, habitsDone,
    pct: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0
  };
}

function updateTopDashboard() {
  const t = dayTotals();
  const phase = t.targets.phase;
  const week = getWeekForDay(t.dayNum);

  document.getElementById("dayLabel").textContent = `Day ${t.dayNum} of ${PROGRAM.totalDays}`;
  document.getElementById("phaseLabel").textContent = `Week ${week} • ${phase.name}`;
  document.getElementById("statCompletion").textContent = t.pct + "%";
  document.getElementById("statProtein").textContent = `${Math.round(t.protein)} / ${t.targets.protein}g`;
  document.getElementById("statKcal").textContent = `${Math.round(t.kcal)} / ${t.targets.kcal}`;
  document.getElementById("statWater").textContent = `${t.state.water.toFixed(1)} / ${t.targets.waterL}L`;

  const bar = document.getElementById("dayProgressBar");
  if (bar) bar.style.width = Math.min(100, t.pct) + "%";

  const pBar = document.getElementById("proteinBar");
  if (pBar) pBar.style.width = Math.min(100, (t.protein / t.targets.protein) * 100) + "%";
}

/* ------------------------------------------------------------ workout view */
function renderDaySelector() {
  const container = document.getElementById("daySelector");
  container.innerHTML = WORKOUT_DAYS.map(w => {
    const active = w.day === selectedWorkoutDay;
    const short = w.name.replace(/^Day \d+: /, "");
    return `<button onclick="selectWorkoutDay(${w.day})"
      class="shrink-0 px-3 py-2 rounded-lg text-xs font-bold border transition ${
        active ? "bg-emerald-500 text-slate-950 border-emerald-400" : "bg-slate-800 text-slate-300 border-slate-700"
      }">
      <span class="block text-[9px] opacity-70">${w.dow.slice(0, 3)}</span>${esc(short)}
    </button>`;
  }).join("");
}

function selectWorkoutDay(dayNum) {
  selectedWorkoutDay = dayNum;
  updateTopDashboard();
  renderWorkoutList();
}

function renderWorkoutList() {
  const t = dayTotals();
  const day = WORKOUT_DAYS.find(w => w.day === selectedWorkoutDay);
  const container = document.getElementById("exerciseList");

  document.getElementById("workoutDayTitle").textContent = day.name;
  document.getElementById("workoutDayFocus").textContent = day.focus;
  document.getElementById("workoutSummary").textContent = day.summary;
  document.getElementById("workoutProgressLabel").textContent = `${t.doneSets}/${t.totalSets} sets`;

  const phase = t.targets.phase;
  document.getElementById("workoutPhaseNote").innerHTML =
    `<strong class="text-emerald-400">${esc(phase.name)}</strong> — ${esc(phase.prescription.sets)} sets × ${esc(phase.prescription.reps)} @ RPE ${esc(phase.prescription.rpe)}, ${phase.prescription.restSec}s rest. ${esc(phase.loadRule)}`;

  container.innerHTML = day.blocks.map(block => {
    const st = BLOCK_STYLE[block.type];
    const rows = block.exercises.map(ex => exerciseCard(ex, t)).join("");
    return `
      <section class="space-y-2.5">
        <div class="flex items-center gap-2 pt-1">
          <span class="text-sm">${st.icon}</span>
          <h3 class="text-xs font-extrabold uppercase tracking-wider text-${st.color}-400">${esc(block.name)}</h3>
          <span class="text-[10px] text-slate-500">${esc(block.dur)}</span>
          <div class="flex-1 h-px bg-slate-800"></div>
        </div>
        ${block.note ? `<p class="text-[11px] text-slate-400 leading-relaxed">${esc(block.note)}</p>` : ""}
        ${rows}
      </section>`;
  }).join("");
}

function exerciseCard(ex, t) {
  const p = getPrescription(t.dayNum, ex);
  const done = setsCompleted(t.state, ex.id);
  const allDone = done >= p.sets;
  const last = ex.log ? getLastSession(ex.id, currentDateStr) : null;
  const sets = ensureSets(t.state, ex.id, p.sets);

  const setRows = sets.map((s, i) => {
    const n = i + 1;
    if (ex.log) {
      return `
        <div class="flex items-center gap-1.5">
          <span class="w-8 text-[10px] text-slate-500 font-bold">S${n}</span>
          <input type="number" inputmode="decimal" step="0.5" value="${esc(s.weight)}" placeholder="kg"
            onchange="setLog('${ex.id}',${i},'weight',this.value)"
            class="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1.5 text-xs text-white text-center" />
          <input type="number" inputmode="numeric" value="${esc(s.reps)}" placeholder="reps"
            onchange="setLog('${ex.id}',${i},'reps',this.value)"
            class="w-16 bg-slate-800 border border-slate-700 rounded px-1.5 py-1.5 text-xs text-white text-center" />
          <button onclick="toggleSetDone('${ex.id}',${i},${p.restSec})"
            class="flex-1 py-1.5 rounded text-xs font-bold border ${
              s.done ? "bg-emerald-500/25 border-emerald-500 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"
            }">${s.done ? "✓ Done" : "Mark"}</button>
        </div>`;
    }
    return `<button onclick="toggleSetDone('${ex.id}',${i},${p.restSec})"
      class="flex-1 py-2 rounded-lg text-xs font-bold border ${
        s.done ? "bg-emerald-500/25 border-emerald-500 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"
      }">${s.done ? "✓ " : ""}${p.sets > 1 ? "Set " + n : "Done"}</button>`;
  }).join("");

  return `
    <div class="bg-slate-900 border ${allDone ? "border-emerald-500/50" : "border-slate-800"} rounded-xl p-3 space-y-2.5">
      <div class="flex items-start gap-2.5">
        <div class="shrink-0 w-14 h-11 bg-slate-950 rounded-lg border border-slate-800 overflow-hidden">${thumbExercise(ex)}</div>
        <div class="min-w-0 flex-1">
          <span class="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-400 border border-blue-500/30">${esc(ex.machine)}</span>
          <h4 class="text-sm font-extrabold text-white mt-1 leading-tight">${esc(ex.name)}</h4>
          <p class="text-[11px] text-slate-400">${p.sets} × ${esc(p.reps)}${p.fixed ? "" : ` • RPE ${esc(p.rpe)}`}${p.restSec ? ` • rest ${p.restSec}s` : ""}</p>
        </div>
        <button onclick="openTutorial('${ex.id}')"
          class="shrink-0 bg-slate-800 active:bg-slate-600 text-emerald-400 border border-emerald-500/40 rounded-lg px-2 py-1.5 text-[11px] font-bold">
          🎬 Form
        </button>
      </div>

      ${last ? `<div class="text-[10px] text-cyan-300 bg-cyan-500/10 border border-cyan-500/20 rounded px-2 py-1">
        ▲ Beat last session (${esc(last.date)}): <strong>${esc(last.weight)} kg × ${esc(last.reps)}</strong></div>` : ""}

      <div class="bg-amber-500/10 border border-amber-500/20 rounded-lg px-2.5 py-1.5 text-[11px] text-amber-200 leading-relaxed">
        <strong class="text-amber-400">APT cue:</strong> ${esc(ex.apt)}
      </div>

      <details class="text-[11px] text-slate-400">
        <summary class="cursor-pointer text-slate-500 font-semibold">Tempo, substitute &amp; common mistake</summary>
        <div class="pt-1.5 space-y-1">
          <p><strong class="text-slate-300">Tempo:</strong> ${esc(p.tempo)}</p>
          <p><strong class="text-slate-300">If the machine is taken:</strong> ${esc(ex.substitute)}</p>
          <p><strong class="text-red-400">Common mistake:</strong> ${esc(ex.mistake)}</p>
        </div>
      </details>

      <div class="${ex.log ? "space-y-1.5" : "flex gap-2"} pt-0.5">${setRows}</div>
    </div>`;
}

function toggleSetDone(exId, idx, restSec) {
  const state = loadDayState(currentDateStr);
  const found = findExercise(exId);
  const p = getPrescription(getProgramDayNumber(currentDateStr), found.exercise);
  const arr = ensureSets(state, exId, p.sets);
  arr[idx].done = !arr[idx].done;
  saveDayState(currentDateStr, state);
  if (arr[idx].done && restSec > 0) startRest(restSec, found.exercise.name);
  updateTopDashboard();
  renderWorkoutList();
}

function setLog(exId, idx, field, value) {
  const state = loadDayState(currentDateStr);
  const found = findExercise(exId);
  const p = getPrescription(getProgramDayNumber(currentDateStr), found.exercise);
  const arr = ensureSets(state, exId, p.sets);
  arr[idx][field] = value;
  saveDayState(currentDateStr, state);
}

/* ------------------------------------------------------------- rest timer */
function startRest(seconds, label) {
  clearInterval(restTimer);
  let left = seconds;
  const bar = document.getElementById("restTimer");
  const txt = document.getElementById("restTimerText");
  const lbl = document.getElementById("restTimerLabel");
  bar.classList.remove("hidden");
  lbl.textContent = label || "Rest";
  const tick = () => {
    txt.textContent = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
    if (left <= 0) {
      clearInterval(restTimer);
      txt.textContent = "GO";
      if (navigator.vibrate) navigator.vibrate([120, 60, 120]);
      setTimeout(() => bar.classList.add("hidden"), 2200);
      return;
    }
    left--;
  };
  tick();
  restTimer = setInterval(tick, 1000);
}

function stopRest() {
  clearInterval(restTimer);
  document.getElementById("restTimer").classList.add("hidden");
}

/* ----------------------------------------------------------- schedule view */
function renderScheduleList() {
  const t = dayTotals();
  const container = document.getElementById("scheduleList");
  const isRest = getWorkoutDayForDate(currentDateStr) === 7;

  document.getElementById("scheduleTitle").textContent = isRest
    ? "Sunday — Active Recovery Day" : "Hour-by-Hour Gym Day";
  document.getElementById("scheduleSub").textContent = isRest
    ? "No gym. Check-in, mobility, prep — you grow on this day."
    : `${t.schedDone}/${t.schedule.length} blocks done • tap each as you complete it`;

  container.innerHTML = t.schedule.map(item => {
    const done = !!t.state.scheduleDone[item.id];
    const tag = SCHEDULE_TAG_STYLE[item.tag] || SCHEDULE_TAG_STYLE.prep;
    return `
      <div class="bg-slate-900 border ${done ? "border-emerald-500/50" : "border-slate-800"} rounded-xl p-3">
        <button onclick="toggleSchedule('${item.id}')" class="w-full text-left flex items-start gap-2.5">
          <span class="shrink-0 w-5 h-5 mt-0.5 rounded border-2 ${
            done ? "bg-emerald-500 border-emerald-400" : "border-slate-600"
          } flex items-center justify-center text-[11px] text-slate-950 font-bold">${done ? "✓" : ""}</span>
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-1.5 flex-wrap">
              <span class="text-[10px] font-bold text-${tag.color}-400 bg-${tag.color}-500/15 border border-${tag.color}-500/30 px-1.5 py-0.5 rounded">${tag.label}</span>
              <span class="text-[10px] text-slate-500 font-semibold">${esc(item.time)} • ${esc(item.dur)}</span>
            </div>
            <h4 class="text-sm font-bold text-white mt-1 ${done ? "line-through opacity-60" : ""}">${item.icon} ${esc(item.title)}</h4>
            <p class="text-[11px] text-slate-400 leading-relaxed mt-0.5">${esc(item.detail)}</p>
          </div>
        </button>
        <details class="mt-2 text-[11px]">
          <summary class="cursor-pointer text-slate-500 font-semibold">Step by step</summary>
          <ul class="pt-1.5 space-y-1 text-slate-300">
            ${item.steps.map(s => `<li class="flex gap-1.5"><span class="text-emerald-500">•</span><span>${esc(s)}</span></li>`).join("")}
          </ul>
        </details>
      </div>`;
  }).join("");
}

function toggleSchedule(id) {
  const state = loadDayState(currentDateStr);
  state.scheduleDone[id] = !state.scheduleDone[id];
  saveDayState(currentDateStr, state);
  updateTopDashboard();
  renderScheduleList();
}

function addWater(amount) {
  const state = loadDayState(currentDateStr);
  state.water = Math.max(0, Math.round((state.water + amount) * 100) / 100);
  saveDayState(currentDateStr, state);
  updateTopDashboard();
  renderScheduleList();
}

/* --------------------------------------------------------------- diet view */
function renderDietList() {
  const t = dayTotals();
  const container = document.getElementById("dietList");

  document.getElementById("dietTargets").innerHTML = `
    <span class="text-emerald-400 font-bold">${Math.round(t.kcal)}</span>/${t.targets.kcal} kcal •
    <span class="text-blue-400 font-bold">${Math.round(t.protein)}</span>/${t.targets.protein}g P •
    ${Math.round(t.carbs)}g C • ${Math.round(t.fat)}g F`;
  document.getElementById("dietCost").textContent = `₹${t.cost}/day • ≈₹${t.cost * 30}/mo of ₹${PROGRAM_BUDGET.monthlyCap}`;

  container.innerHTML = DIET_DATA.map(meal => {
    const selIdx = t.state.mealOptionSelected[meal.id] || 0;
    const opt = meal.options[selIdx];
    const done = !!t.state.mealsDone[meal.id];
    const pills = meal.options.map((o, i) => `
      <button onclick="selectMealOption('${meal.id}',${i})"
        class="shrink-0 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
          i === selIdx ? "bg-blue-500/25 border-blue-400 text-blue-200" : "bg-slate-800 border-slate-700 text-slate-400"
        }">${i + 1}</button>`).join("");

    return `
      <div class="bg-slate-900 border ${done ? "border-emerald-500/50" : "border-slate-800"} rounded-xl p-3 space-y-2">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">${esc(meal.time)} • ${esc(meal.slot)}</span>
            <h4 class="text-sm font-extrabold text-white">${esc(meal.meal)}</h4>
          </div>
          <div class="flex gap-1 overflow-x-auto no-scrollbar">${pills}</div>
        </div>
        <p class="text-[11px] text-slate-400 leading-relaxed">${esc(meal.note)}</p>
        <div class="bg-slate-800/60 border border-slate-700/60 rounded-lg p-2.5">
          <h5 class="text-xs font-bold text-blue-300">${esc(opt.name)}</h5>
          <p class="text-[11px] text-slate-300 mt-0.5 leading-relaxed">${esc(opt.desc)}</p>
          <div class="flex flex-wrap gap-1.5 mt-2 text-[10px]">
            <span class="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 font-bold">${opt.kcal} kcal</span>
            <span class="px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300 font-bold">${opt.protein}g P</span>
            <span class="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">${opt.carbs}g C</span>
            <span class="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">${opt.fat}g F</span>
            <span class="px-1.5 py-0.5 rounded bg-amber-500/15 text-amber-300">₹${opt.cost}</span>
            <span class="px-1.5 py-0.5 rounded bg-slate-700 text-slate-300">${opt.prepMin} min</span>
            ${opt.tags.map(tg => `<span class="px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300">${tg}</span>`).join("")}
          </div>
          <p class="text-[10px] text-slate-500 mt-1.5 italic">${esc(opt.tip)}</p>
        </div>
        <button onclick="toggleMealDone('${meal.id}')"
          class="w-full py-2 rounded-lg text-xs font-bold border ${
            done ? "bg-emerald-500/25 border-emerald-500 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"
          }">${done ? "✓ Eaten" : "Mark as eaten"}</button>
      </div>`;
  }).join("");

  document.getElementById("dietStrategy").innerHTML = `
    <h4 class="text-sm font-bold text-white mb-1.5">${esc(DIET_STRATEGY.headline)}</h4>
    <ul class="space-y-1.5 text-[11px] text-slate-300 leading-relaxed">
      ${DIET_STRATEGY.points.map(p => `<li class="flex gap-1.5"><span class="text-emerald-500 shrink-0">•</span><span>${esc(p)}</span></li>`).join("")}
    </ul>`;

  document.getElementById("hydrationList").innerHTML = HYDRATION_PLAN.schedule.map(h => `
    <div class="flex items-start gap-2 text-[11px]">
      <span class="w-20 shrink-0 text-cyan-400 font-bold">${esc(h.time)}</span>
      <span class="w-16 shrink-0 text-slate-200 font-semibold">${esc(h.amount)}</span>
      <span class="text-slate-400">${esc(h.note)}</span>
    </div>`).join("");

  document.getElementById("groceryList").innerHTML = GROCERY_LIST.map(g => `
    <details class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2">
      <summary class="cursor-pointer text-xs font-bold text-white">${esc(g.cat)}
        <span class="text-amber-400 font-normal">₹${g.items.reduce((s, i) => s + i.cost, 0)}</span></summary>
      <div class="pt-1.5 space-y-1">
        ${g.items.map(i => `<div class="flex justify-between gap-2 text-[11px]">
          <span class="text-slate-300">${esc(i.item)} <span class="text-slate-500">${esc(i.qty)}</span></span>
          <span class="text-amber-300 shrink-0">₹${i.cost}</span></div>`).join("")}
      </div>
    </details>`).join("");

  document.getElementById("supplementList").innerHTML = SUPPLEMENTS.map(s => `
    <div class="bg-slate-800/50 border ${s.nonNegotiable ? "border-emerald-700/50" : "border-slate-700/50"} rounded-lg p-2.5">
      <div class="flex items-center gap-1.5">
        <h5 class="text-xs font-bold text-white">${esc(s.name)}</h5>
        ${s.nonNegotiable ? `<span class="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">ESSENTIAL</span>` : ""}
      </div>
      <p class="text-[11px] text-blue-300 font-semibold mt-0.5">${esc(s.dose)}</p>
      <p class="text-[11px] text-slate-400 mt-0.5"><strong class="text-slate-300">When:</strong> ${esc(s.when)}</p>
      <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">${esc(s.why)}</p>
    </div>`).join("");

  document.getElementById("fallbackList").innerHTML = DIET_FALLBACKS.map(f => `
    <details class="bg-slate-800/50 border border-slate-700/50 rounded-lg p-2">
      <summary class="cursor-pointer text-xs font-bold text-white">${esc(f.when)}</summary>
      <p class="pt-1.5 text-[11px] text-slate-300 leading-relaxed">${esc(f.do)}</p>
    </details>`).join("");
}

function selectMealOption(mealId, idx) {
  const state = loadDayState(currentDateStr);
  state.mealOptionSelected[mealId] = idx;
  saveDayState(currentDateStr, state);
  updateTopDashboard();
  renderDietList();
}

function toggleMealDone(mealId) {
  const state = loadDayState(currentDateStr);
  state.mealsDone[mealId] = !state.mealsDone[mealId];
  saveDayState(currentDateStr, state);
  updateTopDashboard();
  renderDietList();
}

/* ---------------------------------------------------------------- APT view */
function renderAptView() {
  const state = loadDayState(currentDateStr);
  const dayNum = getProgramDayNumber(currentDateStr);

  document.getElementById("aptWhat").textContent = APT_EXPLAINER.what;
  document.getElementById("aptWhyYou").innerHTML = APT_EXPLAINER.whyYou
    .map(p => `<p class="text-[11px] text-slate-300 leading-relaxed">${esc(p)}</p>`).join("");
  document.getElementById("aptConsequences").innerHTML = APT_EXPLAINER.consequences
    .map(c => `<li class="flex gap-1.5"><span class="text-red-400 shrink-0">•</span><span>${esc(c)}</span></li>`).join("");
  document.getElementById("aptTimeline").innerHTML = APT_EXPLAINER.timeline.map(t => `
    <div class="flex gap-2 text-[11px]">
      <span class="w-20 shrink-0 font-bold text-purple-400">${esc(t.week)}</span>
      <span class="text-slate-300">${esc(t.what)}</span>
    </div>`).join("");

  /* non-negotiables */
  document.getElementById("aptNonNegotiables").innerHTML = APT_NON_NEGOTIABLES
    .map(n => `<li class="flex gap-1.5"><span class="text-emerald-400 shrink-0">✓</span><span>${esc(n)}</span></li>`).join("");

  /* daily habit checklist */
  document.getElementById("aptHabitList").innerHTML = APT_HABITS.map(h => {
    const done = !!state.aptHabits[h.id];
    return `<button onclick="toggleAptHabit('${h.id}')" class="w-full text-left flex items-start gap-2 bg-slate-800/50 border ${
      done ? "border-emerald-500/50" : "border-slate-700/50"
    } rounded-lg p-2">
      <span class="shrink-0 w-4 h-4 mt-0.5 rounded border-2 ${
        done ? "bg-emerald-500 border-emerald-400" : "border-slate-600"
      } flex items-center justify-center text-[10px] text-slate-950 font-bold">${done ? "✓" : ""}</span>
      <span class="min-w-0">
        <span class="block text-xs font-bold ${done ? "text-emerald-300" : "text-white"}">${esc(h.name)}</span>
        <span class="block text-[10px] text-slate-400">${esc(h.detail)}</span>
      </span>
    </button>`;
  }).join("");

  /* daily routines */
  document.getElementById("aptDailyList").innerHTML = APT_DAILY.map(r => {
    const done = !!state.aptDaily[r.id];
    return `
      <div class="bg-slate-900 border ${done ? "border-emerald-500/50" : "border-slate-800"} rounded-xl p-3">
        <div class="flex items-start justify-between gap-2">
          <div class="min-w-0">
            <span class="text-[10px] font-bold text-purple-400 uppercase tracking-wider">${esc(r.time)} • ${esc(r.dur)}</span>
            <h4 class="text-sm font-extrabold text-white">${esc(r.name)}</h4>
          </div>
          <button onclick="toggleAptDaily('${r.id}')" class="shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border ${
            done ? "bg-emerald-500/25 border-emerald-500 text-emerald-300" : "bg-slate-800 border-slate-700 text-slate-400"
          }">${done ? "✓ Done" : "Mark"}</button>
        </div>
        <p class="text-[11px] text-slate-400 leading-relaxed mt-1">${esc(r.intro)}</p>
        <div class="mt-2 space-y-1">
          ${r.items.map(i => `<div class="text-[11px] bg-slate-800/50 rounded px-2 py-1.5">
            <span class="font-bold text-white">${esc(i.name)}</span>
            <span class="text-emerald-400 font-semibold"> — ${esc(i.dose)}</span>
            <span class="block text-slate-400 mt-0.5">${esc(i.note)}</span>
          </div>`).join("")}
        </div>
      </div>`;
  }).join("");

  /* four-step protocol */
  document.getElementById("aptProtocol").innerHTML = APT_PROTOCOL.map(s => `
    <div class="bg-slate-900 border border-${s.color}-500/30 rounded-xl p-3">
      <div class="flex items-center gap-2">
        <span class="w-6 h-6 rounded-full bg-${s.color}-500/20 border border-${s.color}-500/40 text-${s.color}-300 text-xs font-extrabold flex items-center justify-center">${s.step}</span>
        <h4 class="text-sm font-extrabold text-white">${esc(s.name)}</h4>
      </div>
      <p class="text-[11px] text-${s.color}-300 font-semibold mt-1.5">${esc(s.goal)}</p>
      <p class="text-[11px] text-slate-400 leading-relaxed mt-1">${esc(s.detail)}</p>
      <details class="mt-2">
        <summary class="cursor-pointer text-[11px] font-bold text-slate-400">${s.drills.length} drills</summary>
        <div class="pt-1.5 space-y-1.5">
          ${s.drills.map(d => `<div class="text-[11px] bg-slate-800/50 rounded px-2 py-1.5">
            <span class="font-bold text-white">${esc(d.name)}</span>
            <span class="text-emerald-400 font-semibold"> — ${esc(d.dose)}</span>
            <span class="block text-slate-300 mt-0.5">${esc(d.cue)}</span>
            <span class="block text-slate-500 mt-0.5">When: ${esc(d.when)}</span>
          </div>`).join("")}
        </div>
      </details>
    </div>`).join("");

  /* self-assessment with logging */
  document.getElementById("aptTests").innerHTML = APT_TESTS.map(test => `
    <div class="bg-slate-900 border border-slate-800 rounded-xl p-3">
      <div class="flex items-start justify-between gap-2">
        <h4 class="text-sm font-extrabold text-white">${esc(test.name)}</h4>
        <span class="text-[10px] text-pink-400 font-bold shrink-0">${esc(test.freq)}</span>
      </div>
      <p class="text-[10px] text-slate-500 mt-0.5">Needs: ${esc(test.equipment)}</p>
      <ol class="mt-2 space-y-1 text-[11px] text-slate-300">
        ${test.how.map((h, i) => `<li class="flex gap-1.5"><span class="text-slate-500 font-bold shrink-0">${i + 1}.</span><span>${esc(h)}</span></li>`).join("")}
      </ol>
      <div class="mt-2 space-y-1">
        ${test.reading.map(r => `<div class="text-[11px] flex gap-1.5 ${r.good ? "text-emerald-300" : "text-amber-200"}">
          <span class="shrink-0">${r.good ? "✓" : "✗"}</span>
          <span><strong>${esc(r.result)}</strong> — ${esc(r.verdict)}</span></div>`).join("")}
      </div>
      <p class="text-[11px] text-slate-400 leading-relaxed mt-2">${esc(test.why)}</p>
      <label class="block text-[10px] text-slate-500 mt-2">${esc(test.log)}</label>
      <input type="text" value="${esc(state.aptTests[test.id] || "")}" placeholder="Today's result"
        onchange="saveAptTest('${test.id}', this.value)"
        class="w-full mt-1 bg-slate-800 border border-slate-700 rounded-lg px-2.5 py-2 text-xs text-white" />
    </div>`).join("");

  /* progression, with the current fortnight highlighted */
  const curWeek = getWeekForDay(dayNum);
  document.getElementById("aptProgression").innerHTML = APT_PROGRESSION.map(p => {
    const nums = (p.weeks.match(/\d+/g) || []).map(Number);
    const lo = nums[0], hi = nums[1] ?? nums[0];
    const active = curWeek >= lo && curWeek <= hi;
    return `
      <div class="bg-slate-900 border ${active ? "border-purple-500/60" : "border-slate-800"} rounded-xl p-3">
        <div class="flex items-center gap-2">
          <h4 class="text-sm font-extrabold ${active ? "text-purple-300" : "text-white"}">${esc(p.weeks)}</h4>
          ${active ? `<span class="text-[9px] px-1.5 py-0.5 rounded bg-purple-500/25 text-purple-200 font-bold">YOU ARE HERE</span>` : ""}
        </div>
        <p class="text-[11px] text-purple-400 font-semibold">${esc(p.phase)}</p>
        <p class="text-[11px] text-slate-400 leading-relaxed mt-1">${esc(p.focus)}</p>
        <ul class="mt-1.5 space-y-1 text-[11px] text-slate-300">
          ${p.do.map(d => `<li class="flex gap-1.5"><span class="text-emerald-500 shrink-0">•</span><span>${esc(d)}</span></li>`).join("")}
        </ul>
        <p class="text-[11px] text-pink-300 mt-1.5"><strong>Test:</strong> ${esc(p.testNow)}</p>
      </div>`;
  }).join("");

  /* logged test history */
  const hist = getAptTestHistory();
  document.getElementById("aptTestHistory").innerHTML = hist.length
    ? hist.map(h => `<div class="bg-slate-800/50 border border-slate-700/50 rounded-lg px-2.5 py-2 text-[11px]">
        <span class="font-bold text-white">${esc(h.date)}</span>
        ${APT_TESTS.filter(t => h.tests[t.id]).map(t =>
          `<span class="block text-slate-300">${esc(t.name)}: <strong class="text-emerald-400">${esc(h.tests[t.id])}</strong></span>`).join("")}
      </div>`).join("")
    : `<p class="text-[11px] text-slate-500">No tests logged yet. Run all four today — this is your baseline and you only get one shot at it.</p>`;
}

function toggleAptHabit(id) {
  const state = loadDayState(currentDateStr);
  state.aptHabits[id] = !state.aptHabits[id];
  saveDayState(currentDateStr, state);
  updateTopDashboard();
  renderAptView();
}

function toggleAptDaily(id) {
  const state = loadDayState(currentDateStr);
  state.aptDaily[id] = !state.aptDaily[id];
  saveDayState(currentDateStr, state);
  renderAptView();
}

function saveAptTest(id, value) {
  const state = loadDayState(currentDateStr);
  state.aptTests[id] = value;
  saveDayState(currentDateStr, state);
  renderAptView();
}

/* -------------------------------------------------------------- stats view */
function renderMetricsView() {
  const state = loadDayState(currentDateStr);
  const dayNum = getProgramDayNumber(currentDateStr);
  document.getElementById("inputWeight").value = state.weight || "";
  document.getElementById("inputBF").value = state.bf || "";
  document.getElementById("inputWaist").value = state.waist || "";

  /* where you should be today, interpolated between checkpoints */
  let expected = CHECKPOINTS[0];
  for (const c of CHECKPOINTS) if (dayNum >= c.day) expected = c;
  document.getElementById("metricsTarget").innerHTML =
    `Day ${dayNum}: on-track weight is about <strong class="text-emerald-400">${expected.targetWeight} kg</strong>
     at <strong class="text-emerald-400">${expected.targetBf}%</strong> body fat (${esc(expected.label)} checkpoint).`;

  document.getElementById("checkpointList").innerHTML = CHECKPOINTS.map(c => {
    const passed = dayNum >= c.day;
    const current = expected.day === c.day;
    return `<div class="bg-slate-800/50 border ${current ? "border-emerald-500/60" : "border-slate-700/50"} rounded-lg p-2.5">
      <div class="flex items-center justify-between gap-2">
        <span class="text-xs font-bold ${passed ? "text-emerald-300" : "text-slate-400"}">${esc(c.label)} — day ${c.day}</span>
        <span class="text-[10px] text-slate-500">${esc(c.date)}</span>
      </div>
      <p class="text-[11px] text-slate-300 mt-0.5">Target: <strong>${c.targetWeight} kg</strong> • ${c.targetBf}% BF</p>
      <p class="text-[10px] text-slate-400 mt-0.5">${esc(c.does)}</p>
    </div>`;
  }).join("");

  const logs = getMetricsHistory();
  const listEl = document.getElementById("weightHistoryList");
  listEl.innerHTML = logs.length
    ? logs.map(l => `<div class="flex justify-between gap-2 bg-slate-800/70 px-3 py-2 rounded-lg border border-slate-700/60 text-xs">
        <span class="font-bold text-white">${esc(l.date)}</span>
        <span class="text-emerald-400 font-bold">${l.weight ? esc(l.weight) + " kg" : "—"}
          ${l.bf ? " • " + esc(l.bf) + "% BF" : ""}${l.waist ? " • " + esc(l.waist) + " cm" : ""}</span>
      </div>`).join("")
    : `<p class="text-slate-500 text-xs">No check-ins yet. Log your 80.0 kg baseline above — without a baseline none of the later numbers mean anything.</p>`;

  document.getElementById("plateauRules").innerHTML = PLATEAU_RULES
    .map(r => `<li class="flex gap-1.5"><span class="text-amber-400 shrink-0">•</span><span>${esc(r)}</span></li>`).join("");
}

function saveMetrics() {
  const state = loadDayState(currentDateStr);
  state.weight = document.getElementById("inputWeight").value;
  state.bf = document.getElementById("inputBF").value;
  state.waist = document.getElementById("inputWaist").value;
  saveDayState(currentDateStr, state);
  renderMetricsView();
}

/* --------------------------------------------------------------- plan view */
function renderPlanView() {
  const dayNum = getProgramDayNumber(currentDateStr);
  const host = document.getElementById("planContent");

  const overview = `
    <div class="plan-sec">
      <h3 class="plan-h2">The Goal</h3>
      <p class="plan-p">${esc(PROGRAM.oneLiner)}</p>
      <table class="plan-table">
        <thead><tr><th>Metric</th><th>Start (Oct 20, 2026)</th><th>Goal (Jan 20, 2027)</th></tr></thead>
        <tbody>
          <tr><td>Weight</td><td>${PROGRAM.bodyStart.weight} kg</td><td>${PROGRAM.bodyGoal.weight} kg</td></tr>
          <tr><td>Body fat</td><td>${PROGRAM.bodyStart.bf}%</td><td>${PROGRAM.bodyGoal.bf}%</td></tr>
          <tr><td>Lean mass</td><td>~${PROGRAM.bodyStart.muscle} kg</td><td>${PROGRAM.bodyGoal.muscle}+ kg</td></tr>
          <tr><td>Waist</td><td>~${PROGRAM.bodyStart.waist} cm</td><td>~${PROGRAM.bodyGoal.waist} cm</td></tr>
          <tr><td>BMI</td><td>${PROGRAM.bodyStart.bmi}</td><td>${PROGRAM.bodyGoal.bmi}</td></tr>
          <tr><td>Pelvis</td><td>Anterior tilt</td><td>Neutral</td></tr>
        </tbody>
      </table>
      <h3 class="plan-h2">Why this works</h3>
      ${PROGRAM.rationale.map(r => `<p class="plan-p">${esc(r)}</p>`).join("")}
      <h3 class="plan-h2">The 13-week structure</h3>
      ${PHASES.map(p => `
        <div class="plan-card ${dayNum >= p.dayFrom && dayNum <= p.dayTo ? "plan-card-active" : ""}">
          <h4 class="plan-h3">${esc(p.name)} — ${esc(p.weeks)} (days ${p.dayFrom}-${p.dayTo})</h4>
          <p class="plan-p">${esc(p.goal)}</p>
          <p class="plan-kv"><b>Training:</b> ${p.prescription.sets} sets × ${esc(p.prescription.reps)} @ RPE ${esc(p.prescription.rpe)}, ${p.prescription.restSec}s rest, tempo ${esc(p.prescription.tempo)}</p>
          <p class="plan-kv"><b>Load rule:</b> ${esc(p.loadRule)}</p>
          <p class="plan-kv"><b>Nutrition:</b> ${p.kcal} kcal • ${p.protein}g protein • ${p.carbs}g carbs • ${p.fat}g fat • ${p.waterL}L water</p>
          <p class="plan-kv"><b>Cardio:</b> ${esc(p.cardio)}</p>
          <p class="plan-kv"><b>APT focus:</b> ${esc(p.aptFocus)}</p>
          <p class="plan-kv"><b>Expect:</b> ${esc(p.expect)}</p>
        </div>`).join("")}
    </div>`;

  const routine = `
    <div class="plan-sec">
      <h3 class="plan-h2">Gym Day (Monday to Saturday)</h3>
      ${SCHEDULE_GYM.map(s => `
        <div class="plan-card">
          <h4 class="plan-h3">${esc(s.time)} — ${esc(s.title)} <span class="plan-dim">(${esc(s.dur)})</span></h4>
          <p class="plan-p">${esc(s.detail)}</p>
          <ul class="plan-ul">${s.steps.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>`).join("")}
      <h3 class="plan-h2">Sunday (Active Recovery)</h3>
      ${SCHEDULE_REST.map(s => `
        <div class="plan-card">
          <h4 class="plan-h3">${esc(s.time)} — ${esc(s.title)} <span class="plan-dim">(${esc(s.dur)})</span></h4>
          <p class="plan-p">${esc(s.detail)}</p>
          <ul class="plan-ul">${s.steps.map(x => `<li>${esc(x)}</li>`).join("")}</ul>
        </div>`).join("")}
      <h3 class="plan-h2">Sleep &amp; Recovery</h3>
      <p class="plan-kv"><b>Sleep window:</b> ${esc(RECOVERY_PROTOCOL.sleepWindow)}</p>
      <ul class="plan-ul">${RECOVERY_PROTOCOL.rules.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
      <p class="plan-kv"><b>Rest day:</b> ${esc(RECOVERY_PROTOCOL.restDay)}</p>
      <h3 class="plan-h2">Cardio &amp; Steps</h3>
      <p class="plan-p">${esc(CARDIO_PROTOCOL.principle)}</p>
      ${CARDIO_PROTOCOL.daily.map(c => `<p class="plan-kv"><b>${esc(c.what)} (${esc(c.when)}):</b> ${esc(c.detail)}</p>`).join("")}
      <p class="plan-kv"><b>Step targets:</b> ${CARDIO_PROTOCOL.stepTargets.map(s => `${esc(s.phase)} → ${esc(s.steps)}`).join(" • ")}</p>
      <p class="plan-warn">${esc(CARDIO_PROTOCOL.warning)}</p>
    </div>`;

  const training = `
    <div class="plan-sec">
      ${WORKOUT_DAYS.map(day => `
        <h3 class="plan-h2">${esc(day.name)} — ${esc(day.dow)}</h3>
        <p class="plan-p"><b>Focus:</b> ${esc(day.focus)}</p>
        <p class="plan-p">${esc(day.summary)}</p>
        ${day.blocks.map(block => `
          <h4 class="plan-h3">${BLOCK_STYLE[block.type].icon} ${esc(block.name)} <span class="plan-dim">(${esc(block.dur)})</span></h4>
          ${block.note ? `<p class="plan-p plan-dim">${esc(block.note)}</p>` : ""}
          ${block.exercises.map((ex, i) => {
            const p = getPrescription(dayNum, ex);
            return `
            <div class="plan-ex">
              <h5 class="plan-h4">${i + 1}. ${esc(ex.name)}</h5>
              <p class="plan-kv"><b>Machine:</b> ${esc(ex.machine)}</p>
              <p class="plan-kv"><b>Prescription:</b> ${p.sets} set${p.sets === 1 ? "" : "s"} × ${esc(p.reps)}${p.fixed ? "" : ` @ RPE ${esc(p.rpe)}`}${p.restSec ? ` • rest ${p.restSec}s` : ""} • tempo ${esc(p.tempo)}</p>
              <p class="plan-kv"><b>Setup:</b> ${esc(ex.setup)}</p>
              <p class="plan-kv"><b>Execution:</b> ${esc(ex.exec)}</p>
              <p class="plan-kv plan-apt"><b>APT cue:</b> ${esc(ex.apt)}</p>
              <p class="plan-kv"><b>Common mistake:</b> ${esc(ex.mistake)}</p>
              <p class="plan-kv"><b>Substitute:</b> ${esc(ex.substitute)}</p>
            </div>`;
          }).join("")}
        `).join("")}
      `).join("")}
    </div>`;

  const diet = `
    <div class="plan-sec">
      <h3 class="plan-h2">Daily Targets by Phase</h3>
      <table class="plan-table">
        <thead><tr><th>Phase</th><th>kcal</th><th>Protein</th><th>Carbs</th><th>Fat</th><th>Water</th></tr></thead>
        <tbody>${PHASES.map(p => `<tr><td>${esc(p.weeks)}</td><td>${p.kcal}</td><td>${p.protein}g</td><td>${p.carbs}g</td><td>${p.fat}g</td><td>${p.waterL}L</td></tr>`).join("")}</tbody>
      </table>
      <h3 class="plan-h2">${esc(DIET_STRATEGY.headline)}</h3>
      <ul class="plan-ul">${DIET_STRATEGY.points.map(p => `<li>${esc(p)}</li>`).join("")}</ul>
      ${DIET_DATA.map(meal => `
        <h3 class="plan-h2">${esc(meal.meal)} — ${esc(meal.time)}</h3>
        <p class="plan-p">${esc(meal.note)}</p>
        ${meal.options.map((o, i) => `
          <div class="plan-ex">
            <h5 class="plan-h4">Option ${i + 1}: ${esc(o.name)}</h5>
            <p class="plan-kv">${esc(o.desc)}</p>
            <p class="plan-kv"><b>${o.kcal} kcal</b> • ${o.protein}g protein • ${o.carbs}g carbs • ${o.fat}g fat • ₹${o.cost} • ${o.prepMin} min • ${o.tags.join(", ")}</p>
            <p class="plan-kv plan-dim">${esc(o.tip)}</p>
          </div>`).join("")}
      `).join("")}
      <h3 class="plan-h2">Hydration</h3>
      <p class="plan-p">${esc(HYDRATION_PLAN.why)}</p>
      <table class="plan-table"><thead><tr><th>Time</th><th>Amount</th><th>Note</th></tr></thead>
        <tbody>${HYDRATION_PLAN.schedule.map(h => `<tr><td>${esc(h.time)}</td><td>${esc(h.amount)}</td><td>${esc(h.note)}</td></tr>`).join("")}</tbody></table>
      <h3 class="plan-h2">Supplements</h3>
      ${SUPPLEMENTS.map(s => `
        <div class="plan-ex">
          <h5 class="plan-h4">${esc(s.name)}${s.nonNegotiable ? " (essential)" : " (optional)"}</h5>
          <p class="plan-kv"><b>Dose:</b> ${esc(s.dose)}</p>
          <p class="plan-kv"><b>When:</b> ${esc(s.when)}</p>
          <p class="plan-kv">${esc(s.why)}</p>
        </div>`).join("")}
      <h3 class="plan-h2">Weekly Shopping List</h3>
      ${GROCERY_LIST.map(g => `
        <h4 class="plan-h3">${esc(g.cat)}</h4>
        <table class="plan-table"><tbody>${g.items.map(i => `<tr><td>${esc(i.item)}</td><td>${esc(i.qty)}</td><td>₹${i.cost}</td></tr>`).join("")}</tbody></table>`).join("")}
      <h3 class="plan-h2">Monthly Budget (cap ₹${PROGRAM_BUDGET.monthlyCap})</h3>
      <table class="plan-table"><thead><tr><th>Item</th><th>Monthly</th><th>Note</th></tr></thead>
        <tbody>${PROGRAM_BUDGET.breakdown.map(b => `<tr><td>${esc(b.item)}</td><td>₹${b.monthly}</td><td>${esc(b.note)}</td></tr>`).join("")}
        <tr><td><b>Total</b></td><td><b>₹${PROGRAM_BUDGET.monthlyEstimate}</b></td><td></td></tr></tbody></table>
      <h3 class="plan-h2">When Life Gets In The Way</h3>
      ${DIET_FALLBACKS.map(f => `<p class="plan-kv"><b>${esc(f.when)}:</b> ${esc(f.do)}</p>`).join("")}
    </div>`;

  const apt = `
    <div class="plan-sec">
      <h3 class="plan-h2">What APT Is</h3>
      <p class="plan-p">${esc(APT_EXPLAINER.what)}</p>
      <h3 class="plan-h2">Why You Have It</h3>
      ${APT_EXPLAINER.whyYou.map(p => `<p class="plan-p">${esc(p)}</p>`).join("")}
      <h3 class="plan-h2">What It Costs You</h3>
      <ul class="plan-ul">${APT_EXPLAINER.consequences.map(c => `<li>${esc(c)}</li>`).join("")}</ul>
      <h3 class="plan-h2">Self-Assessment</h3>
      ${APT_TESTS.map(t => `
        <div class="plan-ex">
          <h5 class="plan-h4">${esc(t.name)} <span class="plan-dim">(${esc(t.freq)})</span></h5>
          <p class="plan-kv"><b>Needs:</b> ${esc(t.equipment)}</p>
          <ol class="plan-ul">${t.how.map(h => `<li>${esc(h)}</li>`).join("")}</ol>
          ${t.reading.map(r => `<p class="plan-kv">${r.good ? "✓" : "✗"} <b>${esc(r.result)}</b> — ${esc(r.verdict)}</p>`).join("")}
          <p class="plan-kv"><b>Log as:</b> ${esc(t.log)}</p>
          <p class="plan-kv plan-dim">${esc(t.why)}</p>
        </div>`).join("")}
      <h3 class="plan-h2">The Four-Step Protocol</h3>
      ${APT_PROTOCOL.map(s => `
        <h4 class="plan-h3">Step ${s.step}: ${esc(s.name)}</h4>
        <p class="plan-kv"><b>Goal:</b> ${esc(s.goal)}</p>
        <p class="plan-p">${esc(s.detail)}</p>
        <table class="plan-table"><thead><tr><th>Drill</th><th>Dose</th><th>Cue</th><th>When</th></tr></thead>
          <tbody>${s.drills.map(d => `<tr><td>${esc(d.name)}</td><td>${esc(d.dose)}</td><td>${esc(d.cue)}</td><td>${esc(d.when)}</td></tr>`).join("")}</tbody></table>`).join("")}
      <h3 class="plan-h2">Daily Routines Outside The Gym</h3>
      ${APT_DAILY.map(r => `
        <h4 class="plan-h3">${esc(r.name)} — ${esc(r.time)} (${esc(r.dur)})</h4>
        <p class="plan-p">${esc(r.intro)}</p>
        <table class="plan-table"><tbody>${r.items.map(i => `<tr><td>${esc(i.name)}</td><td>${esc(i.dose)}</td><td>${esc(i.note)}</td></tr>`).join("")}</tbody></table>`).join("")}
      <h3 class="plan-h2">13-Week APT Progression</h3>
      ${APT_PROGRESSION.map(p => `
        <h4 class="plan-h3">${esc(p.weeks)} — ${esc(p.phase)}</h4>
        <p class="plan-p">${esc(p.focus)}</p>
        <ul class="plan-ul">${p.do.map(d => `<li>${esc(d)}</li>`).join("")}</ul>
        <p class="plan-kv"><b>Test:</b> ${esc(p.testNow)}</p>`).join("")}
      <h3 class="plan-h2">Daily Habit Checklist</h3>
      <ul class="plan-ul">${APT_HABITS.map(h => `<li><b>${esc(h.name)}</b> — ${esc(h.detail)}</li>`).join("")}</ul>
      <h3 class="plan-h2">If You Only Do Six Things</h3>
      <ul class="plan-ul">${APT_NON_NEGOTIABLES.map(n => `<li>${esc(n)}</li>`).join("")}</ul>
    </div>`;

  const checkpoints = `
    <div class="plan-sec">
      <h3 class="plan-h2">Fortnightly Checkpoints</h3>
      <table class="plan-table">
        <thead><tr><th>Day</th><th>Date</th><th>Label</th><th>Weight</th><th>BF</th><th>What to do</th></tr></thead>
        <tbody>${CHECKPOINTS.map(c => `<tr><td>${c.day}</td><td>${esc(c.date)}</td><td>${esc(c.label)}</td><td>${c.targetWeight} kg</td><td>${c.targetBf}%</td><td>${esc(c.does)}</td></tr>`).join("")}</tbody>
      </table>
      <h3 class="plan-h2">When The Scale Stops Moving</h3>
      <ul class="plan-ul">${PLATEAU_RULES.map(r => `<li>${esc(r)}</li>`).join("")}</ul>
    </div>`;

  const sections = { overview, routine, training, diet, apt, checkpoints };
  host.innerHTML = planSection === "all"
    ? Object.values(sections).join("")
    : (sections[planSection] || overview);

  document.querySelectorAll("[data-plan-tab]").forEach(btn => {
    const on = btn.getAttribute("data-plan-tab") === planSection;
    btn.className = "shrink-0 px-2.5 py-1.5 rounded-lg text-[11px] font-bold border " +
      (on ? "bg-emerald-500 text-slate-950 border-emerald-400" : "bg-slate-800 text-slate-300 border-slate-700");
  });
}

function setPlanSection(s) {
  planSection = s;
  renderPlanView();
}

function printPlan() {
  const prev = planSection;
  planSection = "all";
  renderPlanView();
  setTimeout(() => {
    window.print();
    planSection = prev;
    renderPlanView();
  }, 400);
}

/* ------------------------------------------------------------ tutorial modal */
function openTutorial(exId) {
  const found = findExercise(exId);
  if (!found) return;
  const ex = found.exercise;
  modalExerciseId = exId;
  modalShowWrong = false;
  const p = getPrescription(getProgramDayNumber(currentDateStr), ex);

  document.getElementById("modalMachine").textContent = ex.machine;
  document.getElementById("modalTitle").textContent = ex.name;
  document.getElementById("modalPrescription").textContent =
    `${p.sets} set${p.sets === 1 ? "" : "s"} × ${p.reps}${p.fixed ? "" : ` @ RPE ${p.rpe}`}${p.restSec ? ` • rest ${p.restSec}s` : ""} • ${p.tempo}`;
  document.getElementById("modalSetup").textContent = ex.setup;
  document.getElementById("modalExecution").textContent = ex.exec;
  document.getElementById("modalAptCue").textContent = ex.apt;
  document.getElementById("modalMistake").textContent = ex.mistake;
  document.getElementById("modalSubstitute").textContent = ex.substitute;
  document.getElementById("modalVideoBtn").href = ex.video;

  const tpl = ANIM[ex.anim];
  document.getElementById("modalWrongNote").textContent = tpl ? (tpl.wrongNote || "") : "";

  document.getElementById("tutorialModal").classList.remove("hidden");
  drawExercise(ex, document.getElementById("modalSvgContainer"), { showWrong: false });
  syncWrongButton();
}

function toggleWrongForm() {
  modalShowWrong = !modalShowWrong;
  const found = findExercise(modalExerciseId);
  if (!found) return;
  drawExercise(found.exercise, document.getElementById("modalSvgContainer"), { showWrong: modalShowWrong });
  syncWrongButton();
}

function syncWrongButton() {
  const btn = document.getElementById("wrongFormBtn");
  const note = document.getElementById("modalWrongWrap");
  btn.textContent = modalShowWrong ? "✓ Showing wrong vs correct" : "✗ Compare with wrong form";
  btn.className = "w-full py-2.5 rounded-xl text-xs font-bold border " + (modalShowWrong
    ? "bg-red-500/20 border-red-500/50 text-red-200"
    : "bg-slate-800 border-slate-700 text-slate-300");
  note.classList.toggle("hidden", !modalShowWrong);
}

function closeModal() {
  stopExercise(document.getElementById("modalSvgContainer"));
  document.getElementById("tutorialModal").classList.add("hidden");
  modalExerciseId = null;
}

/* ------------------------------------------------------------------- tabs */
function switchTab(tab) {
  TABS.forEach(t => {
    document.getElementById(`view-${t}`).classList.toggle("hidden", t !== tab);
    const nav = document.getElementById(`nav-${t}`);
    nav.className = "flex flex-col items-center text-[9px] py-1 " +
      (t === tab ? "text-emerald-400 font-bold" : "text-slate-400 font-medium");
  });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

initApp();
