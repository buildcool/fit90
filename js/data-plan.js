/* ==========================================================================
   data-plan.js — the master 90-day program spine
   Phases, daily targets, supplements, cardio, checkpoints, body baseline.
   Everything else in the app reads its numbers from here.
   ========================================================================== */

const PROGRAM = {
  startDate: "2026-10-20",
  endDate: "2027-01-20",
  totalDays: 92,
  name: "90-Day Transformation & APT Correction",
  oneLiner:
    "Drop 80.0 kg / ~25% body fat to 68.2 kg / 12% body fat in 13 weeks while fixing Anterior Pelvic Tilt, on a pure-veg no-cook PG diet under ₹10,000/month.",
  bodyStart: { weight: 80.0, bf: 25.0, muscle: 32.0, bmi: 26.0, waist: 92 },
  bodyGoal: { weight: 68.2, bf: 12.0, muscle: 33.0, bmi: 22.2, waist: 79 },
  height: 175,
  rationale: [
    "11.8 kg in 92 days is 0.9 kg per week — aggressive but reachable because you held 64.2 kg at 13.1% BF in Apr 2025. Muscle memory means you regain strength and muscle far faster than a first-timer, so you can run a real deficit without losing the 32 kg of lean mass you already carry.",
    "Maintenance (TDEE) at 80 kg with a 2-hour lift and 8-10k steps is roughly 2,600-2,700 kcal. Eating 1,750-1,950 kcal leaves a 700-850 kcal deficit — that is the whole fat-loss engine. Training does not burn the fat; the deficit does. Training is what makes sure the weight you lose is fat and not muscle.",
    "Protein is set at 1.9-2.1 g per kg of bodyweight, which is the top of the useful range. On a pure-veg diet in a deficit this is the single hardest number to hit and the single most important one — miss it and you lose muscle instead of fat.",
    "APT is corrected on a parallel track: it is not a weight problem, it is a 'tight hip flexors + weak glutes + weak deep core from 8 hours of sitting' problem. Every single gym day carries a dedicated APT block, and two of the six days are built around it."
  ]
};

/* --------------------------------------------------------------------------
   13-week periodisation. Each phase changes sets, reps, RPE, rest and calories.
   -------------------------------------------------------------------------- */
