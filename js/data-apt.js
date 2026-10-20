/* ==========================================================================
   data-apt.js — the Anterior Pelvic Tilt correction program

   APT is not a weight problem and losing 12 kg will not fix it on its own.
   It is a pattern problem: tight hip flexors and lumbar erectors pulling the
   front of the pelvis down, weak glutes and deep core failing to pull it back
   up. 8 hours of sitting builds it; this program unbuilds it.

   Order matters and is the same every time:
       1 RELEASE  -> 2 STRETCH -> 3 STRENGTHEN -> 4 RE-PATTERN
   You cannot strengthen a muscle into a position a tight muscle will not let
   it reach, and you cannot hold a position your brain does not default to.
   ========================================================================== */

const APT_EXPLAINER = {
  what:
    "Anterior Pelvic Tilt is your pelvis rotating forward and down at the front, like a bucket of water tipping and spilling out over your toes. Because your pelvis is the base your spine sits on, when it tips forward your lower back has to arch harder to keep you upright. That arch is what you see from the side, and what you feel as a stiff, achy lower back by 4 PM.",
  whyYou: [
    "You sit for about 8 hours a day writing software. In a chair your hip flexors — mainly the psoas, which runs from your lumbar spine over the front of your hip to your thigh — are held at roughly half their length all day. Muscles adapt to the position you keep them in, so over years they shorten and their resting tone goes up.",
    "At the same time your glutes do nothing for those 8 hours. They are sat on, not used. Muscles that are never asked to work become weak and, worse, your nervous system stops recruiting them properly — so even when you do stand up, your lower back does the job your glutes should be doing.",
    "Your deep core, the muscles that hold your ribcage stacked over your pelvis, also switches off in a slumped chair. In APT your ribs flare upward while your pelvis tips forward, which leaves your lumbar spine squeezed between them in a permanent arch.",
    "Then you train — and overhead presses, shoulder presses, lat pulldowns and tricep extensions all tempt you to arch your lower back to move more weight. Without deliberate cueing, the gym makes APT worse rather than better. That is why every exercise in this plan carries its own APT cue."
  ],
  consequences: [
    "Lower back ache that arrives in the afternoon and eases when you lie down",
    "A stomach that looks like it sticks out even once your body fat is low — the pelvis is tipping your abdomen forward, not fat",
    "Glutes that look flat from the side regardless of training",
    "Hip pinching at the bottom of squats and leg presses",
    "Hamstrings that feel permanently tight because the tilt holds them lengthened all day",
    "The thing most people miss: at 68 kg with a 12% body fat and an uncorrected tilt, you will still not look lean from the side. Posture is roughly half of how lean you appear."
  ],
  timeline: [
    { week: "Weeks 1-2", what: "You learn what neutral feels like. Nothing visible changes yet. The wall test gap starts to close slightly." },
    { week: "Weeks 3-6", what: "Hip flexors genuinely begin to lengthen. Glutes start firing on their own in daily movement. Lower back ache reduces noticeably." },
    { week: "Week 7", what: "Deload. Mobility only. Things often feel best this week, which tells you fatigue was masking progress." },
    { week: "Weeks 8-11", what: "The biggest visible change. Loaded hip thrusts and long RKC planks make the corrected position strong enough to hold all day without thinking." },
    { week: "Weeks 12-13", what: "The new posture becomes your default. Side-on photos against week 1 show the difference clearly — this is the part that surprises people." }
  ]
};

/* --------------------------------------------------------------------------
   Self-assessment — run on week 1, then every 2 weeks
   -------------------------------------------------------------------------- */
