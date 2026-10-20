/* ==========================================================================
   data-diet.js — no-cook pure-veg PG diet, 6 meals x 6 options = 36 choices

   Every option: kcal, protein, carbs, fat (grams), cost (rupees), prep minutes.
   Macros are good working estimates for Indian packaged/fresh foods, not lab
   values. Cost is per serving at typical 2026 metro prices.

   PG meals (lunch/dinner base) are costed at 0 because they are already paid
   for in your rent — that is exactly why the plan is built around them.

   tags: "nocook" (zero prep) | "hotwater" (needs only a kettle)
         | "assemble" (chop/mix) | "pg" (uses your PG meal) | "soak" (prep the night before)
   ========================================================================== */

const DIET_DATA = [
  {
    id: "m1", meal: "Breakfast", time: "07:30 AM", slot: "Post-workout",
    note: "Your whey scoop at 7:00 AM is separate from and in addition to this meal. This is the biggest carb hit of the day and it is earned — you just trained for two hours.",
    options: [
      {
        name: "Hot-Water Oats + 1 Scoop Whey",
        desc: "60 g instant oats softened in hot water, stirred with 1 scoop whey once it has cooled slightly. Top with cinnamon.",
        kcal: 350, protein: 33, carbs: 42, fat: 6, cost: 70, prepMin: 4, tags: ["hotwater"],
        tip: "Let the oats cool for a minute before the whey goes in — boiling water makes whey clump and go grainy."
      },
      {
        name: "Peanut Butter & Banana Sandwich",
        desc: "2 slices whole wheat bread + 2 tbsp natural peanut butter + 1 sliced banana.",
        kcal: 435, protein: 15, carbs: 59, fat: 18, cost: 55, prepMin: 3, tags: ["nocook", "assemble"],
        tip: "Lowest protein option here — pair it with a high-protein mid-morning choice to stay on target."
      },
      {
        name: "Greek Yogurt + Nuts + Apple",
        desc: "200 g Greek yogurt (Epigamia / Amul plain) + 20 g mixed nuts + 1 diced apple.",
        kcal: 335, protein: 25, carbs: 38, fat: 13, cost: 110, prepMin: 2, tags: ["nocook", "assemble"],
        tip: "Most expensive breakfast but zero prep and very filling. Good for mornings you are running late."
      },
      {
        name: "Raw Paneer + Brown Bread",
        desc: "100 g fresh paneer cubed with black salt, chaat masala and lemon + 2 slices brown bread.",
        kcal: 405, protein: 24, carbs: 29, fat: 22, cost: 90, prepMin: 4, tags: ["nocook", "assemble"],
        tip: "Paneer is slow-digesting, so this keeps you full right through to 11 AM. Buy it fresh, not frozen."
      },
      {
        name: "Overnight Oats + Curd + Seeds",
        desc: "50 g oats soaked overnight in 150 g curd with 15 g chia or pumpkin seeds. Grab and go.",
        kcal: 365, protein: 16, carbs: 43, fat: 15, cost: 60, prepMin: 1, tags: ["soak"],
        tip: "Assemble it during your 9 PM wind-down block. The fastest breakfast of all six on the actual morning."
      },
      {
        name: "Whey + Peanut Butter Shake",
        desc: "1 scoop whey + 1 tbsp peanut butter + 1 banana + 250 ml water, blended or shaken hard.",
        kcal: 320, protein: 30, carbs: 33, fat: 9, cost: 75, prepMin: 2, tags: ["nocook"],
        tip: "For mornings when you genuinely cannot chew at 7:30 AM. Liquid calories are less filling, so use it sparingly."
      }
    ]
  },
  {
    id: "m2", meal: "Mid-Morning", time: "11:00 AM", slot: "Desk snack",
    note: "Eaten at your desk between coding blocks. Everything here is either zero prep or prepped on Sunday. Pair this with your 45-minute stand-up reset.",
    options: [
      {
        name: "Roasted Chana + Peanuts",
        desc: "50 g roasted chana + 20 g roasted peanuts. The crunchiest, cheapest desk snack in the plan.",
        kcal: 295, protein: 16, carbs: 33, fat: 13, cost: 25, prepMin: 0, tags: ["nocook"],
        tip: "Portion six bags of this on Sunday. Best cost-per-gram-of-protein of anything in the whole diet."
      },
      {
        name: "Fresh Sprout Salad",
        desc: "50 g dry moong/chana sprouted over 2 days + diced cucumber, tomato, onion, lemon and chaat masala.",
        kcal: 195, protein: 13, carbs: 34, fat: 1, cost: 20, prepMin: 3, tags: ["soak", "assemble"],
        tip: "Lowest calorie, lowest cost, highest volume. Soak Friday, eat Sunday through Tuesday."
      },
      {
        name: "1 Scoop Whey in Water",
        desc: "1 scoop whey isolate in 300 ml room-temperature water, shaken in a bottle at your desk.",
        kcal: 120, protein: 25, carbs: 2, fat: 2, cost: 55, prepMin: 1, tags: ["nocook"],
        tip: "The single most protein-efficient option in the entire app. Use it on days your other meals fell short."
      },
      {
        name: "Greek Yogurt + Honey",
        desc: "200 g Greek yogurt with 1 tsp honey and a dash of cinnamon.",
        kcal: 150, protein: 20, carbs: 15, fat: 2, cost: 95, prepMin: 1, tags: ["nocook"],
        tip: "High protein, low calorie, feels like a dessert. Needs a fridge at work."
      },
      {
        name: "Paneer Cubes + Black Salt",
        desc: "60 g fresh paneer cubed with black salt, pepper and lemon in a small box.",
        kcal: 160, protein: 11, carbs: 2, fat: 12, cost: 55, prepMin: 2, tags: ["nocook", "assemble"],
        tip: "Almost zero carbs — good for the low-carb days in Phase 5."
      },
      {
        name: "Roasted Makhana + Almonds",
        desc: "30 g roasted makhana (fox nuts) + 10 almonds.",
        kcal: 175, protein: 6, carbs: 25, fat: 6, cost: 35, prepMin: 0, tags: ["nocook"],
        tip: "Huge volume for the calories, so it kills a snack craving well. Low protein though — not a day you also skip whey."
      }
    ]
  },
  {
    id: "m3", meal: "Lunch", time: "01:00 PM", slot: "PG meal + protein anchor",
    note: "The PG meal is the base; what you add on top is what makes it work. Take the solids and leave the oil floating on top of the dal — that one habit is worth 150 kcal a day on its own.",
    options: [
      {
        name: "PG Meal + 50 g Raw Paneer",
        desc: "PG dal + sabzi + 2 roti (skip the oily gravy) + 50 g cubed fresh paneer with black salt.",
        kcal: 515, protein: 21, carbs: 57, fat: 20, cost: 50, prepMin: 2, tags: ["pg", "assemble"],
        tip: "The default. Keep a paneer block in the fridge and cube 50 g in the morning."
      },
      {
        name: "PG Meal + Hot-Water Soya Chunks",
        desc: "PG meal + 50 g soya chunks soaked in boiling water 10 min, squeezed dry, tossed with chaat masala and lemon.",
        kcal: 555, protein: 38, carbs: 71, fat: 11, cost: 15, prepMin: 12, tags: ["pg", "hotwater"],
        tip: "Highest protein per rupee in the entire plan — 26 g of protein for about ₹15. Squeeze them properly or they taste of water."
      },
      {
        name: "PG Meal + Thick Curd Bowl",
        desc: "Controlled PG rotis/rice + a full 200 g bowl of thick curd or Greek yogurt.",
        kcal: 500, protein: 32, carbs: 64, fat: 12, cost: 90, prepMin: 1, tags: ["pg", "nocook"],
        tip: "Easiest on digestion of all six and good for gut health alongside six training days."
      },
      {
        name: "PG Meal + Whey After",
        desc: "Normal PG meal, then 1 scoop whey in water about 20 minutes later.",
        kcal: 500, protein: 37, carbs: 57, fat: 10, cost: 55, prepMin: 1, tags: ["pg", "nocook"],
        tip: "For days you forgot to prep anything. Takes the protein decision off the table entirely."
      },
      {
        name: "PG Meal + 75 g Paneer + Salad",
        desc: "PG meal + 75 g raw paneer + a large cucumber, tomato and onion salad with lemon.",
        kcal: 580, protein: 26, carbs: 58, fat: 25, cost: 75, prepMin: 5, tags: ["pg", "assemble"],
        tip: "Biggest, most filling lunch. Best on heavy leg days (Day 3 and Day 6)."
      },
      {
        name: "Low-Carb PG Lunch + Soya",
        desc: "Half PG portion — 1 roti and dal, no rice — + 50 g soya chunks + a big raw salad.",
        kcal: 425, protein: 34, carbs: 52, fat: 8, cost: 15, prepMin: 12, tags: ["pg", "hotwater"],
        tip: "Use this in Phase 5 when calories drop to 1,750. High protein, low calorie, still a real meal."
      }
    ]
  },
  {
    id: "m4", meal: "Evening Fuel", time: "05:00 PM", slot: "Pre-walk",
    note: "A real meal, not a nibble — it is what stops you destroying dinner at 8 PM. Eat it before your evening walk, not after. Last caffeine of the day goes here, never later.",
    options: [
      {
        name: "Black Coffee + Banana + 10 Almonds",
        desc: "Hot black coffee + 1 banana + 10 raw or soaked almonds.",
        kcal: 180, protein: 4, carbs: 30, fat: 6, cost: 30, prepMin: 2, tags: ["hotwater"],
        tip: "Caffeine plus quick carbs right before the walk. Lowest protein option — do not stack it with a low-protein dinner."
      },
      {
        name: "Brown Bread + 50 g Raw Paneer",
        desc: "2 slices brown bread with seasoned raw paneer slices, black pepper and lemon.",
        kcal: 275, protein: 15, carbs: 28, fat: 12, cost: 60, prepMin: 4, tags: ["nocook", "assemble"],
        tip: "Open sandwich style. Substantial enough that dinner can stay genuinely light."
      },
      {
        name: "Roasted Chana + Green Tea",
        desc: "50 g spiced roasted chana + a cup of green tea.",
        kcal: 180, protein: 11, carbs: 30, fat: 3, cost: 25, prepMin: 2, tags: ["nocook", "hotwater"],
        tip: "Cheapest option with real protein. Green tea instead of coffee because it is past 5 PM."
      },
      {
        name: "1 Scoop Whey + Apple",
        desc: "1 scoop whey in water + 1 whole apple.",
        kcal: 215, protein: 26, carbs: 27, fat: 2, cost: 70, prepMin: 1, tags: ["nocook"],
        tip: "Highest protein for the fewest calories here. Perfect on the days your protein total is lagging."
      },
      {
        name: "Greek Yogurt + Pumpkin Seeds",
        desc: "200 g Greek yogurt + 15 g pumpkin seeds.",
        kcal: 205, protein: 24, carbs: 12, fat: 9, cost: 110, prepMin: 1, tags: ["nocook"],
        tip: "Pumpkin seeds bring zinc and magnesium, both of which run low on no-cook vegetarian eating."
      },
      {
        name: "Khakhra + Peanut Butter",
        desc: "2 plain khakhra or rice cakes spread with 1 tbsp peanut butter + green tea.",
        kcal: 215, protein: 8, carbs: 23, fat: 11, cost: 35, prepMin: 2, tags: ["nocook", "assemble"],
        tip: "Travels well and survives a bag all day without a fridge."
      }
    ]
  },
  {
    id: "m5", meal: "Dinner", time: "08:00 PM", slot: "Light, protein-forward",
    note: "Lowest-carb meal of the day. Half portion of PG carbs and a big volume of raw salad so you finish genuinely full on few calories. The deficit is won or lost at this meal.",
    options: [
      {
        name: "Light PG Meal + 1 Scoop Whey",
        desc: "Half portion PG carbs (1 roti, dal, sabzi) + salad + 1 scoop whey in water.",
        kcal: 370, protein: 34, carbs: 37, fat: 9, cost: 55, prepMin: 2, tags: ["pg", "nocook"],
        tip: "The default dinner. High protein, low calorie, almost no effort."
      },
      {
        name: "PG Meal + Sprout & Tomato Salad",
        desc: "Light PG dal and 1 roti + a large bowl of sprouted moong with tomato, onion and lemon.",
        kcal: 425, protein: 21, carbs: 66, fat: 8, cost: 20, prepMin: 3, tags: ["pg", "soak", "assemble"],
        tip: "Cheapest dinner in the plan and the highest fibre, which helps overnight satiety."
      },
      {
        name: "PG Meal + 50 g Raw Paneer",
        desc: "Light PG dinner + 50 g raw paneer cubes with cucumber and black salt.",
        kcal: 390, protein: 18, carbs: 38, fat: 17, cost: 50, prepMin: 3, tags: ["pg", "assemble"],
        tip: "Paneer at night digests slowly, which works like a budget casein shake before bed."
      },
      {
        name: "PG Meal + Soya Chunks + Salad",
        desc: "Half PG portion + 50 g hot-water soya chunks + a large raw salad.",
        kcal: 440, protein: 35, carbs: 51, fat: 8, cost: 15, prepMin: 12, tags: ["pg", "hotwater"],
        tip: "Best protein-to-cost dinner. Soak the soya while you are doing your night stretches."
      },
      {
        name: "PG Meal + 200 g Curd + Big Salad",
        desc: "Light PG portion + a full curd bowl + a large cucumber-tomato-onion salad.",
        kcal: 390, protein: 29, carbs: 46, fat: 9, cost: 90, prepMin: 4, tags: ["pg", "assemble"],
        tip: "Very easy on the stomach two hours before a 10 PM bedtime."
      },
      {
        name: "Zero-Carb Plate (No PG Carbs)",
        desc: "200 g Greek yogurt + 60 g paneer + a very large raw vegetable salad. No roti, no rice.",
        kcal: 320, protein: 31, carbs: 14, fat: 14, cost: 150, prepMin: 6, tags: ["nocook", "assemble"],
        tip: "Phase 5 tool for the final two weeks when calories are at 1,750. Most expensive dinner, but it is the one that gets you to 68.2 kg."
      }
    ]
  },
  {
    id: "m6", meal: "Before Bed", time: "10:00 PM", slot: "Overnight recovery",
    note: "Small, slow-digesting and protein-led. Your muscle repairs across seven hours of sleep and this is the material it uses. Keep it light enough that it does not interfere with sleep.",
    options: [
      {
        name: "Half Scoop Whey in Water",
        desc: "Half a scoop of whey in 200 ml water. Minimal calories, useful protein.",
        kcal: 60, protein: 13, carbs: 1, fat: 1, cost: 28, prepMin: 1, tags: ["nocook"],
        tip: "The lowest-calorie way to add protein at the end of the day. Default when you are already near your kcal cap."
      },
      {
        name: "Almonds & Walnuts",
        desc: "A small handful — about 20 g — of almonds and walnuts.",
        kcal: 130, protein: 4, carbs: 4, fat: 12, cost: 40, prepMin: 0, tags: ["nocook"],
        tip: "Healthy fats and magnesium support deep sleep. Weigh it once so you learn what 20 g actually looks like — a 'handful' is usually 40 g."
      },
      {
        name: "Green Tea + Pumpkin Seeds",
        desc: "Warm herbal or green tea + 2 tbsp (20 g) roasted pumpkin seeds.",
        kcal: 115, protein: 5, carbs: 3, fat: 9, cost: 30, prepMin: 2, tags: ["hotwater"],
        tip: "Zinc and magnesium for sleep and hormone support. Use a caffeine-free herbal tea at this hour."
      },
      {
        name: "Curd with Cinnamon",
        desc: "150 g plain curd with a dash of cinnamon.",
        kcal: 90, protein: 5, carbs: 7, fat: 5, cost: 25, prepMin: 1, tags: ["nocook"],
        tip: "Cheapest option and gentle on the stomach. Low protein, so only on days you already hit your target."
      },
      {
        name: "60 g Paneer (Slow Digest)",
        desc: "60 g fresh paneer, plain or with black pepper.",
        kcal: 160, protein: 11, carbs: 2, fat: 12, cost: 55, prepMin: 1, tags: ["nocook"],
        tip: "Paneer's casein digests over hours, which is genuinely the best overnight protein available to you without buying casein powder."
      },
      {
        name: "Whey + Peanut Butter",
        desc: "1 scoop whey + 1 tsp peanut butter stirred in, in 250 ml water.",
        kcal: 180, protein: 27, carbs: 4, fat: 7, cost: 75, prepMin: 2, tags: ["nocook"],
        tip: "The fat slows the whey down so it behaves a bit more like casein. Use on days your protein total is well short."
      }
    ]
  }
];

