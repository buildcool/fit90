/* Generates PLAN.md from the js/data-*.js files, so the document can never
   drift from what the app shows. Run: node tools/gen-plan.mjs

   The data files are classic scripts (not modules), so they are read and
   evaluated in a vm context and the globals pulled back out. */

import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const root = path.resolve(import.meta.dirname, "..");
const files = [
  "js/data-plan.js",
  "js/data-schedule.js",
  "js/data-workouts.js",
  "js/data-diet.js",
  "js/data-apt.js"
];

const src = files.map(f => fs.readFileSync(path.join(root, f), "utf8")).join("\n;\n");
const probe = `({
  PROGRAM, PHASES, PROGRAM_BUDGET, SUPPLEMENTS, CARDIO_PROTOCOL, RECOVERY_PROTOCOL,
  CHECKPOINTS, PLATEAU_RULES, SCHEDULE_GYM, SCHEDULE_REST, WORKOUT_DAYS, BLOCK_STYLE,
  DIET_DATA, DIET_STRATEGY, HYDRATION_PLAN, GROCERY_LIST, DIET_FALLBACKS,
  APT_EXPLAINER, APT_TESTS, APT_PROTOCOL, APT_DAILY, APT_HABITS, APT_PROGRESSION,
  APT_NON_NEGOTIABLES, getPrescription
})`;
const D = vm.runInNewContext(src + "\n;\n" + probe, {});

const out = [];
const w = (...l) => out.push(...l);
const bullets = arr => arr.map(x => `- ${x}`).join("\n");
const numbered = arr => arr.map((x, i) => `${i + 1}. ${x}`).join("\n");
const table = (head, rows) =>
  [`| ${head.join(" | ")} |`, `|${head.map(() => "---").join("|")}|`,
   ...rows.map(r => `| ${r.map(c => String(c).replace(/\|/g, "\\|")).join(" | ")} |`)].join("\n");

/* ---------------------------------------------------------------- header */
w(`# ${D.PROGRAM.name}`, "");
w(`**${D.PROGRAM.startDate} → ${D.PROGRAM.endDate} · ${D.PROGRAM.totalDays} days**`, "");
w(D.PROGRAM.oneLiner, "");
w("> Generated from the app's own data files by `node tools/gen-plan.mjs` — the app and this document cannot disagree.", "");

w("## Contents", "");
w(bullets([
  "[1. The Goal](#1-the-goal)", "[2. Why This Works](#2-why-this-works)",
  "[3. The 13-Week Structure](#3-the-13-week-structure)", "[4. Hour-by-Hour Daily Routine](#4-hour-by-hour-daily-routine)",
  "[5. Sleep, Recovery & Cardio](#5-sleep-recovery--cardio)", "[6. All Seven Training Days](#6-all-seven-training-days)",
  "[7. Diet](#7-diet)", "[8. Supplements](#8-supplements)", "[9. Shopping List & Budget](#9-shopping-list--budget)",
  "[10. The APT Correction Program](#10-the-apt-correction-program)", "[11. Checkpoints & Troubleshooting](#11-checkpoints--troubleshooting)"
]), "");

/* ------------------------------------------------------------------ goal */
w("## 1. The Goal", "");
w(table(["Metric", `Start (${D.CHECKPOINTS[0].date})`, `Goal (${D.CHECKPOINTS.at(-1).date})`], [
  ["Weight", `${D.PROGRAM.bodyStart.weight} kg`, `${D.PROGRAM.bodyGoal.weight} kg`],
  ["Body fat", `${D.PROGRAM.bodyStart.bf}%`, `${D.PROGRAM.bodyGoal.bf}%`],
  ["Lean mass", `~${D.PROGRAM.bodyStart.muscle} kg`, `${D.PROGRAM.bodyGoal.muscle}+ kg`],
  ["Waist", `~${D.PROGRAM.bodyStart.waist} cm`, `~${D.PROGRAM.bodyGoal.waist} cm`],
  ["BMI", D.PROGRAM.bodyStart.bmi, D.PROGRAM.bodyGoal.bmi],
  ["Pelvis", "Anterior tilt", "Neutral"]
]), "");

w("## 2. Why This Works", "");
D.PROGRAM.rationale.forEach(r => w(r, ""));

/* ---------------------------------------------------------------- phases */
w("## 3. The 13-Week Structure", "");
w(table(["Phase", "Weeks", "Days", "Sets × reps", "RPE", "Rest", "kcal", "Protein"],
  D.PHASES.map(p => [p.name.replace(/^Phase \d+ — /, ""), p.weeks, `${p.dayFrom}-${p.dayTo}`,
    `${p.prescription.sets} × ${p.prescription.reps}`, p.prescription.rpe,
    `${p.prescription.restSec}s`, p.kcal, `${p.protein}g`])), "");