const APT_TESTS = [
  {
    id: "t1",
    name: "Wall Test",
    freq: "Every 2 weeks",
    equipment: "A flat wall",
    how: [
      "Stand with your heels about 10 cm from a wall.",
      "Put your head, shoulder blades and glutes all in contact with the wall. Stand the way you normally stand — do not correct yourself.",
      "Slide one flat hand into the gap between your lower back and the wall."
    ],
    reading: [
      { result: "Hand slides in snugly, barely any room", verdict: "Neutral pelvis. This is the target.", good: true },
      { result: "Hand slides in with room to spare", verdict: "Mild to moderate APT.", good: false },
      { result: "You can fit a whole fist, or your hand plus a gap", verdict: "Significant APT — this is most likely your week-1 result.", good: false }
    ],
    log: "Record it as fingers of gap: 'snug', '1 hand', '1 hand + gap', or 'fist'.",
    why: "The single most useful test because it is objective, repeatable and takes five seconds. The gap closing fortnight by fortnight is your clearest evidence the program is working."
  },
  {
    id: "t2",
    name: "Thomas Test",
    freq: "Every 2 weeks",
    equipment: "A bed or bench edge",
    how: [
      "Sit on the very edge of a bed or bench, right at the end.",
      "Lie back while pulling both knees to your chest.",
      "Keep the left knee hugged to your chest and let the right leg hang down freely, completely relaxed.",
      "Look at where the hanging thigh and shin end up. Then swap sides."
    ],
    reading: [
      { result: "Back of the thigh rests flat on the bench and the shin hangs at about 80 degrees", verdict: "Normal hip flexor length.", good: true },
      { result: "Thigh floats up off the bench", verdict: "Tight psoas / iliacus — the main APT driver.", good: false },
      { result: "Thigh rests but the shin kicks forward toward straight", verdict: "Tight rectus femoris — this is why the couch stretch with a bent knee is in the program.", good: false }
    ],
    log: "Record per side: 'thigh flat', 'thigh raised', or 'shin kicks out'.",
    why: "This tells you which structure is actually tight, so you know whether to prioritise the half-kneeling stretch (psoas) or the couch stretch (rectus femoris)."
  },
  {
    id: "t3",
    name: "ASIS / Pubic Bone Landmark Test",
    freq: "Every 2 weeks",
    equipment: "Nothing, plus a mirror",
    how: [
      "Stand relaxed and side-on to a mirror.",
      "Find the bony point at the front of each hip — the ASIS. Place your index fingers on them.",
      "Place your thumbs on your pubic bone at the front centre of your pelvis.",
      "Your hands now make a triangle. Look at whether that triangle is vertical."
    ],
    reading: [
      { result: "The triangle is roughly vertical — fingers directly above thumbs", verdict: "Neutral pelvis.", good: true },
      { result: "Fingers sit clearly in front of your thumbs", verdict: "Anterior pelvic tilt, and the bigger the horizontal gap the bigger the tilt.", good: false }
    ],
    log: "Record as the rough forward distance: 'vertical', '2 cm forward', '4 cm forward'.",
    why: "The most direct measurement of the pelvis itself, since it reads bone landmarks rather than inferring from your back. Worth learning because you can run it anywhere in ten seconds."
  },
  {
    id: "t4",
    name: "Standing Side Photo",
    freq: "Weekly (photo), compared every 2 weeks",
    equipment: "Phone, a plain wall, consistent light",
    how: [
      "Set your phone at hip height about 2 m away, strictly side-on.",
      "Stand relaxed in your natural posture, arms by your sides, minimal clothing.",
      "Take the photo without correcting your posture. This is critical — fixing your stance for the camera destroys the only objective record you have.",
      "Same spot, same light, same time of day, every week."
    ],
    reading: [
      { result: "Ribs stacked over pelvis, flat-ish lower back, glutes sitting under the torso", verdict: "Neutral.", good: true },
      { result: "Visible lumbar curve, belly pushed forward, glutes pushed back", verdict: "APT visible from the side.", good: false }
    ],
    log: "Keep the photos in a dated album. Compare week 1 against the current week.",
    why: "Posture changes far too slowly to notice day to day. Two photos eight weeks apart make a change obvious that you genuinely cannot see in the mirror each morning."
  }
];

/* --------------------------------------------------------------------------
   The four-step protocol
   -------------------------------------------------------------------------- */
