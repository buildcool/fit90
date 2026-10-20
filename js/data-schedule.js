/* ==========================================================================
   data-schedule.js — the hour-by-hour day
   Two variants: a gym day (Mon-Sat) and the Sunday active-recovery day.
   Every block says what to do, not just where to be.
   ========================================================================== */

const SCHEDULE_GYM = [
  {
    id: "s0", time: "4:45 AM - 5:00 AM", dur: "15 min", title: "Wake & Prime", icon: "⏰",
    detail: "Alarm across the room. 500 ml water the moment you stand — you wake up dehydrated and it is the cheapest performance gain of the day. Black coffee. Gym clothes laid out the night before so there is no decision to make at 4:45 AM.",
    steps: [
      "500 ml plain water, finished before you leave the room",
      "Black coffee (150-200 mg caffeine)",
      "Creatine 5 g stirred into water — anchor it here so you never miss it",
      "Leave. Do not sit down. Sitting at 4:50 AM ends the workout."
    ],
    tag: "prep"
  },
  {
    id: "s1", time: "5:00 AM - 7:00 AM", dur: "2 hours", title: "Cult Gym — Full Session", icon: "🏋️",
    detail: "Warm-up → main lifts → accessories → APT correction block → cardio finisher → cool-down. The exact exercises, machines, sets and rest are in the Gym tab for today's split.",
    steps: [
      "0:00-0:10 — Warm-up (specific to today's split, never generic)",
      "0:10-1:15 — Main lifts and accessories, logging every set's weight",
      "1:15-1:35 — APT correction block (this is the part people skip — do not)",
      "1:35-1:50 — Cardio finisher (phase-dependent, zero in weeks 1-2)",
      "1:50-2:00 — Cool-down stretches, hip flexors last and longest"
    ],
    tag: "train"
  },
  {
    id: "s2", time: "7:00 AM - 8:00 AM", dur: "1 hour", title: "Shake, Shower & Breakfast", icon: "🥤",
    detail: "Whey within 30 minutes of the last set, then shower, then a proper no-cook high-protein breakfast. B12 and D3 ride along with this meal.",
    steps: [
      "7:00 — 1 scoop whey isolate in water, immediately",
      "7:10 — Shower and get ready",
      "7:30 — Breakfast (your chosen option from the Diet tab) + B12 + D3 with the fat in the meal",
      "7:55 — Refill your bottle. Target 1 L finished before 1 PM."
    ],
    tag: "eat"
  },
  {
    id: "s3", time: "8:00 AM - 9:00 AM", dur: "1 hour", title: "Commute / Morning Planning", icon: "🚇",
    detail: "Stand on the commute if you can — you are about to sit for 8 hours and that is the actual cause of your APT. Plan the day's engineering work so the 9 AM block starts with zero thinking.",
    steps: [
      "Stand rather than sit wherever possible",
      "If you are already seated: sit on your sit-bones with both feet flat, ribs stacked over pelvis, not slumped into a tailbone tuck",
      "Write down your 3 engineering outcomes for the day"
    ],
    tag: "work"
  },
  {
    id: "s4", time: "9:00 AM - 1:00 PM", dur: "4 hours", title: "Deep Engineering Block", icon: "💻",
    detail: "Your highest-value work, and simultaneously the biggest threat to your posture. The 45-minute desk reset is not optional — it is the difference between the gym work holding and being undone daily.",
    steps: [
      "Every 45 min: stand up, 60-second hip-flexor-opening stand with a 10-second glute squeeze, 20 steps. Set a repeating timer.",
      "Chair rules: hips slightly above knees, both feet flat, lumbar supported, screen at eye height so your neck is not pulling your ribs forward",
      "11:00 AM — mid-morning meal from the Diet tab",
      "Finish 1 L of water across this block"
    ],
    tag: "work"
  },
  {
    id: "s5", time: "1:00 PM - 2:00 PM", dur: "1 hour", title: "Lunch — Biggest Protein Hit", icon: "🥗",
    detail: "The PG meal is the base; the protein you add on top is what makes it work. Skip the oily gravy, load the paneer or soya. Walk 10 minutes after eating.",
    steps: [
      "PG dal/sabzi/roti — take the solids, leave the oil floating on top",
      "Add your protein anchor: 50 g raw paneer, or hot-water soya chunks, or a thick curd bowl",
      "Multivitamin + algal omega-3 with this meal",
      "10-minute walk after eating — blunts the post-lunch crash and adds 1,200 steps"
    ],
    tag: "eat"
  },
  {
    id: "s6", time: "2:00 PM - 5:00 PM", dur: "3 hours", title: "Afternoon Engineering Sessions", icon: "⌨️",
    detail: "Same 45-minute desk reset discipline. This is the block where posture quietly collapses because you are tired and deep in a problem.",
    steps: [
      "Every 45 min: stand, glute squeeze, 20 steps — no exceptions",
      "Keep ribs stacked over pelvis. If your lower back starts aching, that is APT talking, not a chair problem",
      "Finish another 1 L of water"
    ],
    tag: "work"
  },
  {
    id: "s7", time: "5:00 PM - 6:00 PM", dur: "1 hour", title: "Evening Fuel", icon: "☕",
    detail: "A real meal, not a snack — it is what stops you from demolishing dinner. Last caffeine of the day if you are having any.",
    steps: [
      "Your chosen Evening Fuel option from the Diet tab",
      "Last possible caffeine — nothing after 6:00 PM",
      "Change into walking shoes now, before you sit down again"
    ],
    tag: "eat"
  },
  {
    id: "s8", time: "6:00 PM - 8:00 PM", dur: "2 hours", title: "Brisk Walk + Personal Projects", icon: "🚶",
    detail: "45-60 minutes of brisk outdoor walking to close out your step target — the biggest non-gym fat-loss lever in the whole plan — then personal upskilling.",
    steps: [
      "45-60 min brisk walk, pace where talking is slightly awkward",
      "Audio podcast or course so the time doubles up",
      "Check your step count against the phase target (8k → 10k → 12k)",
      "Remaining time: personal projects and upskilling"
    ],
    tag: "move"
  },
  {
    id: "s9", time: "8:00 PM - 9:00 PM", dur: "1 hour", title: "Light Dinner", icon: "🍽️",
    detail: "Lowest-carb meal of the day, protein-forward. Half portion of PG carbs, big volume of salad so you finish full on few calories.",
    steps: [
      "Half portion of PG rice or 1-2 rotis — the deficit is won or lost here",
      "Protein anchor: whey, paneer or sprouts",
      "Large raw salad for volume — cucumber, tomato, onion, lemon",
      "Stop eating by 9:00 PM so digestion does not fight your sleep"
    ],
    tag: "eat"
  },
  {
    id: "s10", time: "9:00 PM - 10:00 PM", dur: "1 hour", title: "APT Night Routine & Wind Down", icon: "🧘",
    detail: "The 10-minute hip flexor and mobility routine, done every single night including rest days. Eight hours of sitting shortened your hip flexors today; this is where you give that back. Then prep tomorrow so 4:45 AM is frictionless.",
    steps: [
      "Full APT night circuit from the APT tab — 10 minutes, every night, no exceptions",
      "Half-kneeling hip flexor stretch: 60 seconds per side, tailbone tucked FIRST",
      "Prep tomorrow: soak sprouts or soya, lay out gym clothes, fill the bottle",
      "Screens warm-shifted or off from 9:30 PM"
    ],
    tag: "apt"
  },
  {
    id: "s11", time: "10:00 PM - 5:00 AM", dur: "7 hours", title: "Deep Recovery Sleep", icon: "😴",
    detail: "Non-negotiable. Under 6 hours and your body burns muscle instead of fat in a deficit — it undoes the training directly. Back or side sleeping only.",
    steps: [
      "Lights out by 10:00 PM",
      "On your back with a pillow under the knees, or on your side with a pillow between them",
      "Never face-down — that holds your lumbar extended for 7 hours and feeds the APT",
      "Dark, cool room"
    ],
    tag: "sleep"
  }
];