const PHASES = [
  {
    id: "p1",
    name: "Phase 1 — Re-Activation",
    weeks: "Weeks 1-2",
    dayFrom: 1,
    dayTo: 14,
    goal: "Relearn every machine with perfect form, set your baseline weights, wake up the glutes and deep core.",
    prescription: { sets: 3, reps: "12-15", rpe: "6-7", restSec: 75, tempo: "2s up • 1s squeeze • 3s down" },
    loadRule: "Pick a weight you could do 4 more reps with. Write it down. This fortnight is for grooving the movement, not for ego.",
    kcal: 1950,
    protein: 150,
    carbs: 200,
    fat: 55,
    waterL: 3.5,
    cardio: "8,000 steps daily. No extra machine cardio yet — let your joints adapt to 6 lifting days first.",
    aptFocus: "Learn the posterior pelvic tuck. Supine pelvic tilts and deadbugs every single day, gym or not.",
    expect: "2.0-2.5 kg down, mostly water and glycogen in week 1. Do not panic when week 2 is slower."
  },
  {
    id: "p2",
    name: "Phase 2 — Build & Burn",
    weeks: "Weeks 3-6",
    dayFrom: 15,
    dayTo: 42,
    goal: "The main fat-loss block. Add a fourth set, push loads up weekly, add post-lift cardio.",
    prescription: { sets: 4, reps: "10-12", rpe: "8", restSec: 90, tempo: "1s up • 1s squeeze • 3s down" },
    loadRule: "Double progression: when you hit the top of the rep range on all 4 sets, add 2.5 kg (upper body) or 5 kg (lower body) next session.",
    kcal: 1850,
    protein: 155,
    carbs: 180,
    fat: 52,
    waterL: 3.5,
    cardio: "10,000 steps daily + 12 minutes easy cross-trainer or treadmill incline walk after each lift.",
    aptFocus: "Full Release → Stretch → Strengthen → Re-pattern protocol daily. Hip flexor stretch is now non-negotiable every night.",
    expect: "0.8-1.0 kg per week. Clothes change before the scale does — track your waist."
  },
  {
    id: "p3",
    name: "Phase 3 — Deload & Diet Break",
    weeks: "Week 7",
    dayFrom: 43,
    dayTo: 49,
    goal: "Planned recovery. This is not a week off — it is what lets Phase 4 work. Joints, CNS and hormones reset.",
    prescription: { sets: 2, reps: "12", rpe: "5-6", restSec: 90, tempo: "controlled" },
    loadRule: "Drop every weight to roughly 60% of what you used in week 6. It should feel almost too easy. That is the point.",
    kcal: 2150,
    protein: 150,
    carbs: 260,
    fat: 55,
    waterL: 3.5,
    cardio: "Keep steps at 10,000. Skip the post-lift cardio entirely this week.",
    aptFocus: "Mobility only — release and stretch work daily, lighter on the strengthening.",
    expect: "The scale may stall or tick up 0.5 kg from extra carbs/water. It is not fat. Phase 4 drops fast because of this week."
  },
  {
    id: "p4",
    name: "Phase 4 — Intensify",
    weeks: "Weeks 8-11",
    dayFrom: 50,
    dayTo: 77,
    goal: "Heaviest block. Lower reps, heavier loads, longer rest — this is what protects your muscle in a deep deficit.",
    prescription: { sets: 4, reps: "8-10", rpe: "8-9", restSec: 120, tempo: "1s up • 1s squeeze • 3s down" },
    loadRule: "Beat last week's logged number on the first set of every exercise, even by 1 rep. The app shows you what to beat.",
    kcal: 1800,
    protein: 160,
    carbs: 165,
    fat: 50,
    waterL: 4.0,
    cardio: "10,000 steps daily + 15 minutes post-lift cardio + the full 45-60 min evening walk.",
    aptFocus: "Load the correction — weighted hip thrusts and long-hold RKC planks. Your resting posture should visibly change in this block.",
    expect: "0.9-1.1 kg per week. Abs and the pelvic tilt both start showing around week 10."
  },
  {
    id: "p5",
    name: "Phase 5 — Peak & Reveal",
    weeks: "Weeks 12-13",
    dayFrom: 78,
    dayTo: 92,
    goal: "Final push to 68.2 kg and 12%. Hold strength, strip the last fat, lock the new posture in as default.",
    prescription: { sets: 4, reps: "6-8 + drop set on the last set", rpe: "9", restSec: 120, tempo: "1s up • 2s squeeze • 3s down" },
    loadRule: "Keep the loads of week 11 — do not chase PRs in the deepest deficit. On the final set, drop 30% and rep to failure.",
    kcal: 1750,
    protein: 165,
    carbs: 150,
    fat: 48,
    waterL: 4.0,
    cardio: "12,000 steps daily + 20 minutes post-lift cardio. This is where the last 2 kg comes from.",
    aptFocus: "Re-pattern only — the drills should now feel automatic. Re-shoot your standing side photo against week 1.",
    expect: "0.8-1.0 kg per week. Final check-in on day 92: 68.2 kg, 12% BF, neutral pelvis."
  }
];

/* Day number (1-92) -> phase object */
function getPhaseForDay(dayNum) {
  const d = Math.max(1, Math.min(PROGRAM.totalDays, dayNum));
  return PHASES.find(p => d >= p.dayFrom && d <= p.dayTo) || PHASES[PHASES.length - 1];
}

function getWeekForDay(dayNum) {
  return Math.floor((Math.max(1, dayNum) - 1) / 7) + 1;
}