D.PHASES.forEach(p => {
  w(`### ${p.name} — ${p.weeks} (days ${p.dayFrom}-${p.dayTo})`, "");
  w(p.goal, "");
  w(bullets([
    `**Training:** ${p.prescription.sets} sets × ${p.prescription.reps} @ RPE ${p.prescription.rpe}, ${p.prescription.restSec}s rest, tempo ${p.prescription.tempo}`,
    `**Load rule:** ${p.loadRule}`,
    `**Nutrition:** ${p.kcal} kcal · ${p.protein}g protein · ${p.carbs}g carbs · ${p.fat}g fat · ${p.waterL}L water`,
    `**Cardio:** ${p.cardio}`,
    `**APT focus:** ${p.aptFocus}`,
    `**Expect:** ${p.expect}`
  ]), "");
});

/* -------------------------------------------------------------- routines */
w("## 4. Hour-by-Hour Daily Routine", "");
const sched = (title, list) => {
  w(`### ${title}`, "");
  list.forEach(s => {
    w(`#### ${s.time} — ${s.title} *(${s.dur})*`, "");
    w(s.detail, "");
    w(bullets(s.steps), "");
  });
};
sched("Gym Day (Monday – Saturday)", D.SCHEDULE_GYM);
sched("Sunday (Active Recovery)", D.SCHEDULE_REST);

w("## 5. Sleep, Recovery & Cardio", "");
w(`### Sleep — ${D.RECOVERY_PROTOCOL.sleepWindow}`, "");
w(bullets(D.RECOVERY_PROTOCOL.rules), "");
w(`**Rest day:** ${D.RECOVERY_PROTOCOL.restDay}`, "");
w("### Cardio & Steps", "");
w(D.CARDIO_PROTOCOL.principle, "");
w(table(["What", "When", "Detail"], D.CARDIO_PROTOCOL.daily.map(c => [c.what, c.when, c.detail])), "");
w(table(["Phase", "Daily steps"], D.CARDIO_PROTOCOL.stepTargets.map(s => [s.phase, s.steps])), "");
w(`> ${D.CARDIO_PROTOCOL.warning}`, "");

/* -------------------------------------------------------------- training */
w("## 6. All Seven Training Days", "");
w("Sets, reps, RPE and rest below are shown for **Phase 1 (weeks 1-2)**. They change automatically each phase — see section 3 for the progression, and the app shows the current prescription for whatever day you open.", "");

let exCount = 0;
D.WORKOUT_DAYS.forEach(day => {
  w(`### ${day.name} — ${day.dow}`, "");
  w(`**Focus:** ${day.focus}`, "");
  w(day.summary, "");
  day.blocks.forEach(block => {
    w(`#### ${block.name} *(${block.dur})*`, "");
    if (block.note) w(`*${block.note}*`, "");
    block.exercises.forEach((ex, i) => {
      exCount++;
      const p = D.getPrescription(1, ex);
      w(`**${i + 1}. ${ex.name}**`, "");
      w(bullets([
        `**Machine:** ${ex.machine}`,
        `**Prescription:** ${p.sets} set${p.sets === 1 ? "" : "s"} × ${p.reps}${p.fixed ? "" : ` @ RPE ${p.rpe}`}${p.restSec ? ` · rest ${p.restSec}s` : ""} · tempo ${p.tempo}`,
        `**Setup:** ${ex.setup}`,
        `**Execution:** ${ex.exec}`,
        `**APT cue:** ${ex.apt}`,
        `**Common mistake:** ${ex.mistake}`,
        `**Substitute:** ${ex.substitute}`
      ]), "");
    });
  });
});

/* ------------------------------------------------------------------ diet */
w("## 7. Diet", "");
w("Pure vegetarian, no cooking required, built around the PG meals already included in your rent. 6 meals × 6 options = 36 choices.", "");
w(table(["Phase", "kcal", "Protein", "Carbs", "Fat", "Water"],
  D.PHASES.map(p => [p.weeks, p.kcal, `${p.protein}g`, `${p.carbs}g`, `${p.fat}g`, `${p.waterL}L`])), "");
w(`### ${D.DIET_STRATEGY.headline}`, "");
w(bullets(D.DIET_STRATEGY.points), "");

let optCount = 0;
D.DIET_DATA.forEach(meal => {
  w(`### ${meal.meal} — ${meal.time} (${meal.slot})`, "");
  w(meal.note, "");
  w(table(["#", "Option", "kcal", "P", "C", "F", "Cost", "Prep"],
    meal.options.map((o, i) => { optCount++; return [i + 1, o.name, o.kcal, `${o.protein}g`, `${o.carbs}g`, `${o.fat}g`, `₹${o.cost}`, `${o.prepMin} min`]; })), "");
  meal.options.forEach((o, i) => {
    w(`**Option ${i + 1} — ${o.name}**  `);
    w(`${o.desc}  `);
    w(`*${o.tip}* · tags: ${o.tags.join(", ")}`, "");
  });
});