const APT_PROTOCOL = [
  {
    step: 1,
    name: "Release",
    color: "amber",
    goal: "Lower the resting tone of the tight structures so the stretch that follows can actually work.",
    detail:
      "Releasing does not permanently lengthen anything — anyone who tells you five minutes of foam rolling changed their muscle length is mistaken. What it does do is reduce the protective tone in an overworked muscle for the next 20-30 minutes, which is a window where stretching is far more effective. That is the only reason it comes first.",
    drills: [
      { name: "Foam roll quads & hip flexors", dose: "90-120 sec per side", cue: "Slow. Stop on tender spots and breathe out for 20-30 seconds until they ease.", when: "Day 4, Day 7, and any day your hips feel locked" },
      { name: "Foam roll glutes", dose: "90 sec per side", cue: "Sit on the roller with one ankle crossed over the opposite knee.", when: "Day 7" },
      { name: "Foam roll mid & upper back", dose: "60 sec", cue: "Never roll directly on your lower spine — in APT those erectors are already short and irritable, and grinding them makes them guard harder.", when: "Day 2, Day 7" }
    ]
  },
  {
    step: 2,
    name: "Stretch",
    color: "cyan",
    goal: "Lengthen the hip flexors and quads that are physically holding the front of your pelvis down.",
    detail:
      "The single most important technical point in this entire program: tuck your tailbone FIRST, squeeze the glute of the stretching side, and only then move. If you lean forward with an arched lower back you will feel a strong pull, but it is your lumbar spine compressing, not your psoas lengthening — and it actively makes the tilt worse. A correctly performed hip flexor stretch has a very small range of motion. If you can lunge a long way forward, your pelvis is not tucked.",
    drills: [
      { name: "Half-kneeling hip flexor stretch", dose: "60 sec x 2-3 per side, daily", cue: "Tuck tailbone → squeeze kneeling-side glute → shift forward 2 inches. In that order, every time.", when: "Every single day, gym or not" },
      { name: "Couch stretch", dose: "60 sec x 2 per side", cue: "Rear shin flat against a bench so the knee bends fully — this adds the rectus femoris. Build up to an upright torso over weeks.", when: "Day 4, Day 6" },
      { name: "Standing quad stretch", dose: "45 sec per side", cue: "Tuck the tailbone before you pull the heel in, or you will just arch and feel nothing useful.", when: "Day 3, Day 6" },
      { name: "Seated hamstring stretch", dose: "45 sec per side", cue: "Hinge from the hip with a flat back. Gently — in APT hamstrings are long-and-tight, not short-and-tight, so they need strengthening more than stretching.", when: "Day 3, Day 4, Day 6, Day 7" }
    ]
  },
  {
    step: 3,
    name: "Strengthen",
    color: "emerald",
    goal: "Build the glutes, hamstrings and deep core strong enough to hold the pelvis in neutral for 16 waking hours.",
    detail:
      "This is the half people skip, and it is why stretching alone never fixes APT. Stretching creates the room for a neutral pelvis; only strength holds it there. Your glutes pull the back of the pelvis down, your hamstrings assist, and your deep core keeps your ribs stacked over the top. All three have been switched off by years of sitting and need to be trained deliberately, not just used incidentally.",
    drills: [
      { name: "Hip thrust", dose: "3-4 x 12-15, loaded and progressive", cue: "Chin tucked, ribs down, stop at the straight line. Add weight every week — this is the strongest glute builder you have.", when: "Day 2, Day 4, Day 6" },
      { name: "Glute bridge", dose: "3 x 15-20 with a 2 sec hold", cue: "Flatten the lower back first, then lift from the glutes only.", when: "Day 1, Day 3, Day 5" },
      { name: "RKC plank", dose: "3-4 x 45-60 sec of maximum tension", cue: "Tailbone tucked hard, glutes and quads at 100%, elbows pulling toward toes. If you can hold 2 minutes you are not squeezing hard enough.", when: "Day 2, Day 4, Day 5" },
      { name: "Deadbug", dose: "3-4 x 12 per side", cue: "Lower back crushed flat into the floor. If it lifts a centimetre, shorten the range.", when: "Day 1, Day 3, Day 4, Day 5" },
      { name: "Bird dog", dose: "3 x 10 per side", cue: "Leg never goes above hip height — higher only comes from arching.", when: "Day 2" },
      { name: "Reverse crunch", dose: "3 x 15", cue: "Roll the pelvis back; do not swing the legs. This is the literal opposite of a sit-up, which trains the hip flexors you are trying to calm down.", when: "Day 4" },
      { name: "Side plank", dose: "3 x 40 sec per side", cue: "Squeeze the bottom glute. Trains obliques and glute medius together to keep the pelvis level side to side.", when: "Day 4" },
      { name: "Romanian deadlift", dose: "3-4 x 10-12, loaded", cue: "The best hamstring and glute builder in the plan. Strong hamstrings pull the back of the pelvis down into neutral.", when: "Day 3, Day 6" },
      { name: "Hip abduction", dose: "3 x 15-20", cue: "Glute medius stops the pelvis dropping and rotating when you walk.", when: "Day 3, Day 6" }
    ]
  },
  {
    step: 4,
    name: "Re-pattern",
    color: "purple",
    goal: "Make the corrected position your unconscious default, so the other 23 hours stop undoing the one hour of work.",
    detail:
      "The step that decides whether any of this holds. You could have perfectly mobile hips and strong glutes and still stand in a tilt, because posture is a habit your nervous system runs without asking you. Twenty minutes of drills cannot beat sixteen hours of default. So every APT session ends by walking away still holding the position, and the desk resets through the day are what turn that into your new normal.",
    drills: [
      { name: "90/90 breathing", dose: "3 x 5 breaths, 4 sec in / 8 sec out", cue: "The long exhale physically pulls your ribcage down over your pelvis. If you only ever did one drill, this would be it.", when: "Day 4, Day 6, Day 7, and any evening you feel locked up" },
      { name: "Cat-camel", dose: "2 x 10-12 slow", cue: "Spend longer at the rounded, tailbone-tucked end — that is the end of the range your body has forgotten.", when: "Day 4, Day 7" },
      { name: "Standing wall posture reset", dose: "3 x 45 sec + 10 steps", cue: "The 10 steps after you leave the wall are the actual exercise. A hold followed by an immediate slump teaches nothing.", when: "Day 4, Day 7, and once at your desk daily" },
      { name: "Supine pelvic tilt", dose: "3 x 15 with 3 sec holds", cue: "Memorise the sensation, then replicate about 30% of that tuck whenever you stand or walk.", when: "Day 1, Day 3, Day 6, and daily at home" },
      { name: "Desk reset", dose: "60 sec every 45 min, 9 AM - 5 PM", cue: "Stand, 10 sec glute squeeze, 20 steps. Set a repeating timer — you will not remember on your own.", when: "Every working hour of every working day" }
    ]
  }
];