/* Targets that the header stats and the diet view read. */
function getTargetsForDay(dayNum) {
  const p = getPhaseForDay(dayNum);
  return {
    kcal: p.kcal,
    protein: p.protein,
    carbs: p.carbs,
    fat: p.fat,
    waterL: p.waterL,
    dailyCostCap: Math.round(PROGRAM_BUDGET.monthlyCap / 30),
    phase: p
  };
}

/* The exact prescription for one exercise on one day. Exercise-level
   overrides (fixed holds, stretches, cardio) always win over the phase. */
function getPrescription(dayNum, exercise) {
  const p = getPhaseForDay(dayNum);
  if (exercise.fixed) {
    return {
      sets: exercise.sets,
      reps: exercise.reps,
      rpe: exercise.rpe || "—",
      restSec: exercise.restSec ?? 60,
      tempo: exercise.tempo || "controlled",
      phaseName: p.name,
      fixed: true
    };
  }
  const base = p.prescription;
  return {
    sets: exercise.setsOverride || base.sets,
    reps: exercise.repsOverride || base.reps,
    rpe: base.rpe,
    // An exercise's own restSec is a floor, not a cap: heavy compounds keep
    // their longer rest in the early phases, and everything lengthens as the
    // phases get heavier. Taking the override outright would freeze rest at
    // 90s for all 13 weeks and silently kill the phase progression.
    restSec: Math.max(exercise.restSec || 0, base.restSec),
    tempo: exercise.tempo || base.tempo,
    phaseName: p.name,
    fixed: false
  };
}

/* --------------------------------------------------------------------------
   Budget
   -------------------------------------------------------------------------- */
const PROGRAM_BUDGET = {
  monthlyCap: 10000,
  breakdown: [
    { item: "PG rent-included meals (lunch + dinner base)", monthly: 0, note: "Already paid in your PG rent — this is why the plan is built around it." },
    { item: "Whey protein isolate (2 kg ≈ 66 scoops)", monthly: 3200, note: "Biggest single line. 2 scoops/day average." },
    { item: "Paneer (fresh, ~200 g x 15 days)", monthly: 1500, note: "₹100 per 200 g block." },
    { item: "Greek yogurt / curd", monthly: 900, note: "Epigamia 200 g or PG curd." },
    { item: "Oats, peanut butter, brown bread", monthly: 1100, note: "Breakfast staples." },
    { item: "Roasted chana, peanuts, almonds, walnuts, pumpkin seeds", monthly: 900, note: "Desk snacks — buy 1 kg at a time." },
    { item: "Soya chunks, moong/chana for sprouting", monthly: 350, note: "Cheapest protein per rupee in the whole plan." },
    { item: "Fruit (bananas, apples)", monthly: 700, note: "~1 banana + 1 apple daily." },
    { item: "Creatine, D3, B12, omega-3", monthly: 800, note: "Amortised — creatine 250 g tub lasts 50 days." },
    { item: "Coffee, green tea, spices, black salt", monthly: 300, note: "One-time-ish." }
  ],
  get monthlyEstimate() {
    return this.breakdown.reduce((s, b) => s + b.monthly, 0);
  }
};

/* --------------------------------------------------------------------------
   Supplements — what, how much, when, and why (pure-veg specific)
   -------------------------------------------------------------------------- */