w("### Hydration", "");
w(D.HYDRATION_PLAN.why, "");
w(table(["Time", "Amount", "Note"], D.HYDRATION_PLAN.schedule.map(h => [h.time, h.amount, h.note])), "");

w("### When Life Gets In The Way", "");
D.DIET_FALLBACKS.forEach(f => w(`**${f.when}** — ${f.do}`, ""));

/* ----------------------------------------------------------- supplements */
w("## 8. Supplements", "");
D.SUPPLEMENTS.forEach(s => {
  w(`### ${s.name}${s.nonNegotiable ? " (essential)" : " (optional)"}`, "");
  w(bullets([`**Dose:** ${s.dose}`, `**When:** ${s.when}`, `**Why:** ${s.why}`]), "");
});

/* ------------------------------------------------------------- shopping */
w("## 9. Shopping List & Budget", "");
D.GROCERY_LIST.forEach(g => {
  w(`### ${g.cat} — ₹${g.items.reduce((s, i) => s + i.cost, 0)}`, "");
  w(table(["Item", "Quantity", "Cost"], g.items.map(i => [i.item, i.qty, `₹${i.cost}`])), "");
});
w(`### Monthly Budget (cap ₹${D.PROGRAM_BUDGET.monthlyCap})`, "");
w(table(["Item", "Monthly", "Note"], [
  ...D.PROGRAM_BUDGET.breakdown.map(b => [b.item, `₹${b.monthly}`, b.note]),
  ["**Total**", `**₹${D.PROGRAM_BUDGET.monthlyEstimate}**`, ""]
]), "");

/* ------------------------------------------------------------------- APT */
w("## 10. The APT Correction Program", "");
w("### What APT Is", "");
w(D.APT_EXPLAINER.what, "");
w("### Why You Have It", "");
D.APT_EXPLAINER.whyYou.forEach(p => w(p, ""));
w("### What It Costs You", "");
w(bullets(D.APT_EXPLAINER.consequences), "");
w("### What To Expect, When", "");
w(table(["Period", "What happens"], D.APT_EXPLAINER.timeline.map(t => [t.week, t.what])), "");

w("### If You Only Do Six Things", "");
w(numbered(D.APT_NON_NEGOTIABLES), "");

w("### Self-Assessment", "");
D.APT_TESTS.forEach(t => {
  w(`#### ${t.name} *(${t.freq})*`, "");
  w(`**Needs:** ${t.equipment}`, "");
  w(numbered(t.how), "");
  w(table(["Result", "Verdict"], t.reading.map(r => [`${r.good ? "✓" : "✗"} ${r.result}`, r.verdict])), "");
  w(`**Log as:** ${t.log}`, "");
  w(`*${t.why}*`, "");
});

w("### The Four-Step Protocol", "");
w("The order never changes: you cannot strengthen a muscle into a position a tight muscle will not let it reach, and you cannot hold a position your brain does not default to.", "");
D.APT_PROTOCOL.forEach(s => {
  w(`#### Step ${s.step}: ${s.name}`, "");
  w(`**Goal:** ${s.goal}`, "");
  w(s.detail, "");
  w(table(["Drill", "Dose", "Cue", "When"], s.drills.map(d => [d.name, d.dose, d.cue, d.when])), "");
});

w("### Daily Routines Outside The Gym", "");
D.APT_DAILY.forEach(r => {
  w(`#### ${r.name} — ${r.time} *(${r.dur})*`, "");
  w(r.intro, "");
  w(table(["Item", "Dose", "Note"], r.items.map(i => [i.name, i.dose, i.note])), "");
});

w("### Daily Habit Checklist", "");
w(table(["Habit", "What it means"], D.APT_HABITS.map(h => [h.name, h.detail])), "");

w("### 13-Week APT Progression", "");
D.APT_PROGRESSION.forEach(p => {
  w(`#### ${p.weeks} — ${p.phase}`, "");
  w(p.focus, "");
  w(bullets(p.do), "");
  w(`**Test:** ${p.testNow}`, "");
});

/* ----------------------------------------------------------- checkpoints */
w("## 11. Checkpoints & Troubleshooting", "");
w(table(["Day", "Date", "Checkpoint", "Target weight", "Target BF", "What to do"],
  D.CHECKPOINTS.map(c => [c.day, c.date, c.label, `${c.targetWeight} kg`, `${c.targetBf}%`, c.does])), "");
w("### When The Scale Stops Moving", "");
w(numbered(D.PLATEAU_RULES), "");

w("---", "");
w(`*${exCount} exercises across 7 days · ${optCount} meal options · ${D.PHASES.length} phases · ${D.PROGRAM.totalDays} days.*`, "");

const target = path.join(root, "PLAN.md");
fs.writeFileSync(target, out.join("\n").replace(/\n{3,}/g, "\n\n") + "\n");
console.log(`PLAN.md written: ${exCount} exercises, ${optCount} meal options, ${out.length} blocks, ${fs.statSync(target).size} bytes`);