/* --------------------------------------------------------------------------
   How to actually hit the protein target
   -------------------------------------------------------------------------- */
const DIET_STRATEGY = {
  headline: "Protein is the one number you cannot miss.",
  points: [
    "Picking option 1 at every meal lands you around 1,770 kcal and 121 g protein. That is under target on protein. The app shows your running protein total against the phase target for exactly this reason — watch it and adjust the later meals.",
    "A high-protein day: Breakfast opt 1 (33 g) + Mid-morning opt 3 (25 g) + Lunch opt 2 (38 g) + Evening opt 4 (26 g) + Dinner opt 4 (35 g) + Bed opt 6 (27 g) = 184 g protein at 1,860 kcal. That combination proves the target is reachable on pure veg with no cooking.",
    "Three cheapest protein sources, in order: soya chunks (26 g for ₹15), roasted chana (11 g for ₹20), whey (25 g for ₹55). Soya chunks are four times cheaper per gram of protein than whey — lean on them.",
    "The PG meal gives you carbs and a little protein. Treat the protein you add on top as the actual meal and the PG food as the side.",
    "Leave the oil. Standard PG dal and sabzi carry 2-3 tsp of oil per serving, which is 150-250 kcal of pure fat you did not choose to eat. Taking the solids and leaving the floating oil saves more calories than any other single habit in this plan.",
    "If you hit your protein target and your calorie target, the rest is detail. Do not spend energy optimising anything else until those two are consistent for a full fortnight."
  ]
};