const SUPPLEMENTS = [
  {
    name: "Whey Protein Isolate",
    dose: "1-2 scoops (25-50 g protein)",
    when: "1 scoop immediately post-workout (7:00 AM). 2nd scoop wherever the day's protein falls short — usually pre-bed.",
    why: "You need 150-165 g protein daily on a pure-veg diet. Food alone gets you to about 110 g without cooking. Whey closes the gap. It is a supplement in the literal sense — it supplements, it does not replace meals.",
    nonNegotiable: true
  },
  {
    name: "Creatine Monohydrate",
    dose: "5 g, every single day",
    when: "Any time — pick a fixed anchor so you never forget. Stir into your post-workout shake.",
    why: "The most studied supplement that exists. Adds 5-10% strength, which in a deficit is the difference between holding muscle and losing it. Take it on rest days too — it works by saturating your muscles over weeks, not by giving you a pre-workout kick. No loading phase needed.",
    nonNegotiable: true
  },
  {
    name: "Vitamin B12",
    dose: "500-1000 mcg",
    when: "With breakfast, daily (or 2500 mcg once weekly).",
    why: "B12 exists almost exclusively in animal foods. On pure veg you WILL become deficient without it, and deficiency means fatigue, nerve problems and stalled recovery. This is the single most important supplement for a vegetarian — more important than whey.",
    nonNegotiable: true
  },
  {
    name: "Vitamin D3",
    dose: "2000 IU",
    when: "With a meal containing fat — your peanut butter breakfast or almond snack.",
    why: "You are indoors coding from 9 to 5. Low D3 suppresses testosterone, mood and recovery. Fat-soluble, so it needs to ride along with dietary fat to absorb.",
    nonNegotiable: true
  },
  {
    name: "Algal Omega-3 (DHA + EPA)",
    dose: "500 mg combined DHA+EPA",
    when: "With lunch.",
    why: "Flax and walnuts give you ALA, which converts to usable DHA/EPA at only about 5%. Algal oil is the vegetarian source of the real thing — it manages inflammation from 6 training days a week and protects joint health.",
    nonNegotiable: false
  },
  {
    name: "Caffeine (black coffee)",
    dose: "150-200 mg — 1-2 cups",
    when: "4:45 AM pre-gym, and the 5:00 PM block if you need it. Never after 6:00 PM.",
    why: "Free performance in a deficit, and it blunts appetite. Hard cut-off at 6 PM — caffeine has a 6-hour half-life and your 10 PM sleep is load-bearing for the whole plan.",
    nonNegotiable: false
  },
  {
    name: "Multivitamin",
    dose: "1 tablet",
    when: "With lunch.",
    why: "Cheap insurance for iron, zinc and selenium, which run low on no-cook vegetarian eating. Optional if your diet is dialled in, but at ₹150/month it is not worth the risk.",
    nonNegotiable: false
  }
];

/* --------------------------------------------------------------------------
   Cardio & step protocol
   -------------------------------------------------------------------------- */
const CARDIO_PROTOCOL = {
  principle:
    "Steps are the fat-loss tool; machine cardio is a top-up. 10,000 steps burns roughly 400 kcal a day without touching your recovery. Never replace lifting with cardio in a deficit — lifting is what tells your body to keep the muscle.",
  daily: [
    { what: "Morning gym commute walk", when: "4:45 AM / 7:05 AM", detail: "Walk to and from the gym if it is under 2 km. Free 2,000 steps." },
    { what: "Desk-break walks", when: "Every 45 min, 9 AM - 5 PM", detail: "60-second stand, 20-step walk, 10-second glute squeeze. Doubles as your APT desk reset." },
    { what: "Post-lift cardio", when: "6:45 AM", detail: "Phase 1: none. Phase 2: 12 min. Phase 4: 15 min. Phase 5: 20 min. Treadmill at 5-6 km/h with 8-10% incline, or cross-trainer. Keep it conversational — you should be able to talk." },
    { what: "Evening brisk walk", when: "6:00 PM - 8:00 PM", detail: "45-60 min outdoors at a pace where talking is slightly awkward. This is the single biggest non-gym fat-loss lever you have. Podcast or upskilling audio makes it painless." }
  ],
  stepTargets: [
    { phase: "Weeks 1-2", steps: "8,000" },
    { phase: "Weeks 3-11", steps: "10,000" },
    { phase: "Weeks 12-13", steps: "12,000" }
  ],
  warning:
    "If your resting heart rate climbs 8+ bpm for three mornings in a row, or your lifting numbers drop two sessions running, you are under-recovered. Cut the post-lift cardio first, not the lifting, and not the protein."
};

