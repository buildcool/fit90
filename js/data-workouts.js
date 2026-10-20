/* ==========================================================================
   data-workouts.js — the complete 7-day split, exercise by exercise.

   Each day is a sequence of BLOCKS:
     warmup  -> main -> apt -> cardio -> cooldown
   Each exercise carries: machine, prescription, rest, tempo, a substitute for
   when the machine is taken, setup, execution, the APT cue, the common
   mistake, and the key of its animation template in figure.js.

   Exercises with `fixed: true` use their own sets/reps (warm-ups, holds,
   stretches, cardio). Everything else takes sets/reps/rest from the current
   phase in data-plan.js, so the same exercise auto-progresses across 13 weeks.
   `log: true` marks the lifts where you record weight x reps.
   ========================================================================== */

const WORKOUT_DAYS = [
  /* ====================================================================== */
  {
    day: 1,
    dow: "Monday",
    name: "Day 1: Push",
    focus: "Chest, Shoulders & Triceps",
    summary:
      "Your heaviest upper-body pressing day. Pressing is also the number one trigger for Anterior Pelvic Tilt, because the easy way to press more weight is to arch your lower back. Every single press today is a chance to either feed the APT or fix it.",
    blocks: [
      {
        id: "d1b1", type: "warmup", name: "Warm-Up", dur: "10 min",
        note: "Specific, never generic. You are raising tissue temperature and waking the shoulder blades up so the pressing has a stable base.",
        exercises: [
          {
            id: "d1w1", name: "Treadmill Brisk Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "5 min @ 5.5 km/h, 4% incline", restSec: 0,
            substitute: "Cross-trainer or stationary bike, same 5 minutes",
            setup: "Set 5.5 km/h with a 4% incline. Hands off the rails.",
            exec: "Walk tall for 5 minutes. You want to be slightly warm and breathing a little deeper, not tired.",
            apt: "Walk with your ribs stacked over your pelvis rather than your chest puffed and lower back arched. Start the posture work in the first 5 minutes of the day.",
            mistake: "Holding the rails and leaning back, which switches the whole thing off.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=incline+treadmill+walk+warm+up"
          },
          {
            id: "d1w2", name: "Band Pull-Aparts", machine: "Resistance Band", fixed: true, sets: 2, reps: "20 reps", restSec: 30,
            substitute: "Light cable face pulls, or reverse pec deck with the lightest plate",
            setup: "Hold a light band at shoulder width, arms straight out in front at chest height.",
            exec: "Pull the band apart until your arms are wide, squeezing your shoulder blades together. Return slowly. 20 reps.",
            apt: "Stand with your tailbone slightly tucked and glutes lightly squeezed. Do not let the pull-apart turn into a lower-back arch.",
            mistake: "Shrugging your shoulders up to your ears instead of pulling the blades together and down.",
            anim: "bandPullApart",
            video: "https://www.youtube.com/results?search_query=band+pull+apart+proper+form"
          },
          {
            id: "d1w3", name: "Scapular Wall Slides", machine: "Flat Wall", fixed: true, sets: 2, reps: "10 reps", restSec: 30,
            substitute: "Cable or band overhead shrug, 2 x 12",
            setup: "Stand with your back, head and both forearms flat against a wall, elbows bent at 90 degrees.",
            exec: "Slide your forearms up the wall overhead without letting them lift off, then slide back down. 10 slow reps.",
            apt: "Your entire lower back must stay flat against the wall for all 10 reps. If it lifts away, bend your knees slightly and tuck your pelvis. This is a live APT test disguised as a warm-up.",
            mistake: "Letting the lower back peel off the wall so the arms can go higher.",
            anim: "wallSlide",
            video: "https://www.youtube.com/results?search_query=scapular+wall+slide+exercise"
          },
          {
            id: "d1w4", name: "Light Chest Press Primer", machine: "Cult Fuel Chest Press", fixed: true, sets: 2, reps: "15 reps (very light)", restSec: 45,
            substitute: "Push-ups on knees, 2 x 12",
            setup: "Same machine setup as your working sets, but with roughly 40% of your working weight.",
            exec: "15 smooth reps feeling the chest, not the shoulders. This grooves the exact movement pattern you are about to load.",
            apt: "Set your position now: ribs flat into the pad, glutes squeezed, lower back neutral. Memorise it before the weight gets heavy.",
            mistake: "Skipping this because it feels pointless — it is what makes set 1 as good as set 3.",
            anim: "seatedPressIncline",
            video: "https://www.youtube.com/results?search_query=machine+chest+press+warm+up+set"
          }
        ]
      },
      {
        id: "d1b2", type: "main", name: "Main Lifts & Accessories", dur: "55 min",
        note: "Log every set. Beating last week's number on these seven movements is what protects your muscle while you lose 11.8 kg.",
        exercises: [
          {
            id: "d1e1", name: "Incline Chest Press", machine: "Cult Fuel Series Chest Press", log: true, restSec: 90,
            substitute: "Incline dumbbell press on an adjustable bench at 30 degrees",
            setup: "Adjust the seat so the handles line up with your upper chest, just below the collarbone. Sit back and pull both shoulder blades down and together against the pad, then squeeze your glutes to lock your pelvis in place.",
            exec: "Drive the handles forward and slightly up until your arms are almost straight, stopping just short of locking the elbows. Squeeze the chest for one second at the top. Take a full three seconds to let the handles come back until you feel a stretch across the chest.",
            apt: "Your lower back and bottom ribs stay pressed flat into the pad for every single rep. The moment you arch your lumbar spine off the seat to move more weight, you are training the exact posture you are here to fix.",
            mistake: "Setting the seat too low, which turns an incline chest press into a shoulder press and hammers your front delts instead of your chest.",
            anim: "seatedPressIncline",
            video: "https://www.youtube.com/results?search_query=machine+incline+chest+press+proper+form"
          },
          {
            id: "d1e2", name: "Flat Dumbbell Press", machine: "Flat Bench + Dumbbells", log: true, restSec: 90,
            substitute: "Flat machine chest press, or push-ups with a slow 3-second lower",
            setup: "Lie on a flat bench with both feet planted firmly on the floor. Start with the dumbbells directly above your chest, elbows tucked to about 45 degrees from your torso — not flared straight out to the sides.",
            exec: "Lower both dumbbells slowly until they are level with your chest and you feel a deep stretch across the pecs. Press back up and in, as if trying to touch the two dumbbells together without actually clanging them, and squeeze.",
            apt: "Exhale as you press and actively pull your bottom ribs down towards your hips. There should be no gap you could slide a hand into between your lower back and the bench.",
            mistake: "Flaring the elbows to 90 degrees, which puts all the load on the shoulder joint and is the single most common cause of gym shoulder pain.",
            anim: "benchPressDumbbell",
            video: "https://www.youtube.com/results?search_query=flat+dumbbell+bench+press+form"
          },
          {
            id: "d1e3", name: "Machine Shoulder Press", machine: "Cult Shoulder Press Machine", log: true, restSec: 90,
            substitute: "Seated dumbbell shoulder press on a bench set to 85 degrees",
            setup: "Set the seat so the handles sit at ear or jawline height. Grip the handles so your wrists stack directly above your elbows. Plant your feet and squeeze your glutes before the first rep.",
            exec: "Press straight overhead until your arms are almost fully extended, keeping your head neutral. Lower under strict control back to chin level over three seconds.",
            apt: "This is the number one APT trigger in the entire gym. When the weight gets heavy your body will try to lean back and arch your lower spine to turn it into an incline press. Squeeze your glutes hard on the seat and glue your lower back to the backrest. If you cannot press it without arching, the weight is too heavy — drop it.",
            mistake: "Leaning back and arching the lower back to grind out the last two reps. Those two reps cost you more in posture than they buy you in muscle.",
            anim: "seatedPressOverhead",
            video: "https://www.youtube.com/results?search_query=seated+machine+shoulder+press+form"
          },
          {
            id: "d1e4", name: "Pec Deck Chest Fly", machine: "Cult Pec Deck Machine", log: true, restSec: 75,
            substitute: "Cable crossover at chest height, or flat dumbbell fly with light weight",
            setup: "Adjust the seat so the handles sit at mid-chest height. Sit tall with your shoulder blades pinned back and down against the pad.",
            exec: "Bring the handles together in a wide smooth arc, like hugging a barrel. Squeeze your inner chest hard for one second when they meet, then let them travel back slowly until you feel the stretch.",
            apt: "Keep your ribs down and your lower back flat against the backrest for the whole set. The stretch at the end should be felt in your chest, not in your lower back.",
            mistake: "Bending the elbows more and more as the set gets hard, which quietly turns the fly into a press.",
            anim: "pecDeckFly",
            video: "https://www.youtube.com/results?search_query=pec+deck+machine+chest+fly+form"
          },
          {
            id: "d1e5", name: "Dumbbell Lateral Raise", machine: "Light Dumbbells", log: true, restSec: 60,
            substitute: "Cable lateral raise, single arm, or the lateral raise machine",
            setup: "Stand with a light dumbbell in each hand at your sides, a slight bend in the elbows, tailbone lightly tucked.",
            exec: "Lead with your elbows and raise both arms out to the sides until they are level with your shoulders, no higher. Pause for a second, then lower over three seconds. Pretend you are pouring water out of two jugs.",
            apt: "Stand tall with your glutes lightly squeezed. Do not swing by rocking your hips forward and arching your lower back — if you need to swing, the dumbbells are too heavy.",
            mistake: "Going too heavy and shrugging. This is a 5-8 kg exercise for almost everyone, not a 15 kg one.",
            anim: "lateralRaise",
            video: "https://www.youtube.com/results?search_query=dumbbell+lateral+raise+proper+form"
          },
          {
            id: "d1e6", name: "Rope Tricep Pushdown", machine: "Cable Crossover Machine (Rope)", log: true, restSec: 60,
            substitute: "Straight-bar pushdown, or dumbbell kickbacks",
            setup: "Attach a rope to the top pulley. Stand one step back with feet shoulder-width apart and knees slightly unlocked. Lean forward about 10 degrees from the hips.",
            exec: "Pin your elbows to your ribs and keep them there. Push the rope down until your elbows are locked out, then pull the two rope ends apart and slightly back for one second. Return slowly without letting your elbows drift forward.",
            apt: "Stand with your tailbone tucked slightly under. Do not stick your butt backwards into an arched lower-back posture to get leverage.",
            mistake: "Letting the elbows drift forward and away from the ribs, which turns it into a chest press and takes the triceps out of it.",
            anim: "cablePushdown",
            video: "https://www.youtube.com/results?search_query=rope+tricep+pushdown+proper+form"
          },
          {
            id: "d1e7", name: "Overhead Rope Tricep Extension", machine: "Cable Machine (Low/Mid Pulley + Rope)", log: true, restSec: 60,
            substitute: "Single dumbbell overhead extension with both hands",
            setup: "Set the rope on a low or mid pulley. Face away from the machine in a staggered stance, rope held behind your head, elbows pointing forward and up alongside your ears.",
            exec: "Extend your forearms forward and overhead until your arms are straight, squeeze, then let your hands travel back behind your head to feel a deep stretch in the long head of the triceps.",
            apt: "Anything overhead pulls your ribs up and your lower back into an arch. Tuck your ribs down hard and squeeze your glutes before the first rep, and keep the staggered stance — the stretch should be in your triceps, never in your lower spine.",
            mistake: "Arching the lower back to get the arms further overhead. Reduce the range instead and keep the pelvis neutral.",
            anim: "overheadExtension",
            video: "https://www.youtube.com/results?search_query=overhead+cable+tricep+extension+rope+form"
          }
        ]
      },
      {
        id: "d1b3", type: "apt", name: "APT Correction Block", dur: "20 min",
        note: "The part everyone skips and the reason your posture never changes. You just spent 55 minutes pressing, which shortens hip flexors and tempts the lumbar into extension. This block pays that back immediately.",
        exercises: [
          {
            id: "d1a1", name: "Supine Pelvic Tilt", machine: "Floor Mat", fixed: true, sets: 3, reps: "15 reps (3s hold)", restSec: 45,
            substitute: "Standing pelvic tilt against a wall",
            setup: "Lie on your back with knees bent and feet flat on the floor, arms by your sides.",
            exec: "Exhale fully, tighten your lower abs and glutes, and roll your pelvis backwards so your lower back presses completely flat into the mat. Hold for three seconds, then release slowly. 15 reps.",
            apt: "This is the single most important movement in the entire 90 days. You are teaching your nervous system what neutral actually feels like. Memorise the sensation and replicate about 30% of this tuck whenever you stand or walk.",
            mistake: "Pushing with your feet instead of rolling with your abs and glutes. Your heels should stay light.",
            anim: "pelvicTilt",
            video: "https://www.youtube.com/results?search_query=supine+pelvic+tilt+exercise"
          },
          {
            id: "d1a2", name: "Deadbug", machine: "Floor Mat", fixed: true, sets: 3, reps: "12 reps / side", restSec: 45,
            substitute: "Heel slides with the lower back pinned flat",
            setup: "Lie on your back with both arms reaching straight at the ceiling and knees bent 90 degrees directly over your hips.",
            exec: "Crush your lower back flat into the floor first. Then slowly extend your right arm back overhead and your left leg out straight at the same time, breathing out. Return and switch sides. 12 per side.",
            apt: "If your lower back lifts even one centimetre off the mat, you have gone too far — exhale harder and shorten the leg extension. The back staying flat is the entire exercise; the arms and legs are just the challenge.",
            mistake: "Rushing and holding your breath. Slow and exhaling is what makes the deep core fire.",
            anim: "deadbug",
            video: "https://www.youtube.com/results?search_query=deadbug+exercise+anterior+pelvic+tilt"
          },
          {
            id: "d1a3", name: "Glute Bridge", machine: "Floor Mat", fixed: true, sets: 3, reps: "15-20 reps (2s hold)", restSec: 45,
            substitute: "Hip thrust with your upper back on a bench",
            setup: "Lie on your back with knees bent and heels about 6 inches from your glutes, arms flat by your sides.",
            exec: "Flatten your lower back into the mat first, then drive through your heels and lift your hips until knees, hips and shoulders form one straight line. Hold the squeeze for two seconds at the top, then lower slowly.",
            apt: "The lift comes 100% from squeezing your glutes with your ribs staying down — never from pushing with your lower back. At the top you should feel it entirely in your glutes. If you feel it in your lower back, you have gone too high and are arching rather than extending the hip.",
            mistake: "Going as high as possible by hyperextending the lumbar spine. Stop at the straight line.",
            anim: "gluteBridge",
            video: "https://www.youtube.com/results?search_query=glute+bridge+for+anterior+pelvic+tilt"
          }
        ]
      },
      {
        id: "d1b4", type: "cardio", name: "Cardio Finisher", dur: "0-20 min (phase dependent)",
        note: "Zero in weeks 1-2. 12 min from week 3. 15 min from week 8. 20 min in the last two weeks. Conversational pace only — this is for calories, not for suffering.",
        exercises: [
          {
            id: "d1c1", name: "Incline Treadmill Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "Per phase (0-20 min)", restSec: 0,
            substitute: "Cross-trainer or stationary bike at an easy resistance",
            setup: "5-6 km/h at 8-10% incline. Hands off the rails.",
            exec: "Walk at a pace where you could just about hold a conversation. Do not run — running after a lift in a deficit eats into your recovery for very little extra fat loss.",
            apt: "Walk tall with ribs stacked over pelvis and a light glute squeeze. Incline walking is genuinely good for your glutes if you do not lean on the rails.",
            mistake: "Gripping the rails and leaning back, which cuts the real effort roughly in half.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=incline+treadmill+walk+fat+loss"
          }
        ]
      },
      {
        id: "d1b5", type: "cooldown", name: "Cool-Down & Stretch", dur: "10 min",
        note: "Hip flexors last and longest — it is the stretch that matters most for your pelvis.",
        exercises: [
          {
            id: "d1s1", name: "Doorway Pec Stretch", machine: "Doorway or Rack Upright", fixed: true, sets: 2, reps: "30 sec / side", restSec: 0,
            substitute: "Lying chest stretch over a foam roller",
            setup: "Place your forearm flat on a doorframe with your elbow at shoulder height.",
            exec: "Step through gently until you feel a stretch across the front of your chest. Hold 30 seconds, breathing out slowly. Switch sides.",
            apt: "Keep your ribs down and your pelvis neutral. The easy cheat here is to arch your back to feel a bigger stretch — that stretches your spine, not your chest.",
            mistake: "Yanking into it. Pressing muscles are warm and pliable now; be gentle.",
            anim: "pecStretch",
            video: "https://www.youtube.com/results?search_query=doorway+pec+stretch"
          },
          {
            id: "d1s2", name: "Half-Kneeling Hip Flexor Stretch", machine: "Floor Mat", fixed: true, sets: 2, reps: "60 sec / side", restSec: 0,
            substitute: "Couch stretch with the rear foot elevated on a bench",
            setup: "Kneel on one knee with a folded mat under it, the other foot planted in front at 90 degrees. Torso vertical.",
            exec: "Tuck your tailbone under into a posterior tilt FIRST, then squeeze the glute of the kneeling leg hard. Only then shift forward about two inches. Hold 60 seconds and breathe.",
            apt: "The tuck is the stretch. If you lean forward with an arched lower back you will feel a pull, but it is your lumbar spine compressing, not your psoas lengthening — and it makes the APT worse. Tuck, squeeze the glute, then move 2 inches. That is all the range you need.",
            mistake: "Lunging deep with an arched back and calling it a hip flexor stretch. This is the most commonly butchered stretch in any gym.",
            anim: "hipFlexorStretch",
            video: "https://www.youtube.com/results?search_query=half+kneeling+hip+flexor+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d1s3", name: "Child's Pose with Side Reach", machine: "Floor Mat", fixed: true, sets: 1, reps: "60 sec + 30 sec / side", restSec: 0,
            substitute: "Seated forward fold",
            setup: "Kneel and sit back onto your heels, reaching your arms forward on the floor.",
            exec: "Sink your hips back and breathe into your lower back for 60 seconds. Then walk both hands to the left for 30 seconds to open the right side, and repeat the other way.",
            apt: "This gently decompresses the lumbar erectors, which are chronically tight and short in APT and have been working hard all session.",
            mistake: "Holding your breath. The decompression comes from the exhale.",
            anim: "childPose",
            video: "https://www.youtube.com/results?search_query=childs+pose+stretch+lower+back"
          }
        ]
      }
    ]
  },

  /* ====================================================================== */
  {
    day: 2,
    dow: "Tuesday",
    name: "Day 2: Pull",
    focus: "Back Width, Thickness, Rear Delts & Biceps",
    summary:
      "Pulling day builds the V-taper that makes 68 kg look lean, and it directly fights the rounded-forward desk posture you build up from 9 to 5. A strong upper back is what lets you sit tall without effort.",
    blocks: [
      {
        id: "d2b1", type: "warmup", name: "Warm-Up", dur: "10 min",
        note: "Wake the lats and the mid-back up before you ask them to move weight, or your biceps and forearms will do the work instead.",
        exercises: [
          {
            id: "d2w1", name: "Treadmill Brisk Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "5 min @ 5.5 km/h, 4% incline", restSec: 0,
            substitute: "Rowing machine, 5 min easy",
            setup: "5.5 km/h, 4% incline, hands off the rails.",
            exec: "Five minutes to raise your temperature and heart rate before touching a weight.",
            apt: "Ribs stacked over pelvis, light glute squeeze, tall posture.",
            mistake: "Treating it as dead time on your phone instead of the start of the session.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=treadmill+warm+up+before+weights"
          },
          {
            id: "d2w2", name: "Band Pull-Aparts", machine: "Resistance Band", fixed: true, sets: 2, reps: "20 reps", restSec: 30,
            substitute: "Reverse pec deck, lightest setting",
            setup: "Light band held at shoulder width, arms straight in front at chest height.",
            exec: "Pull apart, squeeze the shoulder blades together, return slowly. 20 reps.",
            apt: "Tailbone slightly tucked, glutes lightly on. No lower-back arch to help.",
            mistake: "Shrugging up instead of squeezing back and down.",
            anim: "bandPullApart",
            video: "https://www.youtube.com/results?search_query=band+pull+apart+proper+form"
          },
          {
            id: "d2w3", name: "Scapular Pull-Ups", machine: "Pull-Up Bar / Assisted Pull-Up Machine", fixed: true, sets: 2, reps: "10 reps", restSec: 30,
            substitute: "Dead hang for 20 seconds, 2 sets",
            setup: "Hang from the bar with straight arms and a shoulder-width overhand grip. Use the assist pad if you need it.",
            exec: "Without bending your elbows at all, pull your shoulder blades down and back so your body rises two or three inches. Hold one second, then let them rise again. 10 reps.",
            apt: "Keep a slight hollow-body position with ribs down rather than hanging in a big passive arch. Hanging with a relaxed arched back loads exactly the posture you are fixing.",
            mistake: "Bending the elbows and turning it into a tiny pull-up. The arms stay completely straight.",
            anim: "scapPullup",
            video: "https://www.youtube.com/results?search_query=scapular+pull+ups+exercise"
          },
          {
            id: "d2w4", name: "Light Lat Pulldown Primer", machine: "Cult Lat Pulldown Machine", fixed: true, sets: 2, reps: "15 reps (very light)", restSec: 45,
            substitute: "Light straight-arm pulldown, 2 x 15",
            setup: "About 40% of your working weight, same grip you will use for your working sets.",
            exec: "15 smooth reps focusing on pulling your elbows down to your hips and feeling the lats, not the arms.",
            apt: "Lock in your position now: pelvis upright on the seat, ribs down, no leaning back.",
            mistake: "Skipping straight to a working weight with cold lats — the quickest way to a tweaked shoulder.",
            anim: "pulldown",
            video: "https://www.youtube.com/results?search_query=lat+pulldown+warm+up+set"
          }
        ]
      },
      {
        id: "d2b2", type: "main", name: "Main Lifts & Accessories", dur: "55 min",
        note: "On every pull, think 'elbows drive, hands just hold on'. If you feel it mostly in your forearms, you are pulling with your arms.",
        exercises: [
          {
            id: "d2e1", name: "Lat Pulldown (Wide Overhand)", machine: "Cult Lat Pulldown Machine", log: true, restSec: 90,
            substitute: "Assisted pull-up machine, same rep range",
            setup: "Lock the thigh pad snugly over your quads so you cannot lift off the seat. Grip the wide bar slightly wider than shoulder-width, overhand. Sit upright with your pelvis stacked under your ribs.",
            exec: "Pull your shoulders down away from your ears first, then drive your elbows down towards your hips until the bar touches your upper chest. Squeeze your lats for one second, then let the bar rise over three seconds until your lats are fully stretched.",
            apt: "Lean back no more than 10-15 degrees, and lean from your hips as one solid block rather than hinging at your lower spine. The classic error is rocking back and hyperextending the lumbar to drag the bar down — that is an APT rep, not a lat rep.",
            mistake: "Pulling the bar behind the neck. Bar to upper chest, always, in front.",
            anim: "pulldown",
            video: "https://www.youtube.com/results?search_query=lat+pulldown+proper+form"
          },
          {
            id: "d2e2", name: "Seated Cable Row", machine: "Cult Seated Row Machine", log: true, restSec: 90,
            substitute: "Chest-supported machine row",
            setup: "Place your feet on the footplates with knees slightly bent. Sit tall with your chest up and grab the V-handle, arms long, feeling a stretch in your lats.",
            exec: "Pull the handle into your lower stomach while squeezing your shoulder blades together hard for one second. Let your arms extend slowly over three seconds until you feel the stretch again.",
            apt: "Keep your pelvis upright on the seat and brace your abs as if someone is about to tap your stomach. Do not rock backwards to start the pull or let your lower back round forwards on the stretch — your torso should stay almost completely still.",
            mistake: "Using your whole torso as a rowing oar. If your body is swinging 30 degrees back and forth, the weight is too heavy.",
            anim: "seatedRow",
            video: "https://www.youtube.com/results?search_query=seated+cable+row+proper+form"
          },
          {
            id: "d2e3", name: "Single-Arm Dumbbell Row", machine: "Flat Bench + Dumbbell", log: true, restSec: 75,
            substitute: "Chest-supported dumbbell row, or a single-arm cable row",
            setup: "Place your left knee and left hand on a flat bench, right foot on the floor, right hand holding a dumbbell hanging straight down. Your back should be flat and parallel to the floor.",
            exec: "Drive your right elbow up and back towards your hip, bringing the dumbbell to your ribs. Squeeze for one second, then lower over three seconds until your lat is fully stretched. Then switch sides.",
            apt: "Keep your spine in one straight neutral line from head to tailbone — no sag in the lower back, no rotation of the hips. Because you are bent over, this is a brilliant chance to practise holding neutral under load.",
            mistake: "Twisting your torso to get extra range. The shoulder moves, the spine stays still.",
            anim: "dumbbellRow",
            video: "https://www.youtube.com/results?search_query=single+arm+dumbbell+row+proper+form"
          },
          {
            id: "d2e4", name: "Straight-Arm Pulldown", machine: "Cable Machine (High Pulley + Rope/Bar)", log: true, restSec: 60,
            substitute: "Dumbbell pullover on a flat bench",
            setup: "Stand facing a high pulley with a rope or straight bar, arms straight out in front at shoulder height, slight forward lean from the hips, knees unlocked.",
            exec: "Keeping your elbows completely straight, sweep the bar down in an arc until it reaches your thighs. Squeeze your lats hard for one second, then let it rise back slowly.",
            apt: "Tailbone tucked slightly, glutes lightly squeezed, ribs down. Because you are leaning forward, your lower back will want to arch — do not let it.",
            mistake: "Bending the elbows, which turns a pure lat isolation into a weak pulldown.",
            anim: "straightArmPulldown",
            video: "https://www.youtube.com/results?search_query=straight+arm+pulldown+lat+form"
          },
          {
            id: "d2e5", name: "Face Pulls", machine: "Cable Machine (Eye-Level Rope)", log: true, restSec: 60,
            substitute: "Reverse pec deck, or band pull-aparts at face height",
            setup: "Set the pulley at eye level with a rope. Grab the rope with your thumbs pointing backwards and step back into a staggered stance.",
            exec: "Pull the centre of the rope towards your forehead while rotating your wrists backwards into a double bicep pose. Squeeze your rear delts and upper back for one second. Return slowly.",
            apt: "Staggered stance, glutes squeezed, ribcage stacked directly over your pelvis. This is the single best exercise for undoing 8 hours of desk hunch, so it is worth doing properly rather than heavy.",
            mistake: "Going too heavy and turning it into a row to the chest. Light weight, high reps, rope to the forehead.",
            anim: "facePull",
            video: "https://www.youtube.com/results?search_query=cable+face+pulls+form"
          },
          {
            id: "d2e6", name: "Dumbbell Bicep Curl", machine: "Dumbbells", log: true, restSec: 60,
            substitute: "Cable curl, or the preacher curl machine",
            setup: "Stand tall with a dumbbell in each hand, palms facing forward, elbows pinned to your sides.",
            exec: "Curl both dumbbells up through a full range, squeeze the biceps hard at the top, and lower over three full seconds until your arms are completely straight.",
            apt: "Squeeze your glutes so you never lean backwards and arch your lower back to heave the weight up. If your body is swinging, drop the weight by 2 kg — nobody has ever built biceps with momentum.",
            mistake: "Swinging the torso and only doing the top half of the rep. Full extension at the bottom is where biceps grow.",
            anim: "bicepCurl",
            video: "https://www.youtube.com/results?search_query=dumbbell+bicep+curl+strict+form"
          },
          {
            id: "d2e7", name: "Preacher / Incline Hammer Curl", machine: "Cult Preacher Curl Pad or Incline Bench", log: true, restSec: 60,
            substitute: "Seated incline dumbbell curl on a 45-degree bench",
            setup: "Rest the backs of your upper arms flat on the preacher pad, or sit back on a 45-degree incline bench and let your arms hang straight down with a neutral grip.",
            exec: "Curl up with your upper arms staying completely still on the pad, squeeze at the top, then lower over three seconds to a dead-straight arm.",
            apt: "Because your arms are fixed, this is one of the few exercises where you cannot cheat with your back — which is exactly why it is here at the end of the session when you are tired.",
            mistake: "Lifting the elbows off the pad to get past the hard part of the rep.",
            anim: "preacherCurl",
            video: "https://www.youtube.com/results?search_query=preacher+curl+proper+form"
          }
        ]
      },
      {
        id: "d2b3", type: "apt", name: "APT Correction Block", dur: "20 min",
        note: "Anti-extension and glute work. Your upper back just worked hard; now lock the pelvis in underneath it.",
        exercises: [
          {
            id: "d2a1", name: "RKC Plank", machine: "Floor Mat", fixed: true, sets: 3, reps: "45-60 sec hold", restSec: 60,
            substitute: "Standard forearm plank with an aggressive tailbone tuck",
            setup: "Forearm plank with elbows directly beneath your shoulders and feet hip-width apart.",
            exec: "Tuck your tailbone aggressively under into a posterior tilt, squeeze your glutes and quads at maximum force, and try to pull your elbows towards your toes. Breathe shallowly but do not hold your breath. 45-60 seconds of maximum tension.",
            apt: "This rewires your resting posture more directly than almost anything else, because it trains your glutes and abs to hold a posterior tilt against gravity. A normal relaxed 3-minute plank does almost nothing for APT; 45 brutal seconds of this does.",
            mistake: "Letting the belly and hips sag towards the mat, which is literally practising APT. If you can hold it past 60 seconds comfortably, you are not squeezing hard enough.",
            anim: "rkcPlank",
            video: "https://www.youtube.com/results?search_query=rkc+plank+proper+form"
          },
          {
            id: "d2a2", name: "Bird Dog", machine: "Floor Mat", fixed: true, sets: 3, reps: "10 reps / side", restSec: 45,
            substitute: "Dead bug, if wrists or knees complain",
            setup: "Kneel on all fours with hands directly under your shoulders and knees directly under your hips. Back flat.",
            exec: "Brace your core, then extend your right arm forward and left leg straight back until both are parallel with the floor. Hold two seconds, return, switch sides. 10 per side.",
            apt: "Do not lift the leg higher than hip height. Going higher feels more impressive but it comes entirely from arching your lower back, which trains the APT instead of fixing it. Imagine balancing a glass of water on your lower back the whole time.",
            mistake: "Rushing and rotating the hips open. Slow, square hips, leg no higher than hip level.",
            anim: "birdDog",
            video: "https://www.youtube.com/results?search_query=bird+dog+exercise+proper+form"
          },
          {
            id: "d2a3", name: "Hip Thrust", machine: "Bench + Barbell or Glute Drive Machine", fixed: true, sets: 3, reps: "12-15 reps (2s hold)", restSec: 60,
            substitute: "Bodyweight glute bridge on the floor, 3 x 20",
            setup: "Rest your upper back, around the bottom of your shoulder blades, against a bench with a padded barbell across your hips, or use the glute drive machine. Feet flat, shins vertical at the top.",
            exec: "Keep your chin tucked and eyes forward. Drive through your heels to lift your hips until your thighs are parallel to the floor and your body makes a straight line from knees to shoulders. Hold the squeeze two seconds, lower under control.",
            apt: "Chin tucked and ribs down is what forces the glutes to do the work instead of your lower back. At the top you should feel it 100% in the glutes. Strong glutes are what hold your pelvis in neutral all day — this is the strengthening half of the APT fix.",
            mistake: "Looking up at the ceiling and finishing with a big lower-back arch instead of a glute squeeze.",
            anim: "hipThrust",
            video: "https://www.youtube.com/results?search_query=barbell+hip+thrust+proper+form"
          }
        ]
      },
      {
        id: "d2b4", type: "cardio", name: "Cardio Finisher", dur: "0-20 min (phase dependent)",
        note: "Same rules as Day 1. Easy pace, phase-dependent duration.",
        exercises: [
          {
            id: "d2c1", name: "Cross-Trainer", machine: "Elliptical / Cross-Trainer", fixed: true, sets: 1, reps: "Per phase (0-20 min)", restSec: 0,
            substitute: "Incline treadmill walk",
            setup: "Moderate resistance, upright posture, light grip on the handles.",
            exec: "Steady conversational pace for the phase duration.",
            apt: "Stand tall rather than hanging off the handles — slumping forward here just rehearses desk posture with your heart rate up.",
            mistake: "Cranking the resistance so high it becomes a leg workout the day before leg day.",
            anim: "crossTrainer",
            video: "https://www.youtube.com/results?search_query=cross+trainer+elliptical+proper+form"
          }
        ]
      },
      {
        id: "d2b5", type: "cooldown", name: "Cool-Down & Stretch", dur: "10 min",
        exercises: [
          {
            id: "d2s1", name: "Lat Stretch on Rack", machine: "Rack Upright or Bar", fixed: true, sets: 2, reps: "30 sec / side", restSec: 0,
            substitute: "Child's pose with a side reach",
            setup: "Hold a rack upright at waist height with one hand, then sit your hips back and away from it.",
            exec: "Let your hips sink back and down until you feel a long stretch down the side of your back. Hold 30 seconds, breathing out. Switch sides.",
            apt: "Keep your ribs down and pelvis neutral rather than letting your lower back hollow out to deepen the stretch.",
            mistake: "Bouncing. Hold and breathe.",
            anim: "latStretch",
            video: "https://www.youtube.com/results?search_query=lat+stretch+rack+form"
          },
          {
            id: "d2s2", name: "Half-Kneeling Hip Flexor Stretch", machine: "Floor Mat", fixed: true, sets: 2, reps: "60 sec / side", restSec: 0,
            substitute: "Couch stretch with the rear foot on a bench",
            setup: "Kneel on one knee, other foot planted in front at 90 degrees, torso vertical.",
            exec: "Tuck the tailbone FIRST, squeeze the kneeling-side glute, then shift forward two inches. 60 seconds per side.",
            apt: "Every day, both sides, no exceptions. Tuck first, then move — the tuck is what actually lengthens the psoas.",
            mistake: "Deep lunging with an arched back.",
            anim: "hipFlexorStretch",
            video: "https://www.youtube.com/results?search_query=half+kneeling+hip+flexor+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d2s3", name: "Thoracic Extension Opener", machine: "Foam Roller", fixed: true, sets: 1, reps: "10 reps + 30 sec hold", restSec: 0,
            substitute: "Doorway pec stretch",
            setup: "Lie with a foam roller across your mid-back, hands supporting your head, knees bent.",
            exec: "Extend gently back over the roller 10 times, then hold the last one for 30 seconds, breathing deeply.",
            apt: "Keep your ribs from flaring and your glutes lightly squeezed. You want the extension in your mid-back, not in your lower back — that distinction is the entire point.",
            mistake: "Letting the roller slide down to the lower back and cranking there. Mid-back only.",
            anim: "thoracicOpener",
            video: "https://www.youtube.com/results?search_query=foam+roller+thoracic+extension+mobility"
          }
        ]
      }
    ]
  },

  /* ====================================================================== */
  {
    day: 3,
    dow: "Wednesday",
    name: "Day 3: Legs",
    focus: "Glute Activation, Hamstrings & Quads",
    summary:
      "Legs are your biggest muscle group, so this is your highest calorie-burning session of the week. It is also APT work in disguise: every exercise here is chosen to strengthen glutes and hamstrings, which are the two muscles that pull your pelvis back into neutral.",
    blocks: [
      {
        id: "d3b1", type: "warmup", name: "Warm-Up", dur: "10 min",
        note: "Never load a cold hip. Glutes in particular need waking up because sitting all day switches them off.",
        exercises: [
          {
            id: "d3w1", name: "Stationary Bike", machine: "Upright Bike", fixed: true, sets: 1, reps: "5 min easy", restSec: 0,
            substitute: "Treadmill walk, 5 min at 4% incline",
            setup: "Seat height so your knee has a slight bend at the bottom. Light resistance.",
            exec: "Five easy minutes to get blood into the quads, hamstrings and hips.",
            apt: "Sit upright on your sit bones instead of slumping onto your tailbone.",
            mistake: "Going hard and arriving at the leg press already tired.",
            anim: "bikeCycle",
            video: "https://www.youtube.com/results?search_query=stationary+bike+warm+up+leg+day"
          },
          {
            id: "d3w2", name: "Bodyweight Glute Bridge", machine: "Floor Mat", fixed: true, sets: 2, reps: "20 reps", restSec: 30,
            substitute: "Standing glute squeezes, 2 x 20",
            setup: "On your back, knees bent, heels close to your glutes.",
            exec: "Flatten the lower back, then bridge up to a straight line and squeeze hard for one second. 20 reps.",
            apt: "This is your glute activation. After 8 hours of sitting your glutes are effectively asleep, and if you go straight into a leg press they stay asleep while your quads and lower back take over.",
            mistake: "Skipping it and wondering why you feel leg day in your lower back.",
            anim: "gluteBridge",
            video: "https://www.youtube.com/results?search_query=glute+bridge+activation+warm+up"
          },
          {
            id: "d3w3", name: "Walking Knee Hugs & Leg Swings", machine: "Open Floor", fixed: true, sets: 2, reps: "10 / side each", restSec: 30,
            substitute: "Standing hip circles, 10 per side",
            setup: "Stand tall with space in front of you.",
            exec: "Walk forward hugging one knee to your chest per step for 10 per side. Then hold a rack and swing each leg forward and back 10 times, then side to side 10 times.",
            apt: "Keep your standing pelvis level and glute lightly squeezed instead of letting your lower back arch as the leg swings back.",
            mistake: "Forcing the range with momentum. Controlled swings, growing gradually.",
            anim: "kneeHug",
            video: "https://www.youtube.com/results?search_query=leg+swings+dynamic+warm+up"
          },
          {
            id: "d3w4", name: "Bodyweight Squat", machine: "Bodyweight", fixed: true, sets: 2, reps: "15 reps", restSec: 30,
            substitute: "Light goblet squat, 2 x 12",
            setup: "Feet shoulder-width, toes slightly out, arms forward for balance.",
            exec: "Squat down as far as you can with a tall chest and a neutral spine, then stand and squeeze your glutes at the top. 15 reps.",
            apt: "At the top, finish by squeezing your glutes and tucking your tailbone slightly, not by pushing your hips forward into an arch.",
            mistake: "Letting the knees cave in. Push them out over your toes.",
            anim: "squat",
            video: "https://www.youtube.com/results?search_query=bodyweight+squat+proper+form"
          }
        ]
      },
      {
        id: "d3b2", type: "main", name: "Main Lifts & Accessories", dur: "55 min",
        note: "Glutes and hamstrings are biased deliberately over quads. That is both the aesthetic you want at 68 kg and the fix for your pelvis.",
        exercises: [
          {
            id: "d3e1", name: "Leg Press (High Foot Placement)", machine: "Cult Leg Press Machine", log: true, restSec: 120,
            substitute: "Hack squat, or goblet squats if the press is taken",
            setup: "Sit firmly against the backrest with your hips all the way back. Place your feet shoulder-width apart on the UPPER half of the platform — this biases glutes and hamstrings rather than just quads.",
            exec: "Disengage the safety bars, lower the sled slowly until your knees reach about 90 degrees, then drive through your heels to press back up without locking your knees out hard at the top.",
            apt: "Never lower so deep that your tailbone curls off the seat pad. The moment your pelvis tucks under and your lower back rounds away from the pad, you are loading your lumbar discs instead of your legs. Keep your sacrum glued down and stop the rep an inch above where that happens.",
            mistake: "Chasing depth. Your safe range ends where your pelvis starts moving, and that is non-negotiable regardless of what the person next to you is doing.",
            anim: "legPress",
            video: "https://www.youtube.com/results?search_query=leg+press+high+foot+placement+glutes"
          },
          {
            id: "d3e2", name: "Romanian Deadlift (Dumbbells)", machine: "Dumbbells", log: true, restSec: 120,
            substitute: "Seated or lying leg curl if your lower back is fatigued",
            setup: "Stand tall holding dumbbells against the front of your thighs. Unlock your knees to about a 15-degree bend and keep them there for the whole set.",
            exec: "Push your hips straight backwards towards the wall behind you while sliding the dumbbells down the front of your shins. Go until you feel a strong hamstring stretch, roughly mid-shin, then drive your hips forward and squeeze your glutes to stand up.",
            apt: "Your spine stays in one neutral line throughout — the movement is entirely at the hip. At the top, finish by squeezing your glutes and stopping at full hip extension; do not lean backwards past standing, which is just an arched lumbar finish. This is the best hamstring and glute builder you have, and strong hamstrings pull the back of your pelvis down into neutral.",
            mistake: "Turning it into a squat by bending the knees, or rounding the lower back at the bottom to reach further down. Range is limited by your hamstring flexibility, not your willpower.",
            anim: "rdl",
            video: "https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form"
          },
          {
            id: "d3e3", name: "Leg Extension", machine: "Cult Leg Extension Machine", log: true, restSec: 75,
            substitute: "Goblet squat, or sissy squat",
            setup: "Adjust the backrest so the backs of your knees sit flush against the seat edge, with the ankle pad resting just above your feet.",
            exec: "Grip the side handles, extend your legs fully until straight, hold the quad squeeze for one second, then lower over three seconds.",
            apt: "Pull yourself down into the seat using the side handles so your pelvis stays flat and neutral. Do not let your hips lift off the seat as you extend — that is your lower back helping and it defeats the purpose.",
            mistake: "Slamming into full extension with heavy weight. Controlled, with a pause at the top.",
            anim: "legExtension",
            video: "https://www.youtube.com/results?search_query=leg+extension+machine+proper+form"
          },
          {
            id: "d3e4", name: "Lying Hamstring Curl", machine: "Cult Lying Leg Curl Machine", log: true, restSec: 75,
            substitute: "Seated leg curl, or dumbbell RDL at lighter weight",
            setup: "Lie face down with your kneecaps just clear of the bench edge and the roller pad resting on your lower calves. Hold the handles.",
            exec: "Curl the pad up towards your glutes, pause one second at peak contraction, and lower slowly over three seconds without letting the weight crash down.",
            apt: "CRITICAL FOR APT: press your hips and pubic bone down into the pad before every single rep. If your butt rises as you curl, your lower back is doing the work and you are reinforcing the arch. Hips down, hamstrings up.",
            mistake: "Letting the hips pop up at the top of every rep, which is the single most common error on this machine.",
            anim: "legCurl",
            video: "https://www.youtube.com/results?search_query=lying+leg+curl+proper+form"
          },
          {
            id: "d3e5", name: "Bulgarian Split Squat", machine: "Dumbbells + Flat Bench", log: true, restSec: 90, repsOverride: "10 reps / leg",
            substitute: "Walking lunges, or a static split squat holding the rack",
            setup: "Stand about two feet in front of a flat bench and rest the top of your back foot on it. Hold a dumbbell in each hand.",
            exec: "Lower your back knee towards the floor with a slight 15-degree forward torso lean to load the front glute. Drive up through your front heel. 10 reps, then switch legs.",
            apt: "This is a two-for-one: the front glute is strengthening while the rear leg's hip flexor gets an active stretch under load, which is one of the most effective ways to lengthen a tight psoas. Keep your ribs down and your tailbone slightly tucked so the rear hip actually gets the stretch.",
            mistake: "Standing too close to the bench, which crushes the front knee and removes the hip flexor stretch. Two feet of space minimum.",
            anim: "splitSquat",
            video: "https://www.youtube.com/results?search_query=bulgarian+split+squat+glute+focus+form"
          },
          {
            id: "d3e6", name: "Hip Abduction", machine: "Cult Hip Abduction Machine", log: true, restSec: 60,
            substitute: "Banded lateral walks, 3 x 20 steps each way",
            setup: "Sit with the pads against the outside of your knees. Lean forward slightly from the hips, which biases the upper glute.",
            exec: "Push your knees apart against the pads, hold the squeeze for one second at the widest point, then return slowly against the resistance.",
            apt: "Your glute medius, trained here, is what stops your pelvis dropping and rotating when you stand and walk. A weak glute medius shows up as a hip that drifts forward — directly related to your tilt.",
            mistake: "Using momentum and bouncing the pads open. Slow out, slow back.",
            anim: "hipAbduction",
            video: "https://www.youtube.com/results?search_query=hip+abduction+machine+glute+form"
          },
          {
            id: "d3e7", name: "Standing Calf Raise", machine: "Calf Raise Machine or Step + Dumbbells", log: true, restSec: 45, repsOverride: "15-20 reps",
            substitute: "Single-leg calf raise on a step holding a dumbbell",
            setup: "Balls of your feet on the platform edge, heels hanging free, legs straight.",
            exec: "Drop your heels down for a deep stretch, then rise all the way onto your toes and squeeze for one second. Full range, 15-20 reps.",
            apt: "Stand tall with ribs stacked. Do not bounce by pumping your hips and lower back — the movement happens at the ankle only.",
            mistake: "Tiny bouncing half-reps. Full stretch at the bottom, full squeeze at the top.",
            anim: "calfRaise",
            video: "https://www.youtube.com/results?search_query=standing+calf+raise+full+range+form"
          }
        ]
      },
      {
        id: "d3b3", type: "apt", name: "APT Correction Block", dur: "20 min",
        note: "Your hip flexors just worked hard on every leg exercise. This block tilts the balance straight back towards the glutes and deep core.",
        exercises: [
          {
            id: "d3a1", name: "Weighted Glute Bridge", machine: "Floor Mat + Plate/Dumbbell", fixed: true, sets: 3, reps: "15 reps (2s hold)", restSec: 60,
            substitute: "Bodyweight glute bridge, 3 x 25",
            setup: "On your back, knees bent, heels close, with a plate or dumbbell held across your hips.",
            exec: "Flatten the lower back first, then drive through the heels to a straight line and hold the squeeze for two seconds.",
            apt: "Ribs stay down. Stop at the straight line, never above it. If you feel this in your lower back rather than your glutes, you are hyperextending — reduce the height.",
            mistake: "Over-bridging into a lumbar arch to get the plate higher.",
            anim: "gluteBridge",
            video: "https://www.youtube.com/results?search_query=weighted+glute+bridge+form"
          },
          {
            id: "d3a2", name: "Supine Pelvic Tilt", machine: "Floor Mat", fixed: true, sets: 3, reps: "15 reps (3s hold)", restSec: 45,
            substitute: "Standing wall pelvic tilt",
            setup: "On your back, knees bent, feet flat.",
            exec: "Exhale, tighten lower abs and glutes, roll the pelvis back so the lower back presses completely flat. Hold three seconds. 15 reps.",
            apt: "After a heavy leg session your pelvis will want to sit in an exaggerated tilt. This resets it before you walk out of the gym.",
            mistake: "Pushing through the feet instead of rolling with the abs.",
            anim: "pelvicTilt",
            video: "https://www.youtube.com/results?search_query=supine+pelvic+tilt+exercise"
          },
          {
            id: "d3a3", name: "Deadbug", machine: "Floor Mat", fixed: true, sets: 3, reps: "12 reps / side", restSec: 45,
            substitute: "Heel slides with the back pinned flat",
            setup: "On your back, arms to the ceiling, knees bent 90 degrees over the hips.",
            exec: "Press the lower back flat, extend opposite arm and leg slowly while breathing out, return, switch. 12 per side.",
            apt: "The deep core is what holds the pelvis where your glutes put it. Back flat at all times.",
            mistake: "Extending so far that the lower back lifts.",
            anim: "deadbug",
            video: "https://www.youtube.com/results?search_query=deadbug+exercise+anterior+pelvic+tilt"
          }
        ]
      },
      {
        id: "d3b4", type: "cardio", name: "Cardio Finisher", dur: "0-15 min (phase dependent)",
        note: "Keep it short and flat after a heavy leg day — your legs are the thing that needs to recover for Day 6.",
        exercises: [
          {
            id: "d3c1", name: "Flat Treadmill Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "Per phase (0-15 min)", restSec: 0,
            substitute: "Easy stationary bike",
            setup: "5 km/h, 0-2% incline only today.",
            exec: "Easy flat walk to flush the legs. No incline after heavy leg work.",
            apt: "Tall posture, ribs over pelvis.",
            mistake: "Doing incline work here and trashing your legs before Day 6.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=cool+down+walk+after+leg+day"
          }
        ]
      },
      {
        id: "d3b5", type: "cooldown", name: "Cool-Down & Stretch", dur: "10 min",
        exercises: [
          {
            id: "d3s1", name: "Standing Quad Stretch", machine: "Rack for Balance", fixed: true, sets: 2, reps: "45 sec / side", restSec: 0,
            substitute: "Side-lying quad stretch on the mat",
            setup: "Hold a rack for balance, grab one ankle and pull your heel towards your glute.",
            exec: "Tuck your tailbone under first, then pull the heel in. Hold 45 seconds per side.",
            apt: "The tuck is what makes this reach the hip flexor rather than just the quad. Without it you will arch your back and feel almost nothing useful.",
            mistake: "Arching the lower back and letting the knee drift forward.",
            anim: "quadStretch",
            video: "https://www.youtube.com/results?search_query=standing+quad+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d3s2", name: "Half-Kneeling Hip Flexor Stretch", machine: "Floor Mat", fixed: true, sets: 2, reps: "60 sec / side", restSec: 0,
            substitute: "Couch stretch",
            setup: "Kneel on one knee, other foot planted in front, torso vertical.",
            exec: "Tuck tailbone, squeeze the kneeling glute, shift forward two inches. 60 seconds per side.",
            apt: "Longest and most important stretch of leg day. Tuck first, always.",
            mistake: "Deep lunge with an arched back.",
            anim: "hipFlexorStretch",
            video: "https://www.youtube.com/results?search_query=half+kneeling+hip+flexor+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d3s3", name: "Seated Hamstring Stretch", machine: "Floor Mat", fixed: true, sets: 2, reps: "45 sec / side", restSec: 0,
            substitute: "Standing single-leg hamstring stretch on a low bench",
            setup: "Sit on the mat with one leg straight and the other bent, foot tucked in.",
            exec: "Hinge forward from the hips with a flat back, reaching towards the toes of the straight leg. Hold 45 seconds, switch.",
            apt: "Hinge at the hip, do not round your lower back to reach further. Tight hamstrings is common in APT and lengthening them helps the pelvis sit level.",
            mistake: "Rounding the spine to touch the toes. Flat back, less range, better stretch.",
            anim: "hamstringStretch",
            video: "https://www.youtube.com/results?search_query=seated+hamstring+stretch+flat+back"
          },
          {
            id: "d3s4", name: "Figure-4 Glute Stretch", machine: "Floor Mat", fixed: true, sets: 1, reps: "45 sec / side", restSec: 0,
            substitute: "Seated figure-4 in a chair",
            setup: "Lie on your back, cross your right ankle over your left knee to make a figure 4.",
            exec: "Pull the left knee towards your chest until you feel the stretch deep in the right glute. Hold 45 seconds, switch sides.",
            apt: "Keep your lower back flat on the mat as you pull the knee in — this is also a gentle check that your pelvis can sit neutral.",
            mistake: "Letting the hips roll and lifting the back off the mat.",
            anim: "figure4",
            video: "https://www.youtube.com/results?search_query=figure+4+glute+stretch+supine"
          }
        ]
      }
    ]
  },

  /* ====================================================================== */
  {
    day: 4,
    dow: "Thursday",
    name: "Day 4: Core & APT",
    focus: "Anterior Pelvic Tilt Correction & Deep Core Bracing",
    summary:
      "The dedicated posture day, and the most important session of the week for how you will look and feel standing still. Nothing here is heavy. All of it is precise. This is the day that changes your resting posture, and it follows the full Release → Stretch → Strengthen → Re-pattern order for a reason — you cannot strengthen a muscle into a position that a tight muscle will not let it reach.",
    blocks: [
      {
        id: "d4b1", type: "warmup", name: "Warm-Up & Breathing Reset", dur: "10 min",
        note: "Today starts with breathing, not with movement. Your diaphragm position and your pelvis position are directly linked.",
        exercises: [
          {
            id: "d4w1", name: "Treadmill Brisk Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "5 min @ 5.5 km/h", restSec: 0,
            substitute: "Cross-trainer, 5 min",
            setup: "5.5 km/h, 2-4% incline.",
            exec: "Five minutes to warm up the tissue before mobility work. Cold stretching does very little.",
            apt: "Practise walking tall: ribs over pelvis, glutes lightly engaged, tailbone very slightly tucked.",
            mistake: "Stretching cold and wondering why nothing lengthens.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=treadmill+warm+up+before+mobility"
          },
          {
            id: "d4w2", name: "90/90 Breathing", machine: "Floor Mat + Wall", fixed: true, sets: 3, reps: "5 breaths", restSec: 30,
            substitute: "Supine 90/90 with feet on a bench",
            setup: "Lie on your back with your feet flat on a wall, hips and knees both bent at 90 degrees. Arms reaching towards the ceiling.",
            exec: "Push gently into the wall with your heels, tuck your tailbone, and feel your lower back flatten. Breathe in through your nose for 4 seconds, then exhale fully through your mouth for 8 seconds, letting your ribs drop down. Five full breaths per set.",
            apt: "This is the foundation of the whole correction. In APT your ribs flare up and your diaphragm sits in a bad position, which makes a neutral pelvis almost impossible to hold. The long exhale physically pulls your ribcage down over your pelvis and switches your deep core on. If you only ever did one APT drill, it would be this one.",
            mistake: "Breathing into your chest and shoulders. The exhale should feel like your ribs are closing down like an umbrella.",
            anim: "breathing90",
            video: "https://www.youtube.com/results?search_query=90+90+breathing+exercise+pelvic+tilt"
          },
          {
            id: "d4w3", name: "Cat-Camel", machine: "Floor Mat", fixed: true, sets: 2, reps: "10 reps", restSec: 30,
            substitute: "Standing pelvic tilts",
            setup: "On all fours, hands under shoulders, knees under hips.",
            exec: "Slowly round your whole spine up towards the ceiling, tucking your tailbone, then slowly reverse into a gentle arch. 10 slow controlled reps through the full range.",
            apt: "Deliberately feel both ends of the range. Most people in APT genuinely cannot find the 'cat' end — the rounded, tailbone-tucked position. That missing end of the range is your problem, so spend longer there.",
            mistake: "Rushing. Three seconds in each direction minimum.",
            anim: "catCamel",
            video: "https://www.youtube.com/results?search_query=cat+camel+exercise+spine+mobility"
          }
        ]
      },
      {
        id: "d4b2", type: "main", name: "Release & Stretch (Step 1 + 2)", dur: "20 min",
        note: "Open the tight structures first. Trying to strengthen your glutes while your hip flexors are locked short is like pulling a rope that is tied to a wall.",
        exercises: [
          {
            id: "d4e1", name: "Foam Roll Quads & Hip Flexors", machine: "Foam Roller", fixed: true, sets: 1, reps: "90 sec / side", restSec: 0,
            substitute: "Massage ball or a water bottle",
            setup: "Lie face down with the roller under the front of one thigh, high up near the hip.",
            exec: "Roll slowly from just above the knee up to the front of the hip. When you find a tender spot, stop there and breathe for 20-30 seconds until it eases. 90 seconds per side.",
            apt: "Your rectus femoris and psoas have been held short for 8 hours a day for years. Rolling does not permanently lengthen them, but it does reduce the tone enough that the stretch that follows actually works. Release, then stretch — that order matters.",
            mistake: "Rolling fast like a rolling pin. Slow, and pause on the sore spots.",
            anim: "foamRollQuad",
            video: "https://www.youtube.com/results?search_query=foam+roll+hip+flexor+quad+release"
          },
          {
            id: "d4e2", name: "Half-Kneeling Hip Flexor Stretch", machine: "Floor Mat", fixed: true, sets: 3, reps: "60 sec / side", restSec: 15,
            substitute: "Couch stretch with the rear foot on a bench",
            setup: "Kneel on one knee with a folded mat underneath, other foot planted in front at 90 degrees, torso completely vertical.",
            exec: "Step 1: tuck your tailbone under hard into a posterior tilt. Step 2: squeeze the glute of the kneeling leg at full force — this reciprocally relaxes the hip flexor. Step 3: only now shift forward about two inches. Hold 60 seconds breathing out slowly. Three rounds per side.",
            apt: "The most important stretch of the entire 90 days, done here three times per side. The order is everything: tuck, squeeze, then move. Done this way you will feel it high in the front of the hip, which is the psoas. Done with an arched back you will feel it in the lumbar spine, which is useless and makes things worse.",
            mistake: "Leaning forward into a deep lunge. If you can go a long way forward, your pelvis is not tucked.",
            anim: "hipFlexorStretch",
            video: "https://www.youtube.com/results?search_query=half+kneeling+hip+flexor+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d4e3", name: "Couch Stretch", machine: "Bench or Wall", fixed: true, sets: 2, reps: "60 sec / side", restSec: 15,
            substitute: "Half-kneeling stretch with the rear knee further back",
            setup: "Kneel with your rear shin flat against a bench or wall so the knee is bent fully and the foot is up. Front foot planted.",
            exec: "Tuck your tailbone, squeeze the rear glute, then bring your torso upright. Hold 60 seconds per side. This is an advanced progression — build into it over the weeks.",
            apt: "By bending the knee fully you add the rectus femoris to the stretch, which crosses both knee and hip and is a major contributor to the tilt that the standard stretch partly misses.",
            mistake: "Going straight to a fully upright torso. Start leaning forward and work up to vertical over several weeks.",
            anim: "couchStretch",
            video: "https://www.youtube.com/results?search_query=couch+stretch+hip+flexor+progression"
          },
          {
            id: "d4e4", name: "Seated Hamstring Stretch", machine: "Floor Mat", fixed: true, sets: 2, reps: "45 sec / side", restSec: 0,
            substitute: "Standing hamstring stretch with the foot on a bench",
            setup: "Sit with one leg straight, the other bent with the foot tucked in.",
            exec: "Hinge forward from the hip with a flat back, reaching towards the toes. 45 seconds per side.",
            apt: "Hinge at the hip with a neutral spine. Tight hamstrings often coexist with APT because they are being stretched all day by the tilt — they are long and tight rather than short and tight, so stretch them gently and prioritise strengthening them instead.",
            mistake: "Rounding the back to reach the toes.",
            anim: "hamstringStretch",
            video: "https://www.youtube.com/results?search_query=seated+hamstring+stretch+flat+back"
          }
        ]
      },
      {
        id: "d4b3", type: "apt", name: "Strengthen & Re-pattern (Step 3 + 4)", dur: "40 min",
        note: "Now that the front of the hip is open, teach the glutes and deep core to hold the new position. This block is the actual rewiring.",
        exercises: [
          {
            id: "d4a1", name: "RKC Plank", machine: "Floor Mat", fixed: true, sets: 4, reps: "45-60 sec hold", restSec: 60,
            substitute: "Forearm plank with an aggressive tuck, or on knees",
            setup: "Forearm plank, elbows under shoulders, feet hip-width.",
            exec: "Tuck the tailbone hard, squeeze glutes and quads at 100%, pull your elbows towards your toes. Breathe shallow but keep breathing. 45-60 seconds of maximum tension, four rounds.",
            apt: "This trains your glutes and abs to hold a posterior tilt against gravity, which is exactly the job they have to do when you stand all day. If you can hold it for two minutes, you are not generating enough tension — make 45 seconds brutal instead of making it longer.",
            mistake: "A long relaxed plank with a sagging belly, which is practising the problem.",
            anim: "rkcPlank",
            video: "https://www.youtube.com/results?search_query=rkc+plank+proper+form"
          },
          {
            id: "d4a2", name: "Deadbug", machine: "Floor Mat", fixed: true, sets: 4, reps: "12 reps / side", restSec: 45,
            substitute: "Heel slides, or dead bug with legs only",
            setup: "On your back, arms to the ceiling, knees bent 90 degrees over the hips.",
            exec: "Crush the lower back flat, then extend opposite arm and leg slowly while exhaling. Return under control and switch. 12 per side, four rounds.",
            apt: "This is the anti-extension pattern that teaches your deep core to resist your lower back arching while your limbs move — which is the exact skill you need for walking, lifting and standing without tilting.",
            mistake: "Extending beyond the point where the back stays flat. Range follows control, not the other way round.",
            anim: "deadbug",
            video: "https://www.youtube.com/results?search_query=deadbug+exercise+anterior+pelvic+tilt"
          },
          {
            id: "d4a3", name: "Hip Thrust", machine: "Bench + Barbell or Glute Drive Machine", fixed: true, sets: 4, reps: "12-15 reps (2s hold)", restSec: 90,
            substitute: "Weighted glute bridge on the floor",
            setup: "Upper back on a bench, padded bar across the hips, feet flat, shins vertical at the top.",
            exec: "Chin tucked, drive through the heels to a straight knee-to-shoulder line, hold the glute squeeze two seconds, lower under control. Progressive: add weight weekly.",
            apt: "This is the single strongest glute builder available, and your glutes are the muscle that physically pulls the back of your pelvis down into neutral. Chin tucked and ribs down are what keep the work in the glutes instead of the lower back.",
            mistake: "Looking up and finishing with a lumbar arch rather than a glute squeeze.",
            anim: "hipThrust",
            video: "https://www.youtube.com/results?search_query=barbell+hip+thrust+proper+form"
          },
          {
            id: "d4a4", name: "Cable Pallof Press", machine: "Cable Machine (Chest Height)", fixed: true, sets: 3, reps: "12 reps / side", restSec: 45,
            substitute: "Band Pallof press anchored to a rack",
            setup: "Set the cable at chest height. Stand side-on to the machine, feet shoulder-width, holding the handle at your chest with both hands.",
            exec: "Press the handle straight out in front of your chest and hold for two seconds while the cable tries to rotate you. Bring it back in. 12 per side.",
            apt: "Tailbone tucked and glutes squeezed throughout. This is anti-rotation work, and it trains the deep core in a standing position, which transfers directly to holding your pelvis neutral while you walk around all day.",
            mistake: "Letting the torso twist towards the machine, or standing with an arched back.",
            anim: "pallofPress",
            video: "https://www.youtube.com/results?search_query=pallof+press+proper+form"
          },
          {
            id: "d4a5", name: "Reverse Crunch", machine: "Floor Mat or Decline Bench", fixed: true, sets: 3, reps: "15 reps", restSec: 45,
            substitute: "Supine pelvic tilt with the legs raised",
            setup: "Lie on your back with knees bent and hands by your hips or holding something behind your head.",
            exec: "Curl your knees towards your chest by rolling your pelvis backwards — the movement comes from your pelvis tucking, not from swinging your legs. Lower slowly over three seconds.",
            apt: "This is the exact opposite of a sit-up. Sit-ups train hip flexors, which you want nothing to do with. The reverse crunch trains the lower abs to pull your pelvis into a posterior tilt — literally the muscle action that corrects your tilt.",
            mistake: "Swinging the legs with momentum. If your pelvis is not rolling, you are just doing leg raises.",
            anim: "reverseCrunch",
            video: "https://www.youtube.com/results?search_query=reverse+crunch+lower+abs+pelvic+tilt"
          },
          {
            id: "d4a6", name: "Side Plank", machine: "Floor Mat", fixed: true, sets: 3, reps: "40 sec / side", restSec: 45,
            substitute: "Side plank from the knees",
            setup: "Lie on your side, elbow directly under your shoulder, feet stacked or staggered.",
            exec: "Lift your hips so your body makes one straight line from head to feet. Squeeze the bottom glute. 40 seconds per side.",
            apt: "Trains the obliques and glute medius together, which is the pair that keeps your pelvis level from side to side. Squeeze the bottom glute and keep your ribs down rather than letting your hips sag or rotate.",
            mistake: "Letting the hips drop or rolling forwards onto the chest.",
            anim: "sidePlank",
            video: "https://www.youtube.com/results?search_query=side+plank+proper+form"
          },
          {
            id: "d4a7", name: "Standing Wall Posture Reset", machine: "Flat Wall", fixed: true, sets: 3, reps: "45 sec hold", restSec: 30,
            substitute: "Standing posture reset without a wall, in front of a mirror",
            setup: "Stand with your heels about 10 cm from a wall and your head, shoulder blades and glutes all touching it.",
            exec: "Slide one hand behind your lower back. Now tuck your tailbone and squeeze your glutes until your hand is pinned snugly. Hold that for 45 seconds, breathing out long. Then step away from the wall and try to keep exactly that feeling for 10 steps.",
            apt: "This is the re-patterning step, and it is the one that makes the other six days stick. All the strength in the world does nothing if your brain's default standing position is still a tilt. Finish every APT session by walking away holding the corrected position — that is how a drill becomes a posture.",
            mistake: "Doing the hold and then immediately slumping as you walk off. The 10 steps afterwards are the actual exercise.",
            anim: "wallPostureReset",
            video: "https://www.youtube.com/results?search_query=wall+test+posture+anterior+pelvic+tilt"
          }
        ]
      },
      {
        id: "d4b4", type: "cardio", name: "Cardio Finisher", dur: "15-20 min",
        note: "Longer today because the strength work is lighter. Use it to practise walking in your corrected posture.",
        exercises: [
          {
            id: "d4c1", name: "Incline Treadmill Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "15-20 min", restSec: 0,
            substitute: "Outdoor brisk walk",
            setup: "5-6 km/h at 8-10% incline, hands off the rails.",
            exec: "Walk for 15-20 minutes. Every two minutes, consciously reset: ribs down, tailbone slightly tucked, glutes lightly on.",
            apt: "Incline walking with a tucked pelvis is glute training that also burns calories. This is re-patterning practice with your heart rate up, which makes it stick faster.",
            mistake: "Holding the rails, which lets your hips drift back into a tilt.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=incline+treadmill+walk+glutes+posture"
          }
        ]
      },
      {
        id: "d4b5", type: "cooldown", name: "Cool-Down", dur: "10 min",
        exercises: [
          {
            id: "d4s1", name: "Child's Pose with Side Reach", machine: "Floor Mat", fixed: true, sets: 1, reps: "60 sec + 30 sec / side", restSec: 0,
            substitute: "Seated forward fold",
            setup: "Kneel, sit back on your heels, arms reaching forward.",
            exec: "Sink the hips back and breathe into the lower back for 60 seconds, then walk the hands to each side for 30 seconds.",
            apt: "Decompresses the chronically tight lumbar erectors, which in APT are short and overworked from holding the arch all day.",
            mistake: "Holding your breath.",
            anim: "childPose",
            video: "https://www.youtube.com/results?search_query=childs+pose+stretch+lower+back"
          },
          {
            id: "d4s2", name: "Figure-4 Glute Stretch", machine: "Floor Mat", fixed: true, sets: 1, reps: "45 sec / side", restSec: 0,
            substitute: "Seated figure-4 in a chair",
            setup: "On your back, right ankle crossed over the left knee.",
            exec: "Pull the left knee to your chest, feel the right glute stretch. 45 seconds per side.",
            apt: "Keep the lower back flat on the mat throughout.",
            mistake: "Rolling the hips and lifting the back.",
            anim: "figure4",
            video: "https://www.youtube.com/results?search_query=figure+4+glute+stretch+supine"
          },
          {
            id: "d4s3", name: "90/90 Breathing (Closing)", machine: "Floor Mat + Wall", fixed: true, sets: 2, reps: "5 breaths", restSec: 0,
            substitute: "Supine breathing with knees bent",
            setup: "Feet on the wall, hips and knees at 90 degrees.",
            exec: "Tuck the tailbone, 4-second nasal inhale, 8-second mouth exhale, ribs dropping. Five breaths, twice.",
            apt: "Finish the day the way you started it. Leaving the gym in a rib-down, pelvis-neutral position is what carries the work into the next 23 hours.",
            mistake: "Skipping it because the session already felt done.",
            anim: "breathing90",
            video: "https://www.youtube.com/results?search_query=90+90+breathing+exercise+pelvic+tilt"
          }
        ]
      }
    ]
  },

  /* ====================================================================== */
  {
    day: 5,
    dow: "Friday",
    name: "Day 5: Upper Body",
    focus: "Calisthenics Return & Full Upper Hypertrophy",
    summary:
      "A push-pull combined day that doubles as your return to bodyweight strength. As you drop from 80 kg to 68 kg, your pull-ups will improve dramatically for free — every kilo you lose is a kilo you no longer have to pull. By week 13, unassisted pull-ups are a realistic target.",
    blocks: [
      {
        id: "d5b1", type: "warmup", name: "Warm-Up", dur: "10 min",
        exercises: [
          {
            id: "d5w1", name: "Rowing Machine", machine: "Rower", fixed: true, sets: 1, reps: "5 min easy", restSec: 0,
            substitute: "Treadmill walk, 5 min",
            setup: "Feet strapped, light damper setting.",
            exec: "Five easy minutes. The rower warms up both the pushing and pulling muscles at once, which suits a combined day.",
            apt: "Hinge from your hips with a neutral spine on each stroke rather than rounding or over-arching your lower back.",
            mistake: "Yanking with the arms and rounding the back.",
            anim: "rower",
            video: "https://www.youtube.com/results?search_query=rowing+machine+proper+form+warm+up"
          },
          {
            id: "d5w2", name: "Band Pull-Aparts", machine: "Resistance Band", fixed: true, sets: 2, reps: "20 reps", restSec: 30,
            substitute: "Reverse pec deck, lightest setting",
            setup: "Light band at shoulder width, arms straight ahead.",
            exec: "Pull apart, squeeze the blades, return slowly. 20 reps.",
            apt: "Tailbone tucked, glutes lightly on.",
            mistake: "Shrugging instead of squeezing.",
            anim: "bandPullApart",
            video: "https://www.youtube.com/results?search_query=band+pull+apart+proper+form"
          },
          {
            id: "d5w3", name: "Scapular Pull-Ups", machine: "Pull-Up Bar", fixed: true, sets: 2, reps: "10 reps", restSec: 30,
            substitute: "Dead hang, 2 x 20 sec",
            setup: "Hang with straight arms, shoulder-width overhand grip.",
            exec: "Without bending the elbows, pull the shoulder blades down so your body rises a couple of inches. 10 reps.",
            apt: "Hold a slight hollow body with ribs down rather than hanging in a passive arch.",
            mistake: "Bending the elbows.",
            anim: "scapPullup",
            video: "https://www.youtube.com/results?search_query=scapular+pull+ups+exercise"
          },
          {
            id: "d5w4", name: "Push-Up to Downward Dog", machine: "Floor Mat", fixed: true, sets: 2, reps: "8 reps", restSec: 30,
            substitute: "Knee push-ups, 2 x 10",
            setup: "Start in a push-up position with hands under your shoulders.",
            exec: "Do one controlled push-up, then push your hips up and back into downward dog, pressing your heels towards the floor. Return. Eight reps.",
            apt: "Keep your ribs down in the push-up position so you are not hanging in an arch. The downward dog opens up your hamstrings and calves while the push-up primes your chest.",
            mistake: "Sagging hips in the push-up portion.",
            anim: "pushupDog",
            video: "https://www.youtube.com/results?search_query=push+up+to+downward+dog+warm+up"
          }
        ]
      },
      {
        id: "d5b2", type: "main", name: "Main Lifts & Accessories", dur: "55 min",
        note: "Alternate push and pull so each muscle group rests while the other works. This lets you move through eight exercises inside the time.",
        exercises: [
          {
            id: "d5e1", name: "Assisted Pull-Ups", machine: "Cult Assisted Pull-Up Machine", log: true, restSec: 90, repsOverride: "8-10 reps",
            substitute: "Lat pulldown at a weight that limits you to 8-10 reps",
            setup: "Select counterweight assistance — start at 20-25 kg of help at 80 kg bodyweight. Kneel securely on the pad with an overhand grip slightly wider than shoulder-width.",
            exec: "Hang with arms fully extended, pull your shoulder blades down first, then drive your elbows towards your ribs until your chin clears the bar. Lower over three full seconds.",
            apt: "Keep your abs braced in a slight hollow-body position rather than letting your lower back arch and your legs swing forward. Reduce the assistance by 2.5 kg whenever you can complete 10 clean reps — by week 13 at 68 kg you should be close to unassisted.",
            mistake: "Kipping and swinging to get the chin over. A clean assisted rep beats a sloppy unassisted one every time.",
            anim: "pullup",
            video: "https://www.youtube.com/results?search_query=assisted+pull+up+machine+proper+form"
          },
          {
            id: "d5e2", name: "Flat Dumbbell Press", machine: "Flat Bench + Dumbbells", log: true, restSec: 90,
            substitute: "Machine chest press",
            setup: "Flat bench, feet planted, dumbbells above the chest with elbows at 45 degrees from the torso.",
            exec: "Lower slowly until level with the chest, feeling the pec stretch, then press up and in and squeeze.",
            apt: "Pull your bottom ribs down towards your hips so there is no gap under your lower back.",
            mistake: "Flaring elbows to 90 degrees.",
            anim: "benchPressDumbbell",
            video: "https://www.youtube.com/results?search_query=flat+dumbbell+bench+press+form"
          },
          {
            id: "d5e3", name: "Seated Cable Row", machine: "Cult Seated Row Machine", log: true, restSec: 90,
            substitute: "Chest-supported machine row",
            setup: "Feet on the plates, knees slightly bent, sit tall, V-handle in hand.",
            exec: "Pull to the lower stomach, squeeze the blades together for one second, extend slowly.",
            apt: "Pelvis upright, abs braced, torso almost still. No rowing-oar swinging.",
            mistake: "Using the whole torso to move the weight.",
            anim: "seatedRow",
            video: "https://www.youtube.com/results?search_query=seated+cable+row+proper+form"
          },
          {
            id: "d5e4", name: "Seated Dumbbell Shoulder Press", machine: "Adjustable Bench (85°) + Dumbbells", log: true, restSec: 90,
            substitute: "Machine shoulder press",
            setup: "Set the bench to nearly vertical at 85 degrees. Sit with feet planted and dumbbells at shoulder height, elbows angled about 30 degrees forward rather than straight out to the sides.",
            exec: "Press overhead until your arms are almost straight, keeping the dumbbells in the scapular plane. Lower under control to ear level.",
            apt: "Press your lower back into the bench pad and squeeze your glutes BEFORE every rep. The 85-degree bench instead of a fully vertical one exists specifically so you can keep your lumbar flat. Overhead pressing is the biggest APT trap in the gym.",
            mistake: "Letting the lower back arch off the pad on the last few reps.",
            anim: "seatedPressOverhead",
            video: "https://www.youtube.com/results?search_query=seated+dumbbell+shoulder+press+form"
          },
          {
            id: "d5e5", name: "Pec Deck Chest Fly", machine: "Cult Pec Deck Machine", log: true, restSec: 60,
            substitute: "Cable crossover at chest height",
            setup: "Seat at mid-chest height, shoulder blades pinned back.",
            exec: "Wide arc together, squeeze the inner chest one second, return slowly to a stretch.",
            apt: "Ribs down, lower back flat against the backrest.",
            mistake: "Progressively bending the elbows into a press.",
            anim: "pecDeckFly",
            video: "https://www.youtube.com/results?search_query=pec+deck+machine+chest+fly+form"
          },
          {
            id: "d5e6", name: "Face Pulls", machine: "Cable Machine (Eye-Level Rope)", log: true, restSec: 60, repsOverride: "15 reps",
            substitute: "Reverse pec deck",
            setup: "Pulley at eye level, rope, thumbs pointing back, staggered stance.",
            exec: "Pull the rope centre to your forehead while rotating into a double bicep pose. Squeeze one second.",
            apt: "Glutes squeezed, ribcage stacked over the pelvis. Best single exercise for undoing desk hunch.",
            mistake: "Going heavy and turning it into a row.",
            anim: "facePull",
            video: "https://www.youtube.com/results?search_query=cable+face+pulls+form"
          },
          {
            id: "d5e7", name: "Assisted Dips", machine: "Cult Assisted Dip Machine or Parallel Bars", log: true, restSec: 75, repsOverride: "8-12 reps",
            substitute: "Bench dips with feet on the floor, or close-grip push-ups",
            setup: "Set the assistance counterweight and kneel on the pad. Grip the bars with a slight forward torso lean to bias the chest.",
            exec: "Lower until your upper arms are roughly parallel to the floor, then press back up and squeeze. Stop short of a hard lockout.",
            apt: "Hold a slight hollow body with ribs down. Do not let your legs swing forward and your lower back arch, which is the standard dip cheat.",
            mistake: "Going too deep and stressing the shoulder joint. Upper arms parallel is deep enough.",
            anim: "dip",
            video: "https://www.youtube.com/results?search_query=assisted+dip+machine+chest+form"
          },
          {
            id: "d5e8", name: "Superset: Hammer Curl + Rope Pushdown", machine: "Dumbbells + Cable Rope", log: true, restSec: 60, repsOverride: "12 reps each, back to back",
            substitute: "Any curl paired with any tricep extension",
            setup: "Set the dumbbells next to the cable station so you can move between them with no rest.",
            exec: "12 hammer curls with a neutral grip, then immediately 12 rope pushdowns, then rest 60 seconds. That is one set. This saves time and gives a strong arm pump at the end of the session.",
            apt: "Stand tall with glutes squeezed for both halves. By the end of the session you are tired and that is exactly when the lower back starts helping — do not let it.",
            mistake: "Swinging both movements because you are fatigued. Drop the weight and keep the form.",
            anim: "bicepCurl",
            video: "https://www.youtube.com/results?search_query=bicep+tricep+superset+form"
          }
        ]
      },
      {
        id: "d5b3", type: "apt", name: "APT Correction Block", dur: "20 min",
        exercises: [
          {
            id: "d5a1", name: "RKC Plank", machine: "Floor Mat", fixed: true, sets: 3, reps: "45-60 sec hold", restSec: 60,
            substitute: "Forearm plank with an aggressive tuck",
            setup: "Elbows under shoulders, feet hip-width.",
            exec: "Tailbone tucked hard, glutes and quads at 100%, elbows pulling towards toes. 45-60 seconds.",
            apt: "Maximum tension beats maximum duration. Every time.",
            mistake: "A long soft plank with a sagging belly.",
            anim: "rkcPlank",
            video: "https://www.youtube.com/results?search_query=rkc+plank+proper+form"
          },
          {
            id: "d5a2", name: "Deadbug", machine: "Floor Mat", fixed: true, sets: 3, reps: "12 reps / side", restSec: 45,
            substitute: "Heel slides",
            setup: "On your back, arms up, knees at 90 degrees over the hips.",
            exec: "Back pressed flat, extend opposite arm and leg slowly, exhale, return, switch.",
            apt: "Back flat is the whole exercise.",
            mistake: "Over-extending until the back lifts.",
            anim: "deadbug",
            video: "https://www.youtube.com/results?search_query=deadbug+exercise+anterior+pelvic+tilt"
          },
          {
            id: "d5a3", name: "Glute Bridge", machine: "Floor Mat", fixed: true, sets: 3, reps: "20 reps (2s hold)", restSec: 45,
            substitute: "Hip thrust on a bench",
            setup: "On your back, knees bent, heels close.",
            exec: "Flatten the back, bridge to a straight line, hold two seconds, lower slowly.",
            apt: "All glute, no lower back. Stop at the straight line.",
            mistake: "Over-bridging into an arch.",
            anim: "gluteBridge",
            video: "https://www.youtube.com/results?search_query=glute+bridge+for+anterior+pelvic+tilt"
          }
        ]
      },
      {
        id: "d5b4", type: "cardio", name: "Cardio Finisher", dur: "0-20 min (phase dependent)",
        exercises: [
          {
            id: "d5c1", name: "Incline Treadmill Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "Per phase (0-20 min)", restSec: 0,
            substitute: "Cross-trainer",
            setup: "5-6 km/h at 8-10% incline.",
            exec: "Conversational pace for the phase duration.",
            apt: "Tall, ribs down, light glute squeeze, hands off the rails.",
            mistake: "Leaning on the rails.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=incline+treadmill+walk+fat+loss"
          }
        ]
      },
      {
        id: "d5b5", type: "cooldown", name: "Cool-Down & Stretch", dur: "10 min",
        exercises: [
          {
            id: "d5s1", name: "Doorway Pec Stretch", machine: "Doorway or Rack", fixed: true, sets: 2, reps: "30 sec / side", restSec: 0,
            substitute: "Chest stretch over a foam roller",
            setup: "Forearm flat on the frame, elbow at shoulder height.",
            exec: "Step through gently, hold 30 seconds, breathe out. Switch sides.",
            apt: "Ribs down, pelvis neutral — do not arch to feel more.",
            mistake: "Forcing it.",
            anim: "pecStretch",
            video: "https://www.youtube.com/results?search_query=doorway+pec+stretch"
          },
          {
            id: "d5s2", name: "Lat Stretch on Rack", machine: "Rack Upright", fixed: true, sets: 1, reps: "30 sec / side", restSec: 0,
            substitute: "Child's pose with side reach",
            setup: "Hold the upright at waist height and sit your hips back.",
            exec: "Sink back until you feel the stretch down the side of your back. 30 seconds each side.",
            apt: "Ribs down, pelvis neutral.",
            mistake: "Hollowing the lower back to deepen it.",
            anim: "latStretch",
            video: "https://www.youtube.com/results?search_query=lat+stretch+rack+form"
          },
          {
            id: "d5s3", name: "Half-Kneeling Hip Flexor Stretch", machine: "Floor Mat", fixed: true, sets: 2, reps: "60 sec / side", restSec: 0,
            substitute: "Couch stretch",
            setup: "Kneel on one knee, other foot forward, torso vertical.",
            exec: "Tuck, squeeze the glute, shift forward two inches. 60 seconds per side.",
            apt: "Every day, both sides. Tuck first.",
            mistake: "Deep lunge with an arched back.",
            anim: "hipFlexorStretch",
            video: "https://www.youtube.com/results?search_query=half+kneeling+hip+flexor+stretch+posterior+pelvic+tilt"
          }
        ]
      }
    ]
  },

  /* ====================================================================== */
  {
    day: 6,
    dow: "Saturday",
    name: "Day 6: Legs & APT",
    focus: "Posterior Chain & Hip Flexor Lengthening",
    summary:
      "The second leg day, built entirely around the posterior chain — glutes and hamstrings — and around exercises that stretch the hip flexors while loading them. If Day 3 was the heavy leg day, this one is the posture-fixing leg day. It is arguably the most valuable session of your week for the tilt.",
    blocks: [
      {
        id: "d6b1", type: "warmup", name: "Warm-Up", dur: "10 min",
        exercises: [
          {
            id: "d6w1", name: "Stationary Bike", machine: "Upright Bike", fixed: true, sets: 1, reps: "5 min easy", restSec: 0,
            substitute: "Treadmill walk at 4% incline",
            setup: "Light resistance, seat set so the knee has a slight bend at the bottom.",
            exec: "Five easy minutes to get blood into the hips and legs.",
            apt: "Sit upright on the sit bones, not slumped back onto the tailbone.",
            mistake: "Going hard and pre-fatiguing your legs.",
            anim: "bikeCycle",
            video: "https://www.youtube.com/results?search_query=stationary+bike+warm+up+leg+day"
          },
          {
            id: "d6w2", name: "Bodyweight Glute Bridge", machine: "Floor Mat", fixed: true, sets: 2, reps: "20 reps", restSec: 30,
            substitute: "Standing glute squeezes",
            setup: "On your back, knees bent, heels close.",
            exec: "Flatten the back, bridge up, squeeze one second. 20 reps.",
            apt: "Mandatory glute wake-up before you load the hips.",
            mistake: "Skipping it.",
            anim: "gluteBridge",
            video: "https://www.youtube.com/results?search_query=glute+bridge+activation+warm+up"
          },
          {
            id: "d6w3", name: "Leg Swings (Front-Back, Side-Side)", machine: "Rack for Support", fixed: true, sets: 2, reps: "10 / direction / side", restSec: 30,
            substitute: "Standing hip circles",
            setup: "Hold a rack upright for balance.",
            exec: "Swing one leg forward and back 10 times, then across your body side to side 10 times. Switch legs.",
            apt: "Keep the standing hip level and the glute lightly squeezed. Do not let your lower back arch as the leg swings behind you — that is the swing turning into an APT rep.",
            mistake: "Forcing range with momentum.",
            anim: "legSwing",
            video: "https://www.youtube.com/results?search_query=leg+swings+dynamic+warm+up"
          },
          {
            id: "d6w4", name: "Bodyweight Goblet Squat Pattern", machine: "Bodyweight or Light Dumbbell", fixed: true, sets: 2, reps: "12 reps", restSec: 30,
            substitute: "Bodyweight squat",
            setup: "Hold a light dumbbell at your chest, feet shoulder-width.",
            exec: "Squat down between your hips with a tall chest, 12 controlled reps, squeezing the glutes at the top.",
            apt: "Finish each rep with a glute squeeze and a slight tailbone tuck instead of pushing the hips forward into an arch.",
            mistake: "Knees caving in.",
            anim: "gobletSquat",
            video: "https://www.youtube.com/results?search_query=goblet+squat+proper+form"
          }
        ]
      },
      {
        id: "d6b2", type: "main", name: "Main Lifts & Accessories", dur: "55 min",
        note: "Hinge-dominant. Every exercise here either strengthens what pulls your pelvis back to neutral, or stretches what pulls it forward.",
        exercises: [
          {
            id: "d6e1", name: "Goblet Squat", machine: "Heavy Dumbbell or Kettlebell", log: true, restSec: 90,
            substitute: "Leg press with high foot placement, or hack squat",
            setup: "Hold a dumbbell vertically against your chest like a goblet with your elbows pointing down. Feet shoulder-width, toes slightly out.",
            exec: "Sit straight down between your hips, keeping your chest tall and your knees tracking out over your toes. Go as deep as you can without your pelvis tucking under, then drive straight back up and squeeze your glutes.",
            apt: "Holding the weight at the front works as a counterbalance that naturally keeps your pelvis neutral and your core engaged — which is exactly why a goblet squat is a better choice than a back squat for someone correcting APT. A barbell on your back encourages the arch; a weight at your chest fights it.",
            mistake: "Letting the elbows drop forward and the chest collapse, which rounds the lower back at the bottom.",
            anim: "gobletSquat",
            video: "https://www.youtube.com/results?search_query=goblet+squat+proper+form"
          },
          {
            id: "d6e2", name: "Romanian Deadlift (Dumbbells)", machine: "Dumbbells", log: true, restSec: 120,
            substitute: "Barbell RDL, or seated leg curl if the lower back is tired",
            setup: "Stand tall with dumbbells against the front of your thighs, knees unlocked to about 15 degrees.",
            exec: "Push your hips straight back while sliding the dumbbells down your shins. Stop at a strong hamstring stretch around mid-shin, then drive the hips forward and squeeze the glutes hard to stand.",
            apt: "The single best exercise in this plan for your tilt. Strong hamstrings and glutes pull the back of your pelvis down into neutral, and the RDL trains exactly that under load. Finish standing tall with glutes squeezed, never leaning back past vertical.",
            mistake: "Bending the knees into a squat, or rounding the back at the bottom to reach lower. The hamstring stretch sets your range, nothing else.",
            anim: "rdl",
            video: "https://www.youtube.com/results?search_query=dumbbell+romanian+deadlift+form"
          },
          {
            id: "d6e3", name: "Bulgarian Split Squat", machine: "Dumbbells + Flat Bench", log: true, restSec: 90, repsOverride: "10 reps / leg",
            substitute: "Reverse lunges, or a static split squat",
            setup: "Stand two feet in front of a bench with the top of your back foot resting on it. Dumbbell in each hand.",
            exec: "Lower the back knee towards the floor with a slight forward torso lean to load the front glute, then drive up through the front heel. 10 reps per leg.",
            apt: "The best two-for-one in the plan: the front glute strengthens while the rear hip flexor is stretched under load, which is one of the most effective ways to lengthen a stubborn psoas. Keep your ribs down and tailbone slightly tucked so the rear hip actually gets the stretch rather than your lower back taking it.",
            mistake: "Standing too close to the bench, which kills both the depth and the stretch.",
            anim: "splitSquat",
            video: "https://www.youtube.com/results?search_query=bulgarian+split+squat+glute+focus+form"
          },
          {
            id: "d6e4", name: "Barbell Hip Thrust", machine: "Bench + Barbell or Glute Drive Machine", log: true, restSec: 120, repsOverride: "12-15 reps",
            substitute: "Glute drive machine, or weighted glute bridge",
            setup: "Upper back against a bench at the bottom of the shoulder blades, padded barbell across the hips, feet flat with shins vertical at the top.",
            exec: "Chin tucked, eyes forward. Drive through the heels until your thighs are parallel to the floor and your body is a straight line from knees to shoulders. Hold two seconds, lower under control.",
            apt: "This is where you add real load to the correction. Chin tucked and ribs down force 100% glute activation; look up at the ceiling instead and your lower back takes it. Add weight every week — strong glutes under load are what hold your pelvis neutral for 16 waking hours.",
            mistake: "Over-extending at the top into a lumbar arch instead of finishing with a glute squeeze.",
            anim: "hipThrust",
            video: "https://www.youtube.com/results?search_query=barbell+hip+thrust+proper+form"
          },
          {
            id: "d6e5", name: "Lying Hamstring Curl", machine: "Cult Lying Leg Curl Machine", log: true, restSec: 75,
            substitute: "Seated leg curl",
            setup: "Face down, kneecaps just off the bench edge, roller on the lower calves.",
            exec: "Curl towards the glutes, pause one second, lower over three seconds.",
            apt: "Press your hips and pubic bone down into the pad before every rep. If your butt lifts as you curl, your lower back is doing the work.",
            mistake: "Hips popping up at the top of each rep.",
            anim: "legCurl",
            video: "https://www.youtube.com/results?search_query=lying+leg+curl+proper+form"
          },
          {
            id: "d6e6", name: "Hip Abduction", machine: "Cult Hip Abduction Machine", log: true, restSec: 60, repsOverride: "15-20 reps",
            substitute: "Banded lateral walks, 3 x 20 steps each way",
            setup: "Pads against the outside of the knees, slight forward lean from the hips.",
            exec: "Push the knees apart, hold one second at the widest, return slowly against the resistance.",
            apt: "Glute medius keeps your pelvis level side to side. Weak here and your pelvis drifts and rotates, which compounds the forward tilt.",
            mistake: "Bouncing with momentum.",
            anim: "hipAbduction",
            video: "https://www.youtube.com/results?search_query=hip+abduction+machine+glute+form"
          },
          {
            id: "d6e7", name: "Standing Calf Raise", machine: "Calf Machine or Step + Dumbbells", log: true, restSec: 45, repsOverride: "15-20 reps",
            substitute: "Single-leg calf raise on a step",
            setup: "Balls of the feet on the platform edge, heels free, legs straight.",
            exec: "Deep stretch at the bottom, full rise onto the toes, one-second squeeze. 15-20 reps.",
            apt: "Stand tall with ribs stacked. The movement is at the ankle only — no hip pumping.",
            mistake: "Short bouncy half reps.",
            anim: "calfRaise",
            video: "https://www.youtube.com/results?search_query=standing+calf+raise+full+range+form"
          }
        ]
      },
      {
        id: "d6b3", type: "apt", name: "APT Correction Block — Lengthening Focus", dur: "20 min",
        note: "Your hip flexors have been loaded and stretched all session, which makes them maximally receptive now. This is the best 20 minutes of your week for actually lengthening them.",
        exercises: [
          {
            id: "d6a1", name: "Half-Kneeling Hip Flexor Stretch", machine: "Floor Mat", fixed: true, sets: 3, reps: "60 sec / leg", restSec: 15,
            substitute: "Couch stretch with the rear foot on a bench",
            setup: "Kneel on one knee with a folded mat underneath, other foot planted in front at 90 degrees, torso vertical.",
            exec: "Tuck the tailbone under hard. Squeeze the kneeling-side glute at full force. Only then shift forward two inches. Hold 60 seconds, breathing out long. Three rounds per side.",
            apt: "Three full rounds per side, today of all days, because the tissue is warm and has just been loaded through a stretch on the split squats. Tuck, squeeze, then move — in that order, every time.",
            mistake: "Leaning forward into a lunge with an arched back, which compresses your lumbar spine and does nothing for your psoas.",
            anim: "hipFlexorStretch",
            video: "https://www.youtube.com/results?search_query=half+kneeling+hip+flexor+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d6a2", name: "Couch Stretch", machine: "Bench or Wall", fixed: true, sets: 2, reps: "60 sec / side", restSec: 15,
            substitute: "Half-kneeling stretch with the rear knee set further back",
            setup: "Rear shin flat against a bench or wall so the knee is fully bent, front foot planted.",
            exec: "Tuck the tailbone, squeeze the rear glute, bring the torso upright. 60 seconds per side.",
            apt: "The bent knee adds the rectus femoris, which crosses both the hip and the knee and is a major contributor to the tilt that the standard stretch only partly reaches.",
            mistake: "Going fully upright before you are ready. Progress the torso angle over weeks.",
            anim: "couchStretch",
            video: "https://www.youtube.com/results?search_query=couch+stretch+hip+flexor+progression"
          },
          {
            id: "d6a3", name: "Supine Pelvic Tilt", machine: "Floor Mat", fixed: true, sets: 3, reps: "15 reps (3s hold)", restSec: 30,
            substitute: "Standing wall pelvic tilt",
            setup: "On your back, knees bent, feet flat.",
            exec: "Exhale, tighten lower abs and glutes, roll the pelvis back so the lower back flattens completely. Hold three seconds. 15 reps.",
            apt: "Now that the hip flexors are freshly lengthened, your pelvis can reach a true neutral. Use this window to practise finding it — it will feel noticeably easier than it did at the start of the session.",
            mistake: "Pushing with the feet.",
            anim: "pelvicTilt",
            video: "https://www.youtube.com/results?search_query=supine+pelvic+tilt+exercise"
          },
          {
            id: "d6a4", name: "90/90 Breathing", machine: "Floor Mat + Wall", fixed: true, sets: 3, reps: "5 breaths", restSec: 30,
            substitute: "Supine breathing with the knees bent",
            setup: "Feet on the wall, hips and knees at 90 degrees, arms towards the ceiling.",
            exec: "Heels press gently into the wall, tailbone tucked. Inhale 4 seconds through the nose, exhale 8 seconds through the mouth, ribs dropping down. Five breaths, three rounds.",
            apt: "Finishes the week by locking the ribs-over-pelvis position in. Do this and walk out of the gym holding it.",
            mistake: "Chest breathing instead of a full rib-dropping exhale.",
            anim: "breathing90",
            video: "https://www.youtube.com/results?search_query=90+90+breathing+exercise+pelvic+tilt"
          }
        ]
      },
      {
        id: "d6b4", type: "cardio", name: "Cardio Finisher", dur: "0-15 min (phase dependent)",
        exercises: [
          {
            id: "d6c1", name: "Flat or Low-Incline Treadmill Walk", machine: "Treadmill", fixed: true, sets: 1, reps: "Per phase (0-15 min)", restSec: 0,
            substitute: "Easy bike",
            setup: "5 km/h, 0-4% incline.",
            exec: "Easy walk to flush the legs after a hinge-heavy session.",
            apt: "Practise the corrected walking posture: ribs down, tailbone slightly tucked.",
            mistake: "Steep incline on tired hamstrings.",
            anim: "treadmillWalk",
            video: "https://www.youtube.com/results?search_query=cool+down+walk+after+leg+day"
          }
        ]
      },
      {
        id: "d6b5", type: "cooldown", name: "Cool-Down & Stretch", dur: "10 min",
        exercises: [
          {
            id: "d6s1", name: "Standing Quad Stretch", machine: "Rack for Balance", fixed: true, sets: 2, reps: "45 sec / side", restSec: 0,
            substitute: "Side-lying quad stretch",
            setup: "Hold the rack, grab one ankle, heel towards the glute.",
            exec: "Tuck the tailbone first, then pull the heel in. 45 seconds per side.",
            apt: "The tuck is what takes this into the hip flexor instead of leaving it at the quad.",
            mistake: "Arching the back and letting the knee drift forward.",
            anim: "quadStretch",
            video: "https://www.youtube.com/results?search_query=standing+quad+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d6s2", name: "Seated Hamstring Stretch", machine: "Floor Mat", fixed: true, sets: 2, reps: "45 sec / side", restSec: 0,
            substitute: "Standing hamstring stretch with the foot on a bench",
            setup: "One leg straight, the other bent with the foot tucked in.",
            exec: "Hinge forward from the hip with a flat back. 45 seconds per side.",
            apt: "Hinge at the hip, do not round the lower back.",
            mistake: "Rounding the spine to reach the toes.",
            anim: "hamstringStretch",
            video: "https://www.youtube.com/results?search_query=seated+hamstring+stretch+flat+back"
          },
          {
            id: "d6s3", name: "Figure-4 Glute Stretch", machine: "Floor Mat", fixed: true, sets: 1, reps: "45 sec / side", restSec: 0,
            substitute: "Seated figure-4 in a chair",
            setup: "On your back, one ankle crossed over the opposite knee.",
            exec: "Pull the knee towards your chest until you feel the glute stretch. 45 seconds per side.",
            apt: "Keep the lower back flat on the mat.",
            mistake: "Letting the hips roll and the back lift.",
            anim: "figure4",
            video: "https://www.youtube.com/results?search_query=figure+4+glute+stretch+supine"
          },
          {
            id: "d6s4", name: "Child's Pose", machine: "Floor Mat", fixed: true, sets: 1, reps: "90 sec", restSec: 0,
            substitute: "Seated forward fold",
            setup: "Kneel and sit back on your heels, arms reaching forward.",
            exec: "Sink the hips back, breathe into the lower back for 90 seconds.",
            apt: "Decompresses the lumbar erectors after a hinge-heavy day. End the training week relaxed, not braced.",
            mistake: "Rushing it. This is the last 90 seconds of your training week — use them.",
            anim: "childPose",
            video: "https://www.youtube.com/results?search_query=childs+pose+stretch+lower+back"
          }
        ]
      }
    ]
  },

  /* ====================================================================== */
  {
    day: 7,
    dow: "Sunday",
    name: "Day 7: Active Recovery",
    focus: "Mobility, Weekly Check-In & Food Prep",
    summary:
      "Not a day off — a day that does a different job. Muscle is built while you recover, not while you train, and skipping this day is how people stall in week 5. No gym, no lifting, no 'quick session'. Walk, do the full mobility circuit unhurried, take your measurements, and set the next week up.",
    blocks: [
      {
        id: "d7b1", type: "main", name: "Weekly Check-In", dur: "20 min",
        note: "Do this first thing, before eating, in the same clothes and light as last week. This is the data the entire plan steers by.",
        exercises: [
          {
            id: "d7e1", name: "Weigh-In & Waist Measurement", machine: "Scale + Tape", fixed: true, sets: 1, reps: "Once weekly", restSec: 0,
            substitute: "Weight alone if you have no tape measure — but get a tape measure",
            setup: "First thing after waking, after the toilet, before food or water, same clothes every week.",
            exec: "Weigh yourself and log it in the Stats tab. Then measure your waist at navel height, relaxed, at the end of a normal exhale. Log that too.",
            apt: "Waist matters more than weight in weeks 4-7. The scale stalls when you simultaneously gain muscle and lose fat, but the tape keeps moving. When they disagree, trust the tape and the mirror.",
            mistake: "Weighing on random days at random times and reading meaning into noise. Same day, same time, same conditions, and judge the 7-day average.",
            anim: "checkIn",
            video: "https://www.youtube.com/results?search_query=how+to+measure+waist+correctly+fat+loss"
          },
          {
            id: "d7e2", name: "Progress Photo", machine: "Phone + Mirror", fixed: true, sets: 1, reps: "3 angles", restSec: 0,
            substitute: "Front and side only if you are short on time",
            setup: "Same spot, same light, same time of day, minimal clothing, phone at hip height.",
            exec: "Take a front, side and back photo. The side-on one is the critical one for APT — keep it strictly side-on and stand relaxed, in your natural posture, not in your corrected one.",
            apt: "Stand how you NORMALLY stand for the photo. Do not correct your posture for the camera or you destroy the only objective record you have of the tilt changing. Compare week 1 against week 13 side by side at the end.",
            mistake: "Flexing or fixing your posture, which makes the photos useless for tracking the tilt.",
            anim: "checkIn",
            video: "https://www.youtube.com/results?search_query=progress+photos+how+to+take+consistent"
          },
          {
            id: "d7e3", name: "APT Self-Test (Every 2 Weeks)", machine: "Wall + Floor", fixed: true, sets: 1, reps: "All 4 tests", restSec: 0,
            substitute: "Wall test alone if time is short",
            setup: "Open wall space and a mat. Run this on weeks 1, 3, 5, 7, 9, 11 and 13.",
            exec: "Run all four tests from the APT tab — wall test, Thomas test, ASIS landmark test and the standing side photo — and log each result.",
            apt: "This is the only way you will know the APT work is doing anything. Posture changes too slowly to notice day to day, but the hand-behind-the-back gap in the wall test shrinks measurably every fortnight.",
            mistake: "Never re-testing, then guessing in week 10 whether it is working.",
            anim: "wallPostureReset",
            video: "https://www.youtube.com/results?search_query=anterior+pelvic+tilt+self+assessment+tests"
          }
        ]
      },
      {
        id: "d7b2", type: "apt", name: "Full APT Mobility Circuit", dur: "25 min",
        note: "The one day you run the whole circuit without watching the clock. Full hold times, both sides, properly. Mobility only today — no strengthening.",
        exercises: [
          {
            id: "d7a1", name: "Foam Roll Quads & Hip Flexors", machine: "Foam Roller", fixed: true, sets: 1, reps: "2 min / side", restSec: 0,
            substitute: "Massage ball",
            setup: "Face down with the roller under the front of one thigh, up near the hip.",
            exec: "Roll slowly from above the knee to the hip, pausing 20-30 seconds on tender spots. Two minutes per side today.",
            apt: "Six days of training have left your hip flexors loaded and short. Take the time today.",
            mistake: "Rolling fast. Slow, and pause where it bites.",
            anim: "foamRollQuad",
            video: "https://www.youtube.com/results?search_query=foam+roll+hip+flexor+quad+release"
          },
          {
            id: "d7a2", name: "Foam Roll Glutes & Lower Back", machine: "Foam Roller", fixed: true, sets: 1, reps: "90 sec / side", restSec: 0,
            substitute: "Tennis or lacrosse ball against a wall",
            setup: "Sit on the roller with one ankle crossed over the opposite knee.",
            exec: "Roll the glute slowly for 90 seconds per side. Then roll the upper and mid back, but never roll directly on your lower spine.",
            apt: "Roll the glutes and the mid-back, not the lumbar spine. In APT the lumbar erectors are already short and irritable, and grinding a roller into them tends to make them guard harder, not relax.",
            mistake: "Rolling directly on the lower back.",
            anim: "foamRollGlute",
            video: "https://www.youtube.com/results?search_query=foam+roll+glutes+piriformis"
          },
          {
            id: "d7a3", name: "Half-Kneeling Hip Flexor Stretch", machine: "Floor Mat", fixed: true, sets: 3, reps: "60 sec / side", restSec: 15,
            substitute: "Couch stretch",
            setup: "Kneel on one knee, other foot planted in front, torso vertical.",
            exec: "Tuck, squeeze the glute, shift forward two inches. 60 seconds. Three rounds per side.",
            apt: "Three rounds per side, unhurried. Tuck first, always.",
            mistake: "Deep lunging with an arched back.",
            anim: "hipFlexorStretch",
            video: "https://www.youtube.com/results?search_query=half+kneeling+hip+flexor+stretch+posterior+pelvic+tilt"
          },
          {
            id: "d7a4", name: "Cat-Camel", machine: "Floor Mat", fixed: true, sets: 2, reps: "12 slow reps", restSec: 30,
            substitute: "Standing pelvic tilts",
            setup: "All fours, hands under shoulders, knees under hips.",
            exec: "Slowly round the whole spine up, tucking the tailbone, then slowly reverse. Three seconds each direction, 12 reps.",
            apt: "Spend extra time at the rounded, tailbone-tucked end of the range — that is the position your body has forgotten how to find.",
            mistake: "Going fast and only using the mid-back.",
            anim: "catCamel",
            video: "https://www.youtube.com/results?search_query=cat+camel+exercise+spine+mobility"
          },
          {
            id: "d7a5", name: "90/90 Breathing", machine: "Floor Mat + Wall", fixed: true, sets: 3, reps: "6 breaths", restSec: 30,
            substitute: "Supine breathing with knees bent",
            setup: "Feet on the wall, hips and knees at 90 degrees.",
            exec: "Tailbone tucked, 4-second nasal inhale, 8-second mouth exhale with the ribs dropping. Six breaths, three rounds.",
            apt: "The rib-over-pelvis reset. Do it slowly today — three rounds, unhurried, is genuinely one of the highest-value things in this whole plan.",
            mistake: "Chest breathing.",
            anim: "breathing90",
            video: "https://www.youtube.com/results?search_query=90+90+breathing+exercise+pelvic+tilt"
          },
          {
            id: "d7a6", name: "Figure-4 & Hamstring Stretch", machine: "Floor Mat", fixed: true, sets: 1, reps: "60 sec each / side", restSec: 0,
            substitute: "Seated versions in a chair",
            setup: "Mat, on your back.",
            exec: "Figure-4 glute stretch for 60 seconds per side, then seated hamstring stretch for 60 seconds per side.",
            apt: "Lower back flat on the mat for the figure-4; hinge from the hip with a flat back for the hamstring.",
            mistake: "Rounding the spine on the hamstring stretch.",
            anim: "figure4",
            video: "https://www.youtube.com/results?search_query=figure+4+glute+stretch+supine"
          },
          {
            id: "d7a7", name: "Standing Wall Posture Reset", machine: "Flat Wall", fixed: true, sets: 3, reps: "45 sec hold + 10 steps", restSec: 30,
            substitute: "Mirror posture reset",
            setup: "Heels 10 cm from a wall, head, shoulder blades and glutes touching it.",
            exec: "Slide a hand behind your lower back, then tuck the tailbone and squeeze the glutes until your hand is pinned. Hold 45 seconds. Step away and walk 10 steps holding exactly that position.",
            apt: "The last thing you do in the circuit, because the 10 steps afterwards are what turn a drill into your new default posture.",
            mistake: "Slumping the instant you step off the wall.",
            anim: "wallPostureReset",
            video: "https://www.youtube.com/results?search_query=wall+test+posture+anterior+pelvic+tilt"
          }
        ]
      },
      {
        id: "d7b3", type: "cardio", name: "Easy Recovery Walk", dur: "30-45 min",
        note: "Blood flow for recovery, not a workout. Easy conversational pace, flat ground, no intervals.",
        exercises: [
          {
            id: "d7c1", name: "Easy Outdoor Walk", machine: "Outdoors", fixed: true, sets: 1, reps: "30-45 min easy", restSec: 0,
            substitute: "Flat treadmill walk if the weather is bad",
            setup: "Comfortable shoes, flat route, no incline.",
            exec: "Walk 30-45 minutes at a genuinely easy pace where you could hold a full conversation. Target 6,000-8,000 steps across the whole day.",
            apt: "Use the walk as free re-patterning practice: every few minutes reset to ribs down, tailbone slightly tucked, glutes lightly engaged. Thousands of corrected steps a week is what makes the new posture automatic.",
            mistake: "Turning the recovery walk into a session. If you finish out of breath, you did it wrong.",
            anim: "walk",
            video: "https://www.youtube.com/results?search_query=active+recovery+walk+benefits"
          }
        ]
      },
      {
        id: "d7b4", type: "cooldown", name: "Week Prep", dur: "30 min",
        note: "The half hour that makes the next six days possible. Skip it and Monday starts with friction.",
        exercises: [
          {
            id: "d7s1", name: "Grocery Run & Meal Prep", machine: "Shopping List in the Diet Tab", fixed: true, sets: 1, reps: "Weekly", restSec: 0,
            substitute: "Online grocery order",
            setup: "Open the weekly shopping list in the Diet tab and check the month's spend against the ₹10,000 cap.",
            exec: "Buy the week's groceries. Portion the chana, peanuts and nuts into six daily bags. Start the week's sprouting by soaking moong or chana overnight, then rinse daily.",
            apt: "Not posture work — but the reason the diet survives a 9-to-5. A plan that depends on daily willpower fails; a plan where the right food is already portioned and within reach works.",
            mistake: "Skipping prep and relying on the PG kitchen plus willpower at 11 PM.",
            anim: "prep",
            video: "https://www.youtube.com/results?search_query=vegetarian+meal+prep+high+protein+no+cook"
          },
          {
            id: "d7s2", name: "Review the Week & Set Up Monday", machine: "This App", fixed: true, sets: 1, reps: "Weekly", restSec: 0,
            substitute: "A note on your phone",
            setup: "Open the Stats tab and this week's logged sets.",
            exec: "Look at which lifts went up this week and which stalled. Read Monday's split in the Gym tab so you walk in already knowing the plan. Lay out your gym clothes and fill your bottle.",
            apt: "Check the current phase in the Plan tab — if a new phase starts tomorrow, your sets, reps, rest and calories all change and you should know that before 5 AM, not at 5 AM.",
            mistake: "Walking into the gym on Monday deciding what to do. Decisions at 5 AM are how sessions get skipped.",
            anim: "prep",
            video: "https://www.youtube.com/results?search_query=weekly+training+review+progressive+overload"
          }
        ]
      }
    ]
  }
];