/* --------------------------------------------------------------------------
   Hydration schedule
   -------------------------------------------------------------------------- */
const HYDRATION_PLAN = {
  targetL: 3.5,
  phase45L: "4.0 L in Phases 4 and 5",
  why: "At 3.5-4 L a day you blunt hunger, keep training performance up, and keep creatine working. Dehydration feels almost exactly like hunger, which is why people snack at 4 PM.",
  schedule: [
    { time: "4:45 AM", amount: "500 ml", note: "On waking, before coffee. You wake up dehydrated." },
    { time: "5:00-7:00 AM", amount: "750 ml", note: "Sip across the session. Not all at once." },
    { time: "7:30 AM", amount: "250 ml", note: "With breakfast and your supplements." },
    { time: "9:00-1:00 PM", amount: "1,000 ml", note: "One full bottle across the morning work block." },
    { time: "2:00-5:00 PM", amount: "750 ml", note: "One bottle across the afternoon block." },
    { time: "6:00-8:00 PM", amount: "250 ml", note: "During the evening walk." },
    { time: "After 8:30 PM", amount: "Sips only", note: "Taper off so you are not up at 2 AM. Sleep beats hydration at this hour." }
  ]
};

/* --------------------------------------------------------------------------
   Weekly grocery list
   -------------------------------------------------------------------------- */