/* --------------------------------------------------------------------------
   Sleep & recovery protocol
   -------------------------------------------------------------------------- */
const RECOVERY_PROTOCOL = {
  sleepWindow: "10:00 PM - 5:00 AM (7 hours)",
  rules: [
    "7 hours is the floor, not the target. Under 6 hours and your body preferentially burns muscle instead of fat in a deficit — it is that direct. Sleep is a training variable.",
    "No caffeine after 6:00 PM. Half of a 4 PM coffee is still in your blood at 10 PM.",
    "Screens off or warm-shifted from 9:30 PM. Your wind-down block is already carved out — use it for the hip flexor stretch, not for scrolling.",
    "Sleep on your back or side with a pillow under the knees (back) or between the knees (side). Sleeping face-down pulls your lumbar into extension for 7 hours and actively undoes the APT work.",
    "Room dark and cool. If you sleep 7 hours but wake unrested, fix light and temperature before blaming the training."
  ],
  restDay: "Day 7 (Sunday) is active recovery, not nothing. 30-45 min easy walk, the full APT mobility circuit, and your weekly check-in. You grow on this day."
};

/* --------------------------------------------------------------------------
   Fortnightly checkpoints
   -------------------------------------------------------------------------- */
const CHECKPOINTS = [
  { day: 1,  date: "Oct 20, 2026", label: "Baseline",   targetWeight: 80.0, targetBf: 25.0, does: "Weigh in, measure waist at navel, shoot a side-on photo in the same light, run all 4 APT self-tests, log your starting weight on every machine." },
  { day: 14, date: "Nov 02, 2026", label: "Week 2",     targetWeight: 77.8, targetBf: 23.8, does: "Weight, waist, photo. Confirm every machine's baseline load is written down." },
  { day: 28, date: "Nov 16, 2026", label: "Week 4",     targetWeight: 76.0, targetBf: 22.2, does: "Weight, waist, photo, APT re-test. First real posture change should be measurable here." },
  { day: 42, date: "Nov 30, 2026", label: "Week 6",     targetWeight: 74.2, targetBf: 20.3, does: "Weight, waist, photo. Deload starts tomorrow — record your top loads for the 60% calculation." },
  { day: 49, date: "Dec 07, 2026", label: "Post-deload", targetWeight: 73.8, targetBf: 19.6, does: "Expect a flat or slightly up scale. Check waist instead — it should still be shrinking." },
  { day: 63, date: "Dec 21, 2026", label: "Week 9",     targetWeight: 72.0, targetBf: 17.4, does: "Weight, waist, photo, APT re-test. Abs starting to show in the photo." },
  { day: 77, date: "Jan 04, 2027", label: "Week 11",    targetWeight: 70.1, targetBf: 14.8, does: "Weight, waist, photo. Final push block starts — lock loads, do not chase PRs." },
  { day: 92, date: "Jan 20, 2027", label: "Final",      targetWeight: 68.2, targetBf: 12.0, does: "Full re-test: weight, BF, waist, all 4 APT tests, side-by-side photo against day 1. Then set the next 90 days." }
];

/* What to do when the scale stops moving. */
const PLATEAU_RULES = [
  "A stall is only a stall after 10 days of a flat weekly average — not after one bad morning. Weigh daily, judge the 7-day average.",
  "First, audit honesty: are you actually hitting the kcal and protein numbers, including weekend PG meals and the oil in them? 9 times out of 10 the plan is not broken, the logging is.",
  "Second, add 1,500 steps a day before you cut any food. Movement is cheaper than hunger.",
  "Third, if still flat after 10 more days, cut 100 kcal from carbs only. Never cut protein, never cut below 1,600 kcal on this plan.",
  "Never stack cuts. One change, 10 days, re-measure."
];
