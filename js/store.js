/* ==========================================================================
   store.js — per-day state in localStorage, plus schema migration.

   Keys look like  apt_tracker_2026-10-20  (unchanged from v1, so existing
   saved days survive the rebuild).

   v1 recorded `setsDone[exId] = <number of sets completed>`.
   v2 records `sets[exId] = [{weight, reps, done}, ...]` so loads can be
   logged and progressive overload actually tracked. Migration fills the
   first N entries as done with no weight, so nothing is lost.
   ========================================================================== */

const SCHEMA_VERSION = 2;
const STORE_PREFIX = "apt_tracker_";

function getStoreKey(dateStr) { return STORE_PREFIX + dateStr; }

function emptyState() {
  return {
    v: SCHEMA_VERSION,
    scheduleDone: {},
    mealsDone: {},
    mealOptionSelected: {},
    sets: {},
    aptHabits: {},
    aptDaily: {},
    aptTests: {},
    water: 0,
    weight: "",
    bf: "",
    waist: "",
    notes: ""
  };
}

function migrateState(raw) {
  const s = Object.assign(emptyState(), raw || {});
  if (!raw || !raw.v) {
    // v1 -> v2: expand the per-exercise completed-set counts into set rows.
    s.sets = {};
    const legacy = (raw && raw.setsDone) || {};
    for (const exId of Object.keys(legacy)) {
      const n = Number(legacy[exId]) || 0;
      if (n > 0) s.sets[exId] = Array.from({ length: n }, () => ({ weight: "", reps: "", done: true }));
    }
  }
  delete s.setsDone;
  s.v = SCHEMA_VERSION;
  return s;
}

function loadDayState(dateStr) {
  let raw = null;
  try {
    const txt = localStorage.getItem(getStoreKey(dateStr));
    if (txt) raw = JSON.parse(txt);
  } catch (e) {
    raw = null;
  }
  return migrateState(raw);
}

function saveDayState(dateStr, state) {
  try {
    state.v = SCHEMA_VERSION;
    localStorage.setItem(getStoreKey(dateStr), JSON.stringify(state));
  } catch (e) {
    /* private mode, blocked storage, or quota — the UI still works for this session */
  }
}

/* Ensure a sets array of the right length exists for an exercise. */
function ensureSets(state, exId, count) {
  if (!Array.isArray(state.sets[exId])) state.sets[exId] = [];
  const arr = state.sets[exId];
  while (arr.length < count) arr.push({ weight: "", reps: "", done: false });
  if (arr.length > count) arr.length = count;
  return arr;
}

function setsCompleted(state, exId) {
  const arr = state.sets[exId];
  return Array.isArray(arr) ? arr.filter(s => s.done).length : 0;
}

/* All stored dates, newest first. */
function allStoredDates() {
  const out = [];
  try {
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(STORE_PREFIX)) out.push(k.slice(STORE_PREFIX.length));
    }
  } catch (e) { /* storage unavailable */ }
  return out.sort((a, b) => b.localeCompare(a));
}

/* The most recent logged weight x reps for an exercise before `beforeDate`.
   This is what turns the app from a checklist into a progression tool —
   you cannot beat last week if you cannot see last week. */
function getLastSession(exId, beforeDate) {
  for (const d of allStoredDates()) {
    if (d >= beforeDate) continue;
    const st = loadDayState(d);
    const arr = st.sets[exId];
    if (Array.isArray(arr)) {
      const logged = arr.filter(s => s.done && s.weight !== "" && s.weight != null);
      if (logged.length) {
        const top = logged.reduce((a, b) => (Number(b.weight) > Number(a.weight) ? b : a));
        return { date: d, weight: top.weight, reps: top.reps, sets: logged.length };
      }
    }
  }
  return null;
}

/* Body-metric history for the Stats tab. */
function getMetricsHistory() {
  const logs = [];
  for (const d of allStoredDates()) {
    const st = loadDayState(d);
    if (st.weight || st.bf || st.waist) {
      logs.push({ date: d, weight: st.weight, bf: st.bf, waist: st.waist });
    }
  }
  return logs;
}

/* APT test results across time, for the APT tab's progress log. */
function getAptTestHistory() {
  const logs = [];
  for (const d of allStoredDates()) {
    const st = loadDayState(d);
    if (st.aptTests && Object.keys(st.aptTests).some(k => st.aptTests[k])) {
      logs.push({ date: d, tests: st.aptTests });
    }
  }
  return logs;
}

/* Day 1..92 of the program for a given date. */
function getProgramDayNumber(dateStr) {
  const start = new Date(PROGRAM.startDate + "T00:00:00");
  const d = new Date(dateStr + "T00:00:00");
  const n = Math.floor((d - start) / 86400000) + 1;
  return Math.max(1, Math.min(PROGRAM.totalDays, n));
}