/* --------------------------------------------------------------------------
   Daily non-gym routines — this is where APT is actually won
   -------------------------------------------------------------------------- */
const APT_DAILY = [
  {
    id: "am", name: "Morning Reset", time: "On waking", dur: "5 min",
    intro: "You have just spent 7 hours still. Five minutes here sets your pelvis up for the day.",
    items: [
      { name: "Supine pelvic tilt", dose: "15 reps, 3 sec hold", note: "Before you get out of bed — you are already lying down." },
      { name: "Glute bridge", dose: "20 reps", note: "Wakes the glutes before you sit in a chair and switch them off again." },
      { name: "Standing wall reset", dose: "45 sec + 10 steps", note: "Walk out of the bedroom holding the position." }
    ]
  },
  {
    id: "desk", name: "Desk Reset", time: "Every 45 min, 9 AM - 5 PM", dur: "60 sec",
    intro: "The most important APT habit in the entire plan, and the one most likely to be skipped. Eight hours of sitting is the cause; this is the antidote, applied in small doses all day. Set a repeating timer — willpower will not remember.",
    items: [
      { name: "Stand up fully", dose: "Immediately", note: "No finishing the thought first. Stand, then think." },
      { name: "Glute squeeze", dose: "10 sec at full force", note: "Standing tall, tailbone slightly tucked, ribs down." },
      { name: "20 steps", dose: "Any direction", note: "Get the hips moving through extension, which is the position a chair denies them." },
      { name: "Hip flexor opener", dose: "20 sec", note: "Stand, step one foot back, tuck the tailbone and squeeze that glute. A standing version of the main stretch." }
    ]
  },
  {
    id: "chair", name: "Chair Setup", time: "All day", dur: "Set once",
    intro: "You cannot out-stretch a badly set up chair. Fix it once and it works for you all day.",
    items: [
      { name: "Hips slightly above knees", dose: "Raise the seat", note: "Knees below hip level reduces how short the hip flexors are held." },
      { name: "Both feet flat on the floor", dose: "Always", note: "Crossing your legs rotates your pelvis and over hours that becomes asymmetric tightness." },
      { name: "Sit on your sit bones", dose: "Check hourly", note: "Not slumped back onto your tailbone, which rounds the lumbar, and not perched forward in an arch." },
      { name: "Lumbar support at belt height", dose: "Cushion or chair setting", note: "Supports neutral rather than forcing an arch." },
      { name: "Screen at eye level", dose: "Raise the laptop", note: "A low screen pulls your head and ribs forward, and your pelvis follows." }
    ]
  },
  {
    id: "pm", name: "Night Routine", time: "9:00 PM - 9:15 PM", dur: "10 min",
    intro: "Non-negotiable, every night, including rest days. Today's sitting shortened your hip flexors; this is where you give that back before you sleep.",
    items: [
      { name: "Foam roll quads & hip flexors", dose: "60 sec per side", note: "Release before stretch." },
      { name: "Half-kneeling hip flexor stretch", dose: "60 sec x 2 per side", note: "Tuck, squeeze, shift two inches. The most important 4 minutes of your day." },
      { name: "90/90 breathing", dose: "3 x 5 breaths", note: "4 sec in through the nose, 8 sec out through the mouth, ribs dropping." },
      { name: "Supine pelvic tilt", dose: "15 reps", note: "Finish by finding neutral so you sleep in it." },
      { name: "Child's pose", dose: "60 sec", note: "Decompress the lumbar erectors before bed." }
    ]
  },
  {
    id: "sleep", name: "Sleep Position", time: "10:00 PM - 5:00 AM", dur: "7 hours",
    intro: "Seven hours is a quarter of your day in one position. It is either helping or working against you.",
    items: [
      { name: "On your back with a pillow under the knees", dose: "Preferred", note: "The pillow lets the pelvis sit neutral instead of being pulled into a tilt by straight legs." },
      { name: "On your side with a pillow between the knees", dose: "Also fine", note: "Keeps the top hip from dropping forward and rotating the pelvis." },
      { name: "Never face-down", dose: "Avoid", note: "Sleeping on your stomach holds your lumbar spine in extension for seven straight hours and directly undoes the day's work. If you always sleep this way, start by putting a pillow under your hips." }
    ]
  }
];