/* ------------------------------------------------------------------------ */
/* Helpers                                                                   */
/* ------------------------------------------------------------------------ */

const BLOCK_STYLE = {
  warmup:   { label: "Warm-Up",   color: "amber",   icon: "🔥" },
  main:     { label: "Main Work", color: "emerald", icon: "🏋️" },
  apt:      { label: "APT Fix",   color: "purple",  icon: "🦴" },
  cardio:   { label: "Cardio",    color: "cyan",    icon: "🏃" },
  cooldown: { label: "Cool-Down", color: "blue",    icon: "🧘" }
};

/* Flat list of every exercise on a day, in order. */
function getDayExercises(dayNum) {
  const day = WORKOUT_DAYS.find(d => d.day === dayNum);
  if (!day) return [];
  return day.blocks.flatMap(b => b.exercises);
}

function findExercise(exId) {
  for (const day of WORKOUT_DAYS) {
    for (const block of day.blocks) {
      const hit = block.exercises.find(e => e.id === exId);
      if (hit) return { exercise: hit, block, day };
    }
  }
  return null;
}

/* Mon-Sat -> days 1-6, Sunday -> day 7 */
function getWorkoutDayForDate(dateStr) {
  const dow = new Date(dateStr + "T00:00:00").getDay();
  return dow === 0 ? 7 : dow;
}