const SCHEDULE_REST = [
  {
    id: "r0", time: "6:30 AM - 7:00 AM", dur: "30 min", title: "Sleep In, Then Hydrate", icon: "⏰",
    detail: "The one morning you do not set a 4:45 alarm. Still get up within 90 minutes of your weekday time so Monday is not a wreck.",
    steps: ["500 ml water on waking", "Creatine 5 g — yes, on rest days too", "Coffee if you want it"],
    tag: "prep"
  },
  {
    id: "r1", time: "7:00 AM - 7:45 AM", dur: "45 min", title: "Weekly Check-In", icon: "📊",
    detail: "Measure before you eat, in the same clothes and the same light as last week. This is the data the whole plan steers by.",
    steps: [
      "Weigh in — log it in the Stats tab",
      "Waist at navel, relaxed, measured on exhale",
      "Side-on photo in the same spot and light",
      "Every 2 weeks: run all 4 APT self-tests from the APT tab and log the results",
      "Review the week's logged lifts — which numbers went up?"
    ],
    tag: "check"
  },
  {
    id: "r2", time: "7:45 AM - 8:30 AM", dur: "45 min", title: "Breakfast + Full APT Mobility Circuit", icon: "🧘",
    detail: "The one day you run the complete release-and-stretch circuit unhurried, both sides, full hold times.",
    steps: ["Normal breakfast option + B12 + D3", "Full APT mobility circuit, long holds — roughly 20 minutes", "No strengthening work today, mobility only"],
    tag: "apt"
  },
  {
    id: "r3", time: "9:00 AM - 10:00 AM", dur: "1 hour", title: "Easy Recovery Walk", icon: "🚶",
    detail: "30-45 minutes at an easy, conversational pace. Blood flow for recovery, not a workout. No incline, no intervals, no lifting.",
    steps: ["30-45 min easy outdoor walk", "Conversational pace throughout", "Target 6,000-8,000 steps across the whole day"],
    tag: "move"
  },
  {
    id: "r4", time: "10:00 AM - 1:00 PM", dur: "3 hours", title: "Life Admin & Food Prep", icon: "🛒",
    detail: "The hour that makes the other six days possible. Buy the week's groceries from the list in the Diet tab and set up what needs soaking.",
    steps: [
      "Grocery run against the weekly list in the Diet tab",
      "Portion the roasted chana, peanuts and nuts into 6 daily bags",
      "Start the week's sprouting — soak moong/chana overnight, rinse daily",
      "Check the month's spend against the ₹10,000 cap"
    ],
    tag: "prep"
  },
  {
    id: "r5", time: "1:00 PM - 2:00 PM", dur: "1 hour", title: "Lunch — Normal Protein Target", icon: "🥗",
    detail: "Rest day does not mean diet day off. Protein stays at the phase target; your muscle is rebuilding today, which is precisely when it needs the material.",
    steps: ["Full normal lunch from the Diet tab", "Same protein anchor as a training day", "Multivitamin + omega-3"],
    tag: "eat"
  },
  {
    id: "r6", time: "2:00 PM - 8:00 PM", dur: "6 hours", title: "Genuine Rest", icon: "🛋️",
    detail: "Deliberately unstructured. Recovery is when adaptation actually happens — training is only the signal. Normal evening snack and dinner at the usual times.",
    steps: [
      "No training, no 'light session', no 'just a few sets'",
      "Still break up long sitting every 45 min — the desk reset applies to the sofa too",
      "5:00 PM evening fuel, 8:00 PM light dinner as usual"
    ],
    tag: "rest"
  },
  {
    id: "r7", time: "9:00 PM - 10:00 PM", dur: "1 hour", title: "Night Routine & Week Prep", icon: "🌙",
    detail: "Same night APT circuit as every other day, then set up Monday so the 4:45 AM alarm has nothing to argue with.",
    steps: [
      "Full APT night circuit — 10 minutes",
      "Lay out Monday's gym clothes, fill the bottle, soak tomorrow's sprouts",
      "Look at Monday's split in the Gym tab so you walk in knowing the plan",
      "Lights out 10:00 PM"
    ],
    tag: "apt"
  }
];

/* Mon-Sat are gym days (JS getDay: 1-6), Sunday (0) is active recovery. */
function getScheduleForDate(dateStr) {
  const dow = new Date(dateStr + "T00:00:00").getDay();
  return dow === 0 ? SCHEDULE_REST : SCHEDULE_GYM;
}

const SCHEDULE_TAG_STYLE = {
  prep:  { label: "Prep",     color: "slate" },
  train: { label: "Training", color: "emerald" },
  eat:   { label: "Nutrition", color: "amber" },
  work:  { label: "Work",     color: "blue" },
  move:  { label: "Cardio",   color: "cyan" },
  apt:   { label: "APT Fix",  color: "purple" },
  sleep: { label: "Recovery", color: "indigo" },
  rest:  { label: "Rest",     color: "indigo" },
  check: { label: "Check-In", color: "pink" }
};