const GROCERY_LIST = [
  { cat: "Protein staples", items: [
    { item: "Whey protein isolate", qty: "500 g / week (≈ 16 scoops)", cost: 800 },
    { item: "Fresh paneer", qty: "400-600 g", cost: 350 },
    { item: "Soya chunks", qty: "500 g pack (lasts 2-3 weeks)", cost: 90 },
    { item: "Greek yogurt / curd", qty: "1.2 kg", cost: 250 },
    { item: "Whole moong + chana for sprouting", qty: "500 g each", cost: 120 }
  ]},
  { cat: "Carbs", items: [
    { item: "Instant oats", qty: "1 kg (lasts 2-3 weeks)", cost: 220 },
    { item: "Whole wheat / brown bread", qty: "2 loaves", cost: 110 },
    { item: "Khakhra or rice cakes", qty: "1 pack", cost: 80 }
  ]},
  { cat: "Snacks & fats", items: [
    { item: "Roasted chana", qty: "500 g", cost: 90 },
    { item: "Roasted peanuts", qty: "250 g", cost: 60 },
    { item: "Almonds", qty: "250 g", cost: 200 },
    { item: "Walnuts", qty: "100 g", cost: 120 },
    { item: "Pumpkin seeds", qty: "200 g", cost: 150 },
    { item: "Natural peanut butter", qty: "1 jar (lasts 3 weeks)", cost: 350 },
    { item: "Roasted makhana", qty: "200 g", cost: 130 }
  ]},
  { cat: "Fresh produce", items: [
    { item: "Bananas", qty: "8-10", cost: 60 },
    { item: "Apples", qty: "6", cost: 180 },
    { item: "Cucumber, tomato, onion", qty: "1 kg mixed", cost: 120 },
    { item: "Lemons", qty: "6", cost: 30 }
  ]},
  { cat: "Drinks & seasoning", items: [
    { item: "Ground coffee", qty: "250 g (lasts a month)", cost: 300 },
    { item: "Green / herbal tea", qty: "25 bags", cost: 150 },
    { item: "Black salt, chaat masala, cinnamon, pepper", qty: "Top up monthly", cost: 100 }
  ]},
  { cat: "Supplements (monthly, not weekly)", items: [
    { item: "Creatine monohydrate", qty: "250 g tub (50 days)", cost: 600 },
    { item: "Vitamin B12", qty: "60 tablets", cost: 180 },
    { item: "Vitamin D3 2000 IU", qty: "60 capsules", cost: 220 },
    { item: "Algal omega-3", qty: "60 capsules", cost: 700 },
    { item: "Multivitamin", qty: "60 tablets", cost: 250 }
  ]}
];