/* --------------------------------------------------------------------------
   Habit checklist — tracked daily like any other task
   -------------------------------------------------------------------------- */
const APT_HABITS = [
  { id: "h1", name: "Morning reset done", detail: "Pelvic tilts, glute bridges and the wall reset before leaving the bedroom." },
  { id: "h2", name: "All desk resets hit", detail: "Stood up and walked every 45 minutes through both work blocks." },
  { id: "h3", name: "Night hip flexor stretch done", detail: "2 x 60 sec per side, tailbone tucked first." },
  { id: "h4", name: "90/90 breathing done", detail: "At least 3 rounds of 5 breaths today." },
  { id: "h5", name: "Sat on sit bones, feet flat", detail: "No crossed legs, no slumping onto the tailbone." },
  { id: "h6", name: "Stood with ribs over pelvis", detail: "Caught yourself standing in a tilt and corrected it, rather than never noticing." },
  { id: "h7", name: "Slept on back or side", detail: "Not face-down." },
  { id: "h8", name: "No arched-back reps in the gym", detail: "Every press and pull done with the lumbar flat against the pad." }
];

/* --------------------------------------------------------------------------
   13-week progression of the correction work
   -------------------------------------------------------------------------- */
const APT_PROGRESSION = [
  {
    weeks: "Weeks 1-2", phase: "Learn neutral",
    focus: "You cannot correct a position you cannot find. Everything this fortnight is about sensation, not load.",
    do: [
      "Supine pelvic tilt, 3 x 15 with 3 sec holds — every single day, gym or not",
      "Deadbug, 3 x 12 per side, strictly within the range where your back stays flat",
      "Glute bridge, bodyweight, 3 x 20",
      "Half-kneeling hip flexor stretch, 60 sec x 2 per side, nightly",
      "Desk reset every 45 minutes — build the timer habit now, it is the one that carries the whole plan"
    ],
    testNow: "Run all 4 self-tests and write the results down. This is your baseline and you will not get another chance at it."
  },
  {
    weeks: "Weeks 3-6", phase: "Full protocol",
    focus: "All four steps daily. Begin adding load to the glute work.",
    do: [
      "Full Release → Stretch → Strengthen → Re-pattern order on every gym day",
      "Hip thrust becomes loaded and progressive — add weight weekly",
      "RKC plank, 3 x 45-60 sec of genuine maximum tension",
      "Couch stretch introduced on Day 4 and Day 6, leaning forward at first",
      "90/90 breathing, 3 rounds, daily",
      "Night routine every night without exception"
    ],
    testNow: "Re-test on weeks 3 and 5. The wall test gap should be measurably smaller by week 5."
  },
  {
    weeks: "Week 7", phase: "Deload — mobility only",
    focus: "Release and stretch only. Let the strength work recover.",
    do: [
      "All release and stretch drills daily, full hold times",
      "Drop the loaded hip thrusts and the long planks entirely this week",
      "Keep pelvic tilts and 90/90 breathing — they are not fatiguing",
      "Keep every desk reset — the habit never deloads"
    ],
    testNow: "Re-test on week 7. Things often feel their best this week, which tells you fatigue had been masking your progress."
  },
  {
    weeks: "Weeks 8-11", phase: "Load the correction",
    focus: "The block where visible posture change happens. Strong under load is what holds a position for 16 hours.",
    do: [
      "Hip thrust heavy, 4 x 12-15, beating last week's load",
      "RKC plank, 4 x 60 sec",
      "Couch stretch progressed toward a fully upright torso",
      "Pallof press and side planks added for anti-rotation and lateral control",
      "Walk the corrected posture deliberately on every treadmill and evening walk"
    ],
    testNow: "Re-test on weeks 9 and 11. By week 11 the wall test should be close to snug."
  },
  {
    weeks: "Weeks 12-13", phase: "Make it automatic",
    focus: "Re-patterning above all. The drills should now feel easy; the point is that you no longer think about them.",
    do: [
      "Maintain strength work — do not chase new PRs in the deepest deficit",
      "Wall reset plus 10 steps, three times daily",
      "90/90 breathing nightly",
      "Full stretch routine nightly",
      "Consciously check your standing posture several times a day until you stop needing to"
    ],
    testNow: "Final re-test on week 13, plus the side-by-side photo against week 1. That comparison is the real result."
  }
];

/* The short list, if everything else gets dropped. */
const APT_NON_NEGOTIABLES = [
  "Half-kneeling hip flexor stretch, 2 x 60 sec per side, every night. Tuck the tailbone first — always.",
  "Desk reset every 45 minutes during work hours. Stand, squeeze, 20 steps.",
  "Hip thrusts or glute bridges on every gym day, progressively loaded.",
  "90/90 breathing, 3 rounds, every day.",
  "Never arch your lower back to move more weight. Not once, on any exercise.",
  "Do not sleep face-down."
];