/* --------------------------------------------------------------------------
   Rules for the days life gets in the way
   -------------------------------------------------------------------------- */
const DIET_FALLBACKS = [
  { when: "Eating out with friends", do: "Order a paneer tikka (dry, not in gravy) or a tandoori platter plus a salad, and skip the naan, rice and sweet drink. Roughly 500 kcal and 30 g protein. Then eat lighter at your next meal, not for the next three days." },
  { when: "PG food is unusually oily or there is nothing but fried food", do: "Eat the roti and the solids, skip the gravy completely, and make up the protein with a whey scoop and 50 g paneer. A deliberately imperfect meal beats a skipped one." },
  { when: "You travelled and missed two meals", do: "Do not try to eat 1,000 kcal at 10 PM to 'hit your target'. Take a whey scoop, go to sleep, and eat normally tomorrow. One low day across 92 days is statistically invisible." },
  { when: "You are genuinely starving at 11 PM", do: "500 ml water first, wait 10 minutes. If you are still hungry, eat 60 g paneer or half a scoop of whey — protein, not carbs. Then look at whether your dinner was actually too small, because chronic late hunger means the plan needs adjusting, not more willpower." },
  { when: "A birthday, festival or a meal you actually want", do: "Eat it, enjoy it properly, and go straight back to plan at the next meal. One 1,500 kcal meal costs you about two days of progress. Three weeks of guilt-driven chaos afterwards costs you the whole phase. Build it in instead of pretending it will not happen." },
  { when: "You are sick", do: "Drop the training, keep the protein, eat at maintenance (around 2,600 kcal) until you recover. Trying to run a deficit while ill extends how long you are ill." }
];
