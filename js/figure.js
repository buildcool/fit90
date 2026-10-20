/* ==========================================================================
   figure.js — anatomical exercise animation engine

   Replaces the old getAnimatedSvg(type), which had three abstract SVGs shared
   by every exercise. Here a human figure is built from joint angles, drawn on
   the actual machine, and animated between two keyframe poses on the real
   tempo. A "wrong form" figure can be shown beside it with the lumbar spine
   arched, so the APT fault is visible rather than only described.

   Conventions
     - viewBox is 320 x 200, y grows downward
     - all angles are ABSOLUTE degrees: 0 = right, -90 = up, 90 = down, 180 = left
     - the figure faces RIGHT unless a template says otherwise
     - `tilt` is pelvis rotation: 0 = neutral, positive = anterior tilt (the fault)
   ========================================================================== */

const SEG = {
  pelvisW: 24, torso: 52, neck: 9, headR: 10.5,
  upperArm: 26, foreArm: 24, hand: 6,
  thigh: 35, shin: 33, foot: 14
};

const C = {
  bodyFill: "#34d399", bodyEdge: "#065f46", bodyBack: "#0f766e",
  badFill: "#f87171", badEdge: "#7f1d1d", badBack: "#991b1b",
  spineOk: "#a7f3d0", spineBad: "#fecaca",
  machine: "#475569", machineDark: "#334155", machineLight: "#64748b",
  pad: "#1e293b", accent: "#fbbf24", floor: "#334155", label: "#94a3b8"
};

const rad = d => (d * Math.PI) / 180;
const px = (p, a, len) => ({ x: p.x + Math.cos(rad(a)) * len, y: p.y + Math.sin(rad(a)) * len });

/* A tapered capsule between two points — reads as a limb, not a stick. */
function limb(p0, p1, w0, w1, fill, edge) {
  const a = Math.atan2(p1.y - p0.y, p1.x - p0.x);
  const nx = -Math.sin(a), ny = Math.cos(a);
  const pts = [
    [p0.x + nx * w0, p0.y + ny * w0], [p1.x + nx * w1, p1.y + ny * w1],
    [p1.x - nx * w1, p1.y - ny * w1], [p0.x - nx * w0, p0.y - ny * w0]
  ].map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return `<polygon points="${pts}" fill="${fill}" stroke="${edge}" stroke-width="1" stroke-linejoin="round"/>`
    + `<circle cx="${p1.x.toFixed(1)}" cy="${p1.y.toFixed(1)}" r="${w1}" fill="${fill}"/>`;
}

/* Resolve a pose into named joint coordinates. */
function joints(p) {
  const pelvis = { x: p.x, y: p.y };
  const shoulder = px(pelvis, p.torso, SEG.torso);
  const neckTop = px(shoulder, p.head ?? p.torso, SEG.neck);
  const headC = px(neckTop, p.head ?? p.torso, SEG.headR);
  const elbow = px(shoulder, p.arm, SEG.upperArm);
  const wrist = px(elbow, p.farm, SEG.foreArm);
  const elbowB = px(shoulder, p.armB ?? p.arm, SEG.upperArm);
  const wristB = px(elbowB, p.farmB ?? p.farm, SEG.foreArm);
  const knee = px(pelvis, p.thigh, SEG.thigh);
  const ankle = px(knee, p.shin, SEG.shin);
  const toe = px(ankle, p.foot ?? p.shin + 80, SEG.foot);
  const kneeB = px(pelvis, p.thighB ?? p.thigh, SEG.thigh);
  const ankleB = px(kneeB, p.shinB ?? p.shin, SEG.shin);
  const toeB = px(ankleB, p.footB ?? p.foot ?? p.shin + 80, SEG.foot);
  return { pelvis, shoulder, neckTop, headC, elbow, wrist, elbowB, wristB, knee, ankle, toe, kneeB, ankleB, toeB };
}

/* The torso is drawn along a curved centreline whose bend is driven by pelvis
   tilt, not as a straight tube. An anterior tilt bows the lumbar spine toward
   the belly, so the figure shows what APT actually looks like from the side:
   hollow lower back, belly pushed forward, glutes pushed back. A posterior
   tilt (or a rounded back) bends it the other way.

   `prone` flips which side is the belly, for face-down and all-fours poses. */
function torsoGeometry(j, p, prone) {
  const P = j.pelvis, S = j.shoulder;
  const a = Math.atan2(S.y - P.y, S.x - P.x);
  const f = prone ? -1 : 1;
  const nx = -Math.sin(a) * f, ny = Math.cos(a) * f;          // unit normal toward the belly
  const bend = (p.tilt || 0) * 0.9;
  const c = { x: (P.x + S.x) / 2 + nx * bend, y: (P.y + S.y) / 2 + ny * bend };
  const at = t => ({
    x: (1 - t) * (1 - t) * P.x + 2 * (1 - t) * t * c.x + t * t * S.x,
    y: (1 - t) * (1 - t) * P.y + 2 * (1 - t) * t * c.y + t * t * S.y
  });
  const tangent = t => ({
    x: 2 * (1 - t) * (c.x - P.x) + 2 * t * (S.x - c.x),
    y: 2 * (1 - t) * (c.y - P.y) + 2 * t * (S.y - c.y)
  });
  /* belly side: the local normal that points the same way as (nx, ny) */
  const normal = t => {
    const d = tangent(t), L = Math.hypot(d.x, d.y) || 1;
    let mx = -d.y / L, my = d.x / L;
    if (mx * nx + my * ny < 0) { mx = -mx; my = -my; }
    return { x: mx, y: my };
  };
  return { at, normal, nx, ny };
}

function torsoShape(j, p, opts, fill, edge) {
  const g = torsoGeometry(j, p, opts.prone);
  const tilt = p.tilt || 0;
  const N = 14, front = [], back = [];
  for (let i = 0; i <= N; i++) {
    const t = i / N, c = g.at(t), n = g.normal(t);
    // belly pushes out with an anterior tilt, in the lower half of the torso
    const belly = Math.max(0, tilt) * 0.16 * Math.sin(Math.PI * Math.min(1, t * 1.6));
    const wf = 10.5 + 2.5 * t + belly, wb = 10.5 + 2.5 * t;
    front.push([c.x + n.x * wf, c.y + n.y * wf]);
    back.push([c.x - n.x * wb, c.y - n.y * wb]);
  }
  const pts = front.concat(back.reverse()).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  // glutes sit behind the pelvis and push further back as the pelvis tips forward
  const n0 = g.normal(0), push = 8 + tilt * 0.35;
  const gl = { x: j.pelvis.x - n0.x * push, y: j.pelvis.y - n0.y * push };
  return `<circle cx="${gl.x.toFixed(1)}" cy="${gl.y.toFixed(1)}" r="9.5" fill="${fill}" stroke="${edge}" stroke-width="1"/>`
    + `<polygon points="${pts}" fill="${fill}" stroke="${edge}" stroke-width="1" stroke-linejoin="round"/>`;
}

/* The lower back line — the contour to look at. Thick and coloured so an
   arch or a rounded back reads at a glance. */
function lowerBackLine(j, p, opts) {
  const g = torsoGeometry(j, p, opts.prone);
  const pts = [];
  for (let i = 0; i <= 10; i++) {
    const t = 0.04 + (i / 10) * 0.6, c = g.at(t), n = g.normal(t);
    const w = 10.5 + 2.5 * t;
    pts.push(`${(c.x - n.x * w).toFixed(1)},${(c.y - n.y * w).toFixed(1)}`);
  }
  return `<polyline points="${pts.join(" ")}" fill="none" stroke="${opts.bad ? "#fde047" : "#ecfdf5"}"
    stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/* The pelvis itself — a wedge that visibly rotates with `tilt`, with the
   front hip bone (ASIS) marked. */
function pelvisPlate(j, p, opts, fill, edge) {
  const f = opts.prone ? -1 : 1;
  const a = p.torso + 90 * f + (p.tilt || 0) * f;
  const fr = px(j.pelvis, a, SEG.pelvisW / 2);
  const bk = px(j.pelvis, a + 180, SEG.pelvisW / 2);
  return `<line x1="${bk.x.toFixed(1)}" y1="${bk.y.toFixed(1)}" x2="${fr.x.toFixed(1)}" y2="${fr.y.toFixed(1)}"
      stroke="${edge}" stroke-width="2.4" stroke-linecap="round" opacity="0.8"/>`
    + `<circle cx="${fr.x.toFixed(1)}" cy="${fr.y.toFixed(1)}" r="2.8" fill="${C.accent}"/>`;
}

/* Full figure. opts: { bad, prone, showHands } */
function figure(p, opts = {}) {
  const bad = !!opts.bad;
  const fill = bad ? C.badFill : C.bodyFill;
  const edge = bad ? C.badEdge : C.bodyEdge;
  const back = bad ? C.badBack : C.bodyBack;
  const j = joints(p);
  let s = "";
  // far limbs first, in a darker shade, so the figure reads with depth
  s += limb(j.pelvis, j.kneeB, 8, 6, back, back) + limb(j.kneeB, j.ankleB, 6, 4, back, back) + limb(j.ankleB, j.toeB, 4, 3, back, back);
  s += limb(j.shoulder, j.elbowB, 6, 5, back, back) + limb(j.elbowB, j.wristB, 5, 3.5, back, back);
  // torso, pelvis, and the lower-back line
  s += torsoShape(j, p, opts, fill, edge);
  s += pelvisPlate(j, p, opts, fill, edge);
  s += lowerBackLine(j, p, opts);
  // near limbs
  s += limb(j.pelvis, j.knee, 9, 6.5, fill, edge) + limb(j.knee, j.ankle, 6.5, 4.5, fill, edge) + limb(j.ankle, j.toe, 4.5, 3, fill, edge);
  s += limb(j.shoulder, j.elbow, 6.5, 5.5, fill, edge) + limb(j.elbow, j.wrist, 5.5, 4, fill, edge);
  // neck + head
  s += limb(j.shoulder, j.neckTop, 5, 4.5, fill, edge);
  s += `<circle cx="${j.headC.x.toFixed(1)}" cy="${j.headC.y.toFixed(1)}" r="${SEG.headR}" fill="${fill}" stroke="${edge}" stroke-width="1"/>`;
  if (opts.showHands) s += `<circle cx="${j.wrist.x.toFixed(1)}" cy="${j.wrist.y.toFixed(1)}" r="4" fill="${C.accent}"/>`;
  return s;
}

/* ==========================================================================
   Machines — the context that makes a pose recognisable as an exercise.
   ========================================================================== */
const MACHINES = {
  floor: () => `<line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  mat: () => `<rect x="30" y="166" width="260" height="9" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="3"/>`,

  seatBack: () => `<rect x="86" y="140" width="76" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="78" y="58" width="12" height="86" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="120" y1="150" x2="120" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="60" y1="175" x2="200" y2="175" stroke="${C.machineDark}" stroke-width="6"/>
    <line x1="196" y1="40" x2="196" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <circle cx="172" cy="62" r="5" fill="${C.machineLight}"/><circle cx="172" cy="96" r="5" fill="${C.machineLight}"/>`,

  benchFlat: () => `<rect x="56" y="116" width="150" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="72" y1="127" x2="72" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="190" y1="127" x2="190" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  benchBehind: () => `<rect x="158" y="112" width="98" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="172" y1="123" x2="172" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="242" y1="123" x2="242" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  legPressSeat: () => `<line x1="118" y1="160" x2="246" y2="108" stroke="${C.machine}" stroke-width="5" stroke-linecap="round"/>
    <rect x="70" y="140" width="56" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="96" y1="143" x2="60" y2="96" stroke="${C.pad}" stroke-width="13" stroke-linecap="round"/>
    <line x1="96" y1="143" x2="60" y2="96" stroke="${C.machine}" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/>
    <line x1="98" y1="150" x2="98" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  benchLow: () => `<rect x="88" y="136" width="116" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="102" y1="146" x2="102" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="190" y1="146" x2="190" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  rollerBack: () => `<circle cx="180" cy="166" r="9" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="2"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  benchIncline: () => `<rect x="70" y="100" width="130" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5" transform="rotate(-18 135 105)"/>
    <line x1="96" y1="140" x2="96" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="186" y1="112" x2="186" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  cableHigh: () => `<rect x="246" y="22" width="14" height="153" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="253" cy="32" r="7" fill="none" stroke="${C.machineLight}" stroke-width="3"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  cableMid: () => `<rect x="246" y="22" width="14" height="153" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="253" cy="96" r="7" fill="none" stroke="${C.machineLight}" stroke-width="3"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  cableLow: () => `<rect x="246" y="22" width="14" height="153" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="253" cy="156" r="7" fill="none" stroke="${C.machineLight}" stroke-width="3"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  pulldown: () => `<rect x="60" y="14" width="13" height="161" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="66" cy="24" r="7" fill="none" stroke="${C.machineLight}" stroke-width="3"/>
    <rect x="96" y="142" width="74" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="120" y="112" width="60" height="9" rx="4" fill="${C.machineDark}" stroke="${C.machine}" stroke-width="1"/>
    <line x1="130" y1="152" x2="130" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  rowStation: () => `<rect x="236" y="120" width="14" height="55" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="243" cy="130" r="6" fill="none" stroke="${C.machineLight}" stroke-width="3"/>
    <rect x="240" y="104" width="34" height="34" rx="4" fill="${C.machineDark}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="70" y="128" width="84" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  legPress: () => `<rect x="54" y="128" width="92" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="46" y="74" width="12" height="60" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <g transform="rotate(-28 230 92)"><rect x="206" y="42" width="14" height="100" rx="4" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="2"/></g>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>
    <line x1="40" y1="139" x2="40" y2="175" stroke="${C.machine}" stroke-width="5"/>`,

  legExt: () => `<rect x="80" y="128" width="78" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="72" y="70" width="12" height="60" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="206" cy="152" r="9" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="2"/>
    <line x1="158" y1="134" x2="206" y2="152" stroke="${C.machine}" stroke-width="3"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  legCurl: () => `<rect x="60" y="116" width="150" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="232" cy="130" r="9" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="2"/>
    <line x1="210" y1="122" x2="232" y2="130" stroke="${C.machine}" stroke-width="3"/>
    <line x1="76" y1="127" x2="76" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="194" y1="127" x2="194" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  pecDeck: () => `<rect x="86" y="140" width="76" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="78" y="58" width="12" height="86" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="120" y1="150" x2="120" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="60" y1="175" x2="200" y2="175" stroke="${C.machineDark}" stroke-width="6"/>
    <line x1="102" y1="58" x2="102" y2="30" stroke="${C.machine}" stroke-width="4"/>
    <line x1="102" y1="34" x2="180" y2="62" stroke="${C.machineLight}" stroke-width="4" stroke-linecap="round"/>`,

  assistFrame: () => `<line x1="56" y1="22" x2="248" y2="22" stroke="${C.machine}" stroke-width="7" stroke-linecap="round"/>
    <line x1="60" y1="22" x2="60" y2="175" stroke="${C.pad}" stroke-width="11"/>
    <line x1="244" y1="22" x2="244" y2="175" stroke="${C.pad}" stroke-width="11"/>
    <rect x="128" y="128" width="58" height="10" rx="4" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  abduction: () => `<rect x="94" y="140" width="76" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="86" y="74" width="12" height="70" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="176" y="120" width="11" height="34" rx="4" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="1.5"/>
    <line x1="128" y1="150" x2="128" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  hipThrustBench: () => `<rect x="42" y="138" width="92" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="56" y1="149" x2="56" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="120" y1="149" x2="120" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  treadmill: () => `<rect x="60" y="156" width="190" height="14" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5" transform="rotate(-6 155 163)"/>
    <line x1="240" y1="150" x2="258" y2="66" stroke="${C.machine}" stroke-width="5"/>
    <line x1="232" y1="70" x2="266" y2="62" stroke="${C.machineLight}" stroke-width="5" stroke-linecap="round"/>
    <rect x="236" y="26" width="40" height="30" rx="4" fill="${C.machineDark}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  bike: () => `<circle cx="96" cy="150" r="24" fill="none" stroke="${C.machine}" stroke-width="4"/>
    <line x1="96" y1="150" x2="150" y2="126" stroke="${C.machine}" stroke-width="5"/>
    <rect x="140" y="112" width="34" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="150" y1="126" x2="196" y2="62" stroke="${C.machine}" stroke-width="5"/>
    <line x1="178" y1="66" x2="214" y2="58" stroke="${C.machineLight}" stroke-width="5" stroke-linecap="round"/>
    <circle cx="160" cy="152" r="9" fill="none" stroke="${C.machineLight}" stroke-width="3"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  rower: () => `<line x1="40" y1="166" x2="280" y2="166" stroke="${C.machine}" stroke-width="6"/>
    <rect x="120" y="140" width="40" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <circle cx="258" cy="140" r="20" fill="none" stroke="${C.machine}" stroke-width="4"/>
    <rect x="238" y="152" width="40" height="12" rx="3" fill="${C.machineDark}"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  wall: () => `<rect x="238" y="14" width="16" height="161" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  wallLeft: () => `<rect x="60" y="14" width="16" height="161" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  roller: () => `<circle cx="196" cy="158" r="16" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="2.5"/>
    <circle cx="196" cy="158" r="7" fill="none" stroke="${C.machineLight}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  step: () => `<rect x="150" y="158" width="90" height="17" rx="3" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  preacher: () => `<rect x="96" y="146" width="70" height="10" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <g transform="rotate(38 190 110)"><rect x="166" y="96" width="60" height="11" rx="5" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/></g>
    <line x1="130" y1="156" x2="130" y2="175" stroke="${C.machine}" stroke-width="5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  rackUpright: () => `<rect x="222" y="18" width="14" height="157" rx="3" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  doorway: () => `<rect x="236" y="14" width="14" height="161" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="46" y="14" width="14" height="161" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  scale: () => `<rect x="130" y="160" width="60" height="15" rx="4" fill="${C.pad}" stroke="${C.machine}" stroke-width="1.5"/>
    <rect x="144" y="150" width="32" height="12" rx="3" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="1"/>
    <line x1="10" y1="175" x2="310" y2="175" stroke="${C.floor}" stroke-width="4"/>`,

  none: () => ""
};

/* Loose kit drawn in front of the figure (dumbbells, ropes, bars). */
function dumbbell(p, r = 6) {
  return `<g><circle cx="${p.x.toFixed(1)}" cy="${(p.y - r - 2).toFixed(1)}" r="${r}" fill="${C.machineLight}"/>
    <circle cx="${p.x.toFixed(1)}" cy="${(p.y + r + 2).toFixed(1)}" r="${r}" fill="${C.machineLight}"/>
    <rect x="${(p.x - 2).toFixed(1)}" y="${(p.y - 4).toFixed(1)}" width="4" height="8" fill="${C.machine}"/></g>`;
}
function sledPlate(j, push) {
  const c = px(j.ankle, push, 8);
  const e1 = px(c, push + 90, 30), e2 = px(c, push - 90, 30), w = px(c, push, 22);
  return `<line x1="${e1.x.toFixed(1)}" y1="${e1.y.toFixed(1)}" x2="${e2.x.toFixed(1)}" y2="${e2.y.toFixed(1)}"
      stroke="${C.machineLight}" stroke-width="7" stroke-linecap="round"/>
    <circle cx="${w.x.toFixed(1)}" cy="${w.y.toFixed(1)}" r="15" fill="${C.machineDark}" stroke="${C.machineLight}" stroke-width="2"/>`;
}
function barTo(a, b) {
  return `<line x1="${a.x.toFixed(1)}" y1="${a.y.toFixed(1)}" x2="${b.x.toFixed(1)}" y2="${b.y.toFixed(1)}" stroke="${C.machineLight}" stroke-width="5" stroke-linecap="round"/>`;
}
function cableTo(from, to) {
  return `<line x1="${from.x}" y1="${from.y}" x2="${to.x.toFixed(1)}" y2="${to.y.toFixed(1)}" stroke="${C.machineLight}" stroke-width="2" stroke-dasharray="5 3"/>`;
}

/* ==========================================================================
   Animation templates: one per exercise.
     machine : key in MACHINES
     a / b   : the two keyframe poses (a = start/stretched, b = end/contracted)
     wrong   : optional explicit faulty pose; otherwise derived from `b`
     hold    : true for isometrics/stretches (gentle breathing motion, no reps)
     kit     : optional function(joints) -> extra SVG (dumbbells, cables, bars)
     caption / wrongNote / parts
   ========================================================================== */
const ANIM = {
  /* ---------------- pressing ---------------- */
  seatedPressIncline: {
    machine: "seatBack", caption: "Handles driven forward and up • 3s lower",
    a: { x: 120, y: 118, tilt: 0, torso: -97, head: -92, arm: 138, farm: 2, armB: 132, farmB: 8, thigh: -6, shin: 74, foot: 14, thighB: -2, shinB: 78 },
    b: { x: 120, y: 118, tilt: 0, torso: -97, head: -92, arm: -12, farm: -6, armB: -8, farmB: -2, thigh: -6, shin: 74, foot: 14, thighB: -2, shinB: 78 },
    wrongNote: "Lumbar arched off the pad to push heavier — the classic APT press",
    parts: [{ x: 196, y: 54, t: "handles at upper chest" }, { x: 72, y: 100, t: "ribs flat on pad" }]
  },
  seatedPressHorizontal: {
    machine: "seatBack", caption: "Flat press • 1s drive, 3s lower",
    a: { x: 120, y: 118, tilt: 0, torso: -94, head: -90, arm: 150, farm: 0, armB: 144, farmB: 6, thigh: -4, shin: 76, foot: 14 },
    b: { x: 120, y: 118, tilt: 0, torso: -94, head: -90, arm: -4, farm: 0, armB: 0, farmB: 4, thigh: -4, shin: 76, foot: 14 },
    wrongNote: "Lower back peeled off the backrest",
    parts: [{ x: 196, y: 90, t: "handles" }]
  },
  seatedPressOverhead: {
    machine: "seatBack", caption: "Press overhead • glutes squeezed, lumbar glued down",
    a: { x: 120, y: 120, tilt: 0, torso: -92, head: -90, arm: 104, farm: -78, armB: 100, farmB: -72, thigh: -4, shin: 76, foot: 14 },
    b: { x: 120, y: 120, tilt: 0, torso: -92, head: -90, arm: -82, farm: -88, armB: -76, farmB: -84, thigh: -4, shin: 76, foot: 14 },
    wrongNote: "Leaning back into a lumbar arch — the #1 APT trigger in the gym",
    parts: [{ x: 172, y: 58, t: "handles at ear height" }, { x: 72, y: 104, t: "spine locked to pad" }]
  },
  benchPressDumbbell: {
    machine: "benchFlat", caption: "Lower to chest stretch • press up and in",
    a: { x: 142, y: 112, tilt: 0, torso: 180, head: 176, arm: -42, farm: -122, armB: -36, farmB: -116, thigh: 24, shin: 80, foot: 10 },
    b: { x: 142, y: 112, tilt: 0, torso: 180, head: 176, arm: -86, farm: -90, armB: -80, farmB: -86, thigh: 24, shin: 80, foot: 10 },
    wrongNote: "Big arch under the lower back to shorten the press",
    kit: j => dumbbell(j.wrist) + dumbbell(j.wristB, 5),
    parts: [{ x: 70, y: 104, t: "no gap under lower back" }]
  },
  pecDeckFly: {
    machine: "pecDeck", caption: "Wide arc together • 1s inner-chest squeeze",
    a: { x: 120, y: 118, tilt: 0, torso: -95, head: -90, arm: 176, farm: 168, armB: 170, farmB: 162, thigh: -4, shin: 76, foot: 14 },
    b: { x: 120, y: 118, tilt: 0, torso: -95, head: -90, arm: -14, farm: -8, armB: -10, farmB: -4, thigh: -4, shin: 76, foot: 14 },
    wrongNote: "Ribs flared and lower back arched off the backrest",
    parts: [{ x: 180, y: 54, t: "handles at mid-chest" }]
  },
  lateralRaise: {
    machine: "floor", caption: "Lead with the elbows • stop at shoulder height",
    a: { x: 150, y: 104, tilt: 0, torso: -90, head: -90, arm: 86, farm: 88, armB: 94, farmB: 92, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    b: { x: 150, y: 104, tilt: 0, torso: -90, head: -90, arm: 4, farm: 10, armB: 176, farmB: 170, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    wrongNote: "Hips thrust forward and lower back arched to swing the weight up",
    kit: j => dumbbell(j.wrist, 5) + dumbbell(j.wristB, 5)
  },
  cablePushdown: {
    machine: "cableHigh", caption: "Elbows pinned to ribs • lock out and spread the rope",
    a: { x: 150, y: 104, tilt: 0, torso: -88, head: -84, arm: 72, farm: -22, armB: 76, farmB: -16, thigh: 88, shin: 88, foot: 0 },
    b: { x: 150, y: 104, tilt: 0, torso: -88, head: -84, arm: 74, farm: 70, armB: 78, farmB: 74, thigh: 88, shin: 88, foot: 0 },
    wrongNote: "Butt pushed back into an arch for leverage",
    kit: j => cableTo({ x: 253, y: 32 }, j.wrist),
    parts: [{ x: 253, y: 18, t: "top pulley" }]
  },
  overheadExtension: {
    machine: "cableLow", caption: "Forearms extend overhead • ribs tucked down hard",
    a: { x: 140, y: 106, tilt: 0, torso: -86, head: -80, arm: -72, farm: 150, armB: -68, farmB: 156, thigh: 92, shin: 86, foot: 0, thighB: 70, shinB: 96 },
    b: { x: 140, y: 106, tilt: 0, torso: -86, head: -80, arm: -72, farm: -34, armB: -68, farmB: -28, thigh: 92, shin: 86, foot: 0, thighB: 70, shinB: 96 },
    wrongNote: "Lumbar arched to get the arms further overhead — stretch moves from triceps to spine",
    kit: j => cableTo({ x: 253, y: 156 }, j.wrist)
  },
  dip: {
    machine: "assistFrame", caption: "Lower to upper arms parallel • press and squeeze",
    a: { x: 152, y: 112, tilt: 0, torso: -84, head: -78, arm: 128, farm: 84, armB: 124, farmB: 88, thigh: 72, shin: 58, foot: 0 },
    b: { x: 152, y: 96, tilt: 0, torso: -86, head: -80, arm: 96, farm: 88, armB: 92, farmB: 90, thigh: 72, shin: 58, foot: 0 },
    wrongNote: "Legs swung forward with the lower back hanging in an arch",
    parts: [{ x: 60, y: 14, t: "parallel bars" }]
  },
  pushupDog: {
    faultAt: "a",
    prone: true,
    machine: "mat", caption: "Push-up → hips up and back into downward dog",
    a: { x: 150, y: 130, tilt: 0, torso: 172, head: 182, arm: 136, farm: 32, armB: 140, farmB: 36, thigh: 21, shin: 19, foot: 60 },
    b: { x: 178, y: 96, tilt: 0, torso: 146, head: 156, arm: 139, farm: 124, armB: 143, farmB: 128, thigh: 66, shin: 64, foot: 40 },
    wrongNote: "Hips sagging toward the mat in the push-up position",
    hold: false
  },

  /* ---------------- pulling ---------------- */
  pulldown: {
    machine: "pulldown", caption: "Shoulders down first • elbows drive to hips",
    a: { x: 132, y: 118, tilt: 0, torso: -84, head: -80, arm: -104, farm: -98, armB: -100, farmB: -94, thigh: 2, shin: 78, foot: 14 },
    b: { x: 132, y: 118, tilt: 0, torso: -84, head: -80, arm: -156, farm: -72, armB: -152, farmB: -68, thigh: 2, shin: 78, foot: 14 },
    wrongNote: "Rocking back and hyperextending the lumbar to drag the bar down",
    kit: j => cableTo({ x: 66, y: 24 }, j.wrist) + barTo({ x: j.wrist.x - 16, y: j.wrist.y }, { x: j.wrist.x + 10, y: j.wrist.y - 4 }),
    parts: [{ x: 150, y: 104, t: "thigh pad locked" }]
  },
  seatedRow: {
    machine: "rowStation", caption: "Pull to the lower stomach • 1s blade squeeze",
    a: { x: 118, y: 118, tilt: 0, torso: -82, head: -78, arm: -18, farm: -8, armB: -14, farmB: -4, thigh: -8, shin: 56, foot: 4 },
    b: { x: 118, y: 118, tilt: 0, torso: -90, head: -86, arm: 142, farm: 2, armB: 138, farmB: 6, thigh: -8, shin: 56, foot: 4 },
    wrongNote: "Torso swinging like a rowing oar instead of staying still",
    kit: j => cableTo({ x: 243, y: 130 }, j.wrist),
    parts: [{ x: 262, y: 100, t: "footplates" }]
  },
  dumbbellRow: {
    machine: "benchLow",
    prone: true,
    caption: "Elbow drives up to the ribs \u2022 3s lower to full stretch",
    a: { x: 160, y: 102, tilt: 0, torso: 192, head: 202, arm: 101, farm: 78, armB: 63, farmB: 125.1, thigh: 80, shin: 4, foot: 0, thighB: 76.5, shinB: 65.3, footB: 0 },
    b: { x: 160, y: 102, tilt: 0, torso: 192, head: 202, arm: -39.8, farm: 109.4, armB: 63, farmB: 125.1, thigh: 80, shin: 4, foot: 0, thighB: 76.5, shinB: 65.3, footB: 0 },
    wrong: { x: 160, y: 102, tilt: 28, torso: 186, head: 196, arm: -39.8, farm: 109.4, armB: 63, farmB: 125.1, thigh: 80, shin: 4, foot: 0, thighB: 76.5, shinB: 65.3, footB: 0 },
    wrongNote: "Lower back sagging and hips rotating to steal extra range",
    kit: j => dumbbell(j.wrist)
  },
  straightArmPulldown: {
    machine: "cableHigh", caption: "Elbows locked straight • sweep down to the thighs",
    a: { x: 150, y: 106, tilt: 0, torso: -82, head: -76, arm: -40, farm: -38, armB: -36, farmB: -34, thigh: 88, shin: 86, foot: 0 },
    b: { x: 150, y: 106, tilt: 0, torso: -82, head: -76, arm: 58, farm: 60, armB: 62, farmB: 64, thigh: 88, shin: 86, foot: 0 },
    wrongNote: "Lower back arched because of the forward lean",
    kit: j => cableTo({ x: 253, y: 32 }, j.wrist)
  },
  facePull: {
    machine: "cableMid", caption: "Rope to the forehead • rotate into a double-bicep pose",
    a: { x: 142, y: 104, tilt: 0, torso: -88, head: -86, arm: -16, farm: -12, armB: -12, farmB: -8, thigh: 92, shin: 84, foot: 0, thighB: 66, shinB: 100 },
    b: { x: 142, y: 104, tilt: 0, torso: -88, head: -86, arm: -6, farm: -142, armB: -2, farmB: -146, thigh: 92, shin: 84, foot: 0, thighB: 66, shinB: 100 },
    wrongNote: "Too heavy, so it becomes a row and the ribs flare off the pelvis",
    kit: j => cableTo({ x: 253, y: 96 }, j.wrist)
  },
  bicepCurl: {
    machine: "floor", caption: "Full curl, hard squeeze • 3s down to a dead-straight arm",
    a: { x: 150, y: 104, tilt: 0, torso: -90, head: -88, arm: 86, farm: 84, armB: 92, farmB: 90, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    b: { x: 150, y: 104, tilt: 0, torso: -90, head: -88, arm: 86, farm: -52, armB: 92, farmB: -46, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    wrongNote: "Leaning back and arching the lumbar to heave the weight up",
    kit: j => dumbbell(j.wrist, 5) + dumbbell(j.wristB, 5)
  },
  preacherCurl: {
    faultPic: false,
    machine: "preacher", caption: "Upper arms fixed on the pad • 3s to a straight arm",
    a: { x: 130, y: 122, tilt: 0, torso: -74, head: -70, arm: 40, farm: 42, armB: 44, farmB: 46, thigh: 4, shin: 78, foot: 14 },
    b: { x: 130, y: 122, tilt: 0, torso: -74, head: -70, arm: 40, farm: -58, armB: 44, farmB: -54, thigh: 4, shin: 78, foot: 14 },
    wrongNote: "Elbows lifting off the pad through the hard part of the rep",
    kit: j => dumbbell(j.wrist, 5),
    parts: [{ x: 204, y: 92, t: "arms flat on pad" }]
  },
  pullup: {
    machine: "assistFrame", caption: "Blades down first • chin over the bar • 3s lower",
    a: { x: 152, y: 112, tilt: 0, torso: -86, head: -84, arm: -84, farm: -88, armB: -80, farmB: -84, thigh: 84, shin: 60, foot: 0 },
    b: { x: 152, y: 76, tilt: 0, torso: -86, head: -84, arm: -118, farm: -72, armB: -114, farmB: -68, thigh: 84, shin: 60, foot: 0 },
    wrongNote: "Kipping — legs swinging forward, lower back arching to get the chin up",
    parts: [{ x: 152, y: 14, t: "bar" }, { x: 190, y: 142, t: "knee pad" }]
  },
  scapPullup: {
    machine: "assistFrame", caption: "Arms stay straight • shoulder blades pull down 2-3 inches",
    a: { x: 152, y: 116, tilt: 0, torso: -86, head: -84, arm: -84, farm: -88, armB: -80, farmB: -84, thigh: 86, shin: 88, foot: 0 },
    b: { x: 152, y: 106, tilt: 0, torso: -86, head: -84, arm: -84, farm: -88, armB: -80, farmB: -84, thigh: 86, shin: 88, foot: 0 },
    wrongNote: "Hanging in a passive arch with ribs flared instead of a slight hollow body",
    parts: [{ x: 152, y: 14, t: "bar" }]
  },
  bandPullApart: {
    faultPic: false,
    machine: "floor", caption: "Pull apart • squeeze the blades back and down",
    a: { x: 150, y: 104, tilt: 0, torso: -90, head: -88, arm: -6, farm: -4, armB: -2, farmB: 0, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    b: { x: 150, y: 104, tilt: 0, torso: -90, head: -88, arm: -34, farm: -30, armB: 26, farmB: 22, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    wrongNote: "Shrugging up to the ears instead of squeezing back and down",
    kit: j => barTo(j.wrist, j.wristB)
  },

  /* ---------------- legs ---------------- */
  legPress: {
    machine: "legPressSeat",
    faultAt: "a",
    caption: "Feet high on the platform \u2022 drive through the heels",
    a: { x: 100, y: 132, tilt: 0, torso: -128, head: -114, arm: 41.9, farm: 46, armB: 41.9, farmB: 46, thigh: -75.6, shin: 36.6, foot: -110, thighB: -78.6, shinB: 33.6, footB: -110 },
    b: { x: 100, y: 132, tilt: 0, torso: -128, head: -114, arm: 41.9, farm: 46, armB: 41.9, farmB: 46, thigh: -41.2, shin: -1.6, foot: -110, thighB: -44.2, shinB: -4.6, footB: -110 },
    wrong: { x: 104, y: 128, tilt: -30, torso: -116, head: -102, arm: 51.6, farm: 55.8, armB: 51.6, farmB: 55.8, thigh: -82.4, shin: 45.3, foot: -110, thighB: -85.4, shinB: 42.3, footB: -110 },
    wrongNote: "Lowered so deep the tailbone curls off the seat \u2014 load moves to the lumbar discs",
    kit: j => sledPlate(j, -22),
    parts: [{ x: 62, y: 102, t: "back flat on the pad" }]
  },
  legExtension: {
    machine: "legExt", caption: "Extend fully • 1s quad squeeze • 3s down",
    a: { x: 116, y: 122, tilt: 0, torso: -96, head: -92, arm: 60, farm: 40, armB: 64, farmB: 44, thigh: -4, shin: 76, foot: 10 },
    b: { x: 116, y: 122, tilt: 0, torso: -96, head: -92, arm: 60, farm: 40, armB: 64, farmB: 44, thigh: -4, shin: 4, foot: -10 },
    wrongNote: "Hips lifting off the seat as the legs extend — the lower back taking over",
    parts: [{ x: 206, y: 170, t: "ankle pad" }]
  },
  legCurl: {
    prone: true,
    machine: "legCurl", caption: "Curl to the glutes • 1s peak • 3s lower",
    a: { x: 130, y: 110, tilt: 0, torso: 176, head: 172, arm: 170, farm: 166, armB: 174, farmB: 170, thigh: 2, shin: 2, foot: 60 },
    b: { x: 130, y: 110, tilt: 0, torso: 176, head: 172, arm: 170, farm: 166, armB: 174, farmB: 170, thigh: 2, shin: -92, foot: -40 },
    wrong: { x: 130, y: 101, tilt: 28, torso: 176, head: 172, arm: 170, farm: 166, armB: 174, farmB: 170, thigh: 16, shin: -92, foot: -40 },
    wrongNote: "Hips popping up off the pad as you curl — the most common error on this machine",
    parts: [{ x: 96, y: 100, t: "pubic bone pressed down" }, { x: 240, y: 112, t: "roller on calves" }]
  },
  squat: {
    wrong: { x: 150, y: 136, tilt: -28, torso: -60, head: -56, arm: -18, farm: -14, armB: -14, farmB: -10, thigh: 31, shin: 151, foot: 0, thighB: 26, shinB: 146 },
    machine: "floor", caption: "Sit between the hips • chest tall • squeeze the glutes at the top",
    a: { x: 150, y: 100, tilt: 0, torso: -88, head: -86, arm: -8, farm: -6, armB: -4, farmB: -2, thigh: 86, shin: 92, foot: 0, thighB: 90, shinB: 90 },
    b: { x: 150, y: 134, tilt: 0, torso: -74, head: -78, arm: -18, farm: -14, armB: -14, farmB: -10, thigh: 31, shin: 151, foot: 0, thighB: 26, shinB: 146 },
    wrongNote: "Pelvis tucking under at the bottom (\"butt wink\") so the lower back rounds \u2014 stop just above that depth",
    hold: false
  },
  gobletSquat: {
    wrong: { x: 150, y: 136, tilt: -28, torso: -58, head: -48, arm: 84, farm: -18, armB: 88, farmB: -14, thigh: 31, shin: 151, foot: 0, thighB: 26, shinB: 146 },
    machine: "floor", caption: "Weight at the chest as a counterbalance • sit straight down",
    a: { x: 150, y: 100, tilt: 0, torso: -88, head: -86, arm: 62, farm: -46, armB: 66, farmB: -42, thigh: 86, shin: 92, foot: 0, thighB: 90, shinB: 90 },
    b: { x: 150, y: 134, tilt: 0, torso: -76, head: -80, arm: 62, farm: -46, armB: 66, farmB: -42, thigh: 31, shin: 151, foot: 0, thighB: 26, shinB: 146 },
    wrongNote: "Elbows dropping and chest collapsing, which rounds the lower back at the bottom",
    kit: j => dumbbell(j.wrist, 7),
    parts: [{ x: 196, y: 70, t: "held like a goblet" }]
  },
  rdl: {
    wrong: { x: 166, y: 106, tilt: -30, torso: -20, head: 30, arm: 86, farm: 88, armB: 90, farmB: 92, thigh: 96, shin: 84, foot: -4, thighB: 100, shinB: 82 },
    machine: "floor", caption: "Hips push back • bar slides down the shins • squeeze glutes to stand",
    a: { x: 150, y: 102, tilt: 0, torso: -88, head: -86, arm: 88, farm: 88, armB: 92, farmB: 92, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    b: { x: 166, y: 106, tilt: 0, torso: -28, head: -24, arm: 86, farm: 88, armB: 90, farmB: 92, thigh: 96, shin: 84, foot: -4, thighB: 100, shinB: 82 },
    wrongNote: "Lower back rounding at the bottom to reach further down",
    kit: j => dumbbell(j.wrist, 6) + dumbbell(j.wristB, 5),
    parts: [{ x: 120, y: 60, t: "spine stays neutral" }]
  },
  splitSquat: {
    faultPic: false,
    machine: "benchBehind", caption: "Back foot on the bench • drive through the front heel",
    a: { x: 130, y: 102, tilt: 0, torso: -82, head: -80, arm: 86, farm: 88, armB: 90, farmB: 92, thigh: 76, shin: 104, foot: 0, thighB: 19, shinB: -2, footB: 10 },
    b: { x: 130, y: 126, tilt: 0, torso: -78, head: -76, arm: 86, farm: 88, armB: 90, farmB: 92, thigh: 39, shin: 143, foot: 0, thighB: -5, shinB: -19, footB: 10 },
    wrongNote: "Standing too close to the bench — kills the depth and the rear hip-flexor stretch",
    kit: j => dumbbell(j.wrist, 5) + dumbbell(j.wristB, 5),
    parts: [{ x: 200, y: 104, t: "rear hip flexor stretches" }]
  },
  hipThrust: {
    machine: "hipThrustBench", caption: "Chin tucked • drive to a straight knee-to-shoulder line • 2s hold",
    a: { x: 160, y: 162, tilt: 0, torso: -142.7, head: -138.7, arm: 186, farm: 182, armB: 190, farmB: 186, thigh: -42.8, shin: 54.2, foot: 0, thighB: -38.5, shinB: 51.4 },
    b: { x: 172, y: 137, tilt: -4, torso: -175.4, head: -171.4, arm: 186, farm: 182, armB: 190, farmB: 186, thigh: -8.1, shin: 92.9, foot: 0, thighB: -6.5, shinB: 87.9 },
    wrong: { x: 172, y: 130, tilt: 30, torso: -183.4, head: -160, arm: 186, farm: 182, armB: 190, farmB: 186, thigh: 3.4, shin: 93.4, foot: 0, thighB: 4.9, shinB: 88 },
    wrongNote: "Looking at the ceiling and finishing with a lumbar arch instead of a glute squeeze",
    kit: j => barTo({ x: j.pelvis.x - 14, y: j.pelvis.y - 10 }, { x: j.pelvis.x + 14, y: j.pelvis.y - 10 }),
    parts: [{ x: 62, y: 128, t: "upper back on bench" }]
  },
  hipAbduction: {
    faultPic: false,
    machine: "abduction", caption: "Knees push apart • 1s squeeze at the widest point",
    a: { x: 128, y: 122, tilt: 0, torso: -80, head: -76, arm: 54, farm: 40, armB: 58, farmB: 44, thigh: 2, shin: 76, foot: 10, thighB: 10, shinB: 80 },
    b: { x: 128, y: 122, tilt: 0, torso: -80, head: -76, arm: 54, farm: 40, armB: 58, farmB: 44, thigh: -10, shin: 70, foot: 10, thighB: 24, shinB: 90 },
    wrongNote: "Bouncing the pads open with momentum rather than squeezing",
    parts: [{ x: 196, y: 112, t: "pads outside knees" }]
  },
  calfRaise: {
    machine: "step", caption: "Deep heel stretch • full rise onto the toes • 1s squeeze",
    a: { x: 182, y: 110, tilt: 0, torso: -90, head: -88, arm: 88, farm: 88, armB: 92, farmB: 92, thigh: 88, shin: 90, foot: -24, thighB: 92, shinB: 90 },
    b: { x: 182, y: 96, tilt: 0, torso: -90, head: -88, arm: 88, farm: 88, armB: 92, farmB: 92, thigh: 88, shin: 90, foot: 24, thighB: 92, shinB: 90 },
    wrongNote: "Bouncing with the hips and lower back instead of moving only at the ankle",
    parts: [{ x: 236, y: 150, t: "heels hang free" }]
  },
  legSwing: {
    machine: "rackUpright", caption: "Controlled swings • standing hip stays level",
    a: { x: 150, y: 104, tilt: 0, torso: -88, head: -86, arm: 10, farm: 6, armB: 92, farmB: 90, thigh: 88, shin: 90, foot: 0, thighB: 56, shinB: 62 },
    b: { x: 150, y: 104, tilt: 0, torso: -88, head: -86, arm: 10, farm: 6, armB: 92, farmB: 90, thigh: 88, shin: 90, foot: 0, thighB: 118, shinB: 112 },
    wrongNote: "Lower back arching as the leg swings behind — the swing becomes an APT rep",
    hold: false
  },
  kneeHug: {
    machine: "floor",
    caption: "Hug the knee to the chest \u2022 standing hip stays level",
    a: { x: 150, y: 104, tilt: 0, torso: -88, head: -86, arm: 81.1, farm: 77.7, armB: 84.1, farmB: 80.7, thigh: 90, shin: 90, foot: 0, thighB: 60, shinB: 96, footB: 10 },
    b: { x: 150, y: 104, tilt: -4, torso: -86, head: -84, arm: 73.3, farm: 33.9, armB: 76.3, farmB: 36.9, thigh: 90, shin: 90, foot: 0, thighB: -34, shinB: 96, footB: 10 },
    wrong: { x: 150, y: 104, tilt: 28, torso: -96, head: -94, arm: 48.8, farm: 43.9, armB: 51.8, farmB: 46.9, thigh: 90, shin: 90, foot: 0, thighB: -34, shinB: 96, footB: 10 },
    wrongNote: "Lower back arching on the standing side as the knee comes up"
  },

  /* ---------------- APT core work ---------------- */
  pelvicTilt: {
    machine: "mat", caption: "Exhale • roll the pelvis back • lumbar flat • 3s hold",
    a: { x: 150, y: 150, tilt: 16, torso: 182, head: 178, arm: 170, farm: 168, armB: 174, farmB: 172, thigh: -30, shin: 86, foot: 0, thighB: -26, shinB: 88 },
    b: { x: 150, y: 152, tilt: -6, torso: 179, head: 176, arm: 170, farm: 168, armB: 174, farmB: 172, thigh: -30, shin: 86, foot: 0, thighB: -26, shinB: 88 },
    wrong: { x: 150, y: 148, tilt: 26, torso: 184, head: 180, arm: 170, farm: 168, armB: 174, farmB: 172, thigh: -30, shin: 86, foot: 0, thighB: -26, shinB: 88 },
    wrongNote: "Pushing with the feet and arching — the lower back lifts off the mat instead of flattening",
    parts: [{ x: 92, y: 134, t: "lumbar presses flat" }]
  },
  deadbug: {
    machine: "mat", caption: "Back crushed flat • opposite arm and leg extend slowly",
    a: { x: 150, y: 150, tilt: -4, torso: 180, head: 176, arm: -92, farm: -90, armB: -88, farmB: -86, thigh: -88, shin: 2, foot: 60, thighB: -84, shinB: 6 },
    b: { x: 150, y: 150, tilt: -4, torso: 180, head: 176, arm: -150, farm: -172, armB: -88, farmB: -86, thigh: -88, shin: 2, foot: 60, thighB: -6, shinB: 0 },
    wrong: { x: 150, y: 146, tilt: 24, torso: 184, head: 180, arm: -150, farm: -172, armB: -88, farmB: -86, thigh: -88, shin: 2, foot: 60, thighB: 4, shinB: 2 },
    wrongNote: "Extending so far the lower back lifts off the mat — range must follow control",
    parts: [{ x: 92, y: 134, t: "back stays flat" }]
  },
  gluteBridge: {
    machine: "mat",
    caption: "Flatten the back first \u2022 lift from the glutes \u2022 2s hold",
    a: { x: 150, y: 154, tilt: 0, torso: 180, head: 180, arm: 6, farm: 2, armB: 8, farmB: 4, thigh: -45.5, shin: 69.7, foot: 0, thighB: -41.9, shinB: 66.9 },
    b: { x: 146, y: 130, tilt: -4, torso: 153.4, head: 180, arm: 6, farm: 2, armB: 8, farmB: 4, thigh: -4.3, shin: 81.1, foot: 0, thighB: -1.7, shinB: 75.9 },
    wrong: { x: 146, y: 121, tilt: 30, torso: 145.5, head: 180, arm: 6, farm: 2, armB: 8, farmB: 4, thigh: 10.7, shin: 80.2, foot: 0, thighB: 13.6, shinB: 74.2 },
    wrongNote: "Over-bridging into a lumbar arch to get higher \u2014 stop at the straight line",
    parts: [{ x: 214, y: 162, t: "drive through heels" }]
  },
  rkcPlank: {
    prone: true,
    machine: "mat", caption: "Tailbone tucked • glutes and quads at 100% • elbows pull to toes",
    hold: true,
    a: { x: 150, y: 132, tilt: -4, torso: 169, head: 185, arm: 86, farm: 180, armB: 88, farmB: 178, thigh: 23, shin: 14, foot: 70, thighB: 25, shinB: 16 },
    b: { x: 150, y: 129, tilt: -6, torso: 170, head: 186, arm: 86, farm: 180, armB: 88, farmB: 178, thigh: 26, shin: 16, foot: 70, thighB: 28, shinB: 18 },
    wrong: { x: 150, y: 142, tilt: 27, torso: 175, head: 192, arm: 86, farm: 180, armB: 88, farmB: 178, thigh: 14, shin: 10, foot: 74, thighB: 16, shinB: 12 },
    wrongNote: "Belly and hips sagging toward the mat — that is literally practising APT",
    parts: [{ x: 100, y: 108, t: "elbows under shoulders" }]
  },
  sidePlank: {
    prone: true,
    machine: "mat", caption: "One straight line • squeeze the bottom glute • 40s",
    hold: true,
    a: { x: 150, y: 138, tilt: 0, torso: 174, head: 178, arm: 86, farm: 180, armB: -90, farmB: -90, thigh: 23, shin: 8, foot: 60, thighB: 23, shinB: 8 },
    b: { x: 150, y: 135, tilt: -3, torso: 175, head: 179, arm: 86, farm: 180, armB: -90, farmB: -90, thigh: 26, shin: 10, foot: 60, thighB: 26, shinB: 10 },
    wrong: { x: 150, y: 149, tilt: 22, torso: 180, head: 184, arm: 86, farm: 180, armB: -90, farmB: -90, thigh: 14, shin: 4, foot: 64, thighB: 14, shinB: 4 },
    wrongNote: "Hips dropping or rolling forward onto the chest",
    parts: [{ x: 98, y: 110, t: "elbow under shoulder" }]
  },
  birdDog: {
    prone: true,
    machine: "mat", caption: "Arm and opposite leg to parallel • leg never above hip height",
    a: { x: 160, y: 131, tilt: 0, torso: 192, head: 206, arm: 68, farm: 92, armB: 81, farmB: 112, thigh: 90, shin: 8, foot: 0, thighB: 90, shinB: 8 },
    b: { x: 160, y: 131, tilt: 0, torso: 192, head: 200, arm: 162, farm: 202, armB: 81, farmB: 112, thigh: 90, shin: 8, foot: 0, thighB: 14, shinB: -14, footB: -14 },
    wrong: { x: 160, y: 127, tilt: 26, torso: 198, head: 206, arm: 162, farm: 202, armB: 81, farmB: 112, thigh: 90, shin: 8, foot: 0, thighB: -16, shinB: -40, footB: -40 },
    wrongNote: "Leg lifted above hip height — the extra height comes entirely from arching",
    parts: [{ x: 234, y: 112, t: "stop at hip height" }]
  },
  reverseCrunch: {
    faultPic: false,
    machine: "mat", caption: "Roll the pelvis back to bring the knees in • 3s lower",
    a: { x: 150, y: 150, tilt: 4, torso: 180, head: 176, arm: 170, farm: 168, armB: 174, farmB: 172, thigh: -56, shin: 44, foot: 90, thighB: -52, shinB: 48 },
    b: { x: 150, y: 150, tilt: -14, torso: 176, head: 174, arm: 170, farm: 168, armB: 174, farmB: 172, thigh: -110, shin: -10, foot: 60, thighB: -106, shinB: -6 },
    wrongNote: "Swinging the legs with momentum while the pelvis never actually rolls",
    parts: [{ x: 96, y: 136, t: "pelvis rolls, not legs swing" }]
  },
  pallofPress: {
    machine: "cableMid", caption: "Press straight out • 2s hold • resist the rotation",
    a: { x: 140, y: 106, tilt: 0, torso: -88, head: -86, arm: 56, farm: -36, armB: 60, farmB: -32, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    b: { x: 140, y: 106, tilt: 0, torso: -88, head: -86, arm: 6, farm: 2, armB: 10, farmB: 6, thigh: 88, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    wrongNote: "Torso twisting toward the machine, or standing with an arched back",
    kit: j => cableTo({ x: 253, y: 96 }, j.wrist)
  },
  catCamel: {
    prone: true,
    faultPic: false,
    machine: "mat", caption: "Round up, tailbone tucked • then slowly reverse • 3s each way",
    a: { x: 160, y: 131, tilt: -18, torso: 192, head: 232, arm: 81, farm: 112, armB: 83, farmB: 114, thigh: 90, shin: 8, foot: 0, thighB: 90, shinB: 8 },
    b: { x: 160, y: 131, tilt: 20, torso: 192, head: 178, arm: 81, farm: 112, armB: 83, farmB: 114, thigh: 90, shin: 8, foot: 0, thighB: 90, shinB: 8 },
    wrongNote: "Rushing and only moving the mid-back — the tucked end of the range is the one you need",
    hold: false
  },
  breathing90: {
    machine: "wall",
    hold: true,
    caption: "4s in through the nose \u2022 8s out \u2022 ribs drop, tailbone tucked",
    a: { x: 201, y: 155, tilt: -6, torso: 180, head: 180, arm: -90, farm: -90, armB: -86, farmB: -86, thigh: -90, shin: 0, foot: -90, thighB: -86, shinB: 2, footB: -88 },
    b: { x: 201, y: 156, tilt: -12, torso: 179, head: 179, arm: -90, farm: -90, armB: -86, farmB: -86, thigh: -90, shin: 0, foot: -90, thighB: -86, shinB: 2, footB: -88 },
    wrong: { x: 201, y: 151, tilt: 24, torso: 184, head: 184, arm: -90, farm: -90, armB: -86, farmB: -86, thigh: -90, shin: 0, foot: -90, thighB: -86, shinB: 2, footB: -88 },
    wrongNote: "Chest breathing with the ribs flared \u2014 a neutral pelvis is almost impossible from here",
    parts: [{ x: 230, y: 92, t: "feet flat on wall, 90/90" }]
  },
  wallPostureReset: {
    machine: "wallLeft",
    hold: true,
    caption: "Tuck until the hand behind your back is pinned \u2022 then walk 10 steps",
    a: { x: 88, y: 104, torso: -90, head: -90, thigh: 93, shin: 90, foot: 0, thighB: 95, shinB: 90, tilt: 10, arm: 92, farm: 96, armB: 120, farmB: 30 },
    b: { x: 88, y: 104, torso: -90, head: -90, thigh: 93, shin: 90, foot: 0, thighB: 95, shinB: 90, tilt: -8, arm: 92, farm: 96, armB: 120, farmB: 30 },
    wrong: { x: 92, y: 104, torso: -94, head: -90, thigh: 93, shin: 90, foot: 0, thighB: 95, shinB: 90, tilt: 28, arm: 92, farm: 96, armB: 120, farmB: 30 },
    wrongNote: "A whole fist fits behind the lower back \u2014 significant APT, the usual week-1 result",
    parts: [{ x: 80, y: 120, t: "close this gap" }]
  },
  wallSlide: {
    machine: "wallLeft",
    caption: "Forearms slide overhead \u2022 lower back stays flat on the wall",
    a: { x: 88, y: 104, torso: -90, head: -90, thigh: 93, shin: 90, foot: 0, thighB: 95, shinB: 90, tilt: -2, arm: 100, farm: -96, armB: 104, farmB: -92 },
    b: { x: 88, y: 104, torso: -90, head: -90, thigh: 93, shin: 90, foot: 0, thighB: 95, shinB: 90, tilt: -2, arm: -96, farm: -94, armB: -92, farmB: -90 },
    wrong: { x: 92, y: 104, torso: -94, head: -90, thigh: 93, shin: 90, foot: 0, thighB: 95, shinB: 90, tilt: 28, arm: -96, farm: -94, armB: -92, farmB: -90 },
    wrongNote: "Lower back peeling off the wall so the arms can reach higher \u2014 a live APT test you just failed",
    parts: [{ x: 80, y: 122, t: "lumbar flat on wall" }]
  },

  /* ---------------- stretches & release ---------------- */
  hipFlexorStretch: {
    machine: "mat",
    hold: true,
    caption: "1 tuck tailbone \u2022 2 squeeze glute \u2022 3 shift forward just 2 inches",
    a: { x: 128, y: 130, tilt: -2, torso: -90, head: -88, arm: 91.3, farm: 66.5, armB: 95.3, farmB: 70.5, thigh: -4.7, shin: 84.6, foot: 0, thighB: 113.6, shinB: 180, footB: 180 },
    b: { x: 132, y: 130, tilt: -12, torso: -90, head: -88, arm: 91.3, farm: 66.5, armB: 95.3, farmB: 70.5, thigh: -4.9, shin: 91.5, foot: 0, thighB: 119.4, shinB: 180, footB: 180 },
    wrong: { x: 140, y: 136, tilt: 30, torso: -76, head: -74, arm: 114.8, farm: 72.2, armB: 118.8, farmB: 76.2, thigh: -14.8, shin: 93.2, foot: 0, thighB: 135, shinB: 180, footB: 180 },
    wrongNote: "Deep lunge with an arched back \u2014 that compresses the lumbar spine and does nothing for the psoas",
    parts: [{ x: 96, y: 150, t: "rear knee on the mat" }, { x: 206, y: 150, t: "front foot at 90\u00b0" }]
  },
  couchStretch: {
    machine: "wallLeft",
    hold: true,
    caption: "Rear shin up the wall \u2022 tuck and squeeze \u2022 torso toward vertical",
    a: { x: 102, y: 133, tilt: -4, torso: -66, head: -62, arm: 77.9, farm: 72.9, armB: 81.9, farmB: 76.9, thigh: -6.5, shin: 87.9, foot: 0, thighB: 121, shinB: -90, footB: -90 },
    b: { x: 102, y: 133, tilt: -12, torso: -88, head: -84, arm: 61.7, farm: 57.5, armB: 65.7, farmB: 61.5, thigh: -6.5, shin: 87.9, foot: 0, thighB: 121, shinB: -90, footB: -90 },
    wrong: { x: 104, y: 135, tilt: 30, torso: -98, head: -94, arm: 54.8, farm: 50.8, armB: 58.8, farmB: 54.8, thigh: -9.8, shin: 87.4, foot: 0, thighB: 125.5, shinB: -90, footB: -90 },
    wrongNote: "Going fully upright before the hips allow it, so the lower back arches to compensate",
    parts: [{ x: 80, y: 124, t: "rear shin up the wall" }]
  },
  quadStretch: {
    machine: "rackUpright", caption: "Tuck the tailbone FIRST, then pull the heel in",
    hold: true,
    a: { x: 150, y: 104, tilt: 0, torso: -88, head: -86, arm: 14, farm: 8, armB: 96, farmB: 150, thigh: 90, shin: 90, foot: 0, thighB: 100, shinB: -40, footB: 20 },
    b: { x: 150, y: 104, tilt: -10, torso: -90, head: -88, arm: 14, farm: 8, armB: 96, farmB: 156, thigh: 90, shin: 90, foot: 0, thighB: 104, shinB: -52, footB: 14 },
    wrong: { x: 150, y: 104, tilt: 26, torso: -84, head: -82, arm: 14, farm: 8, armB: 96, farmB: 150, thigh: 90, shin: 90, foot: 0, thighB: 76, shinB: -36, footB: 24 },
    wrongNote: "Arching the back and letting the knee drift forward — you feel a pull but lengthen nothing",
    parts: [{ x: 196, y: 140, t: "knee stays under the hip" }]
  },
  hamstringStretch: {
    machine: "mat",
    hold: true,
    caption: "Hinge from the hip with a FLAT back \u2022 45s",
    a: { x: 116, y: 152, tilt: 0, torso: -84, head: -80, arm: 13.1, farm: -43.6, armB: 16.1, farmB: -40.6, thigh: 2, shin: 0, foot: -78, thighB: -18, shinB: 166, footB: 150 },
    b: { x: 116, y: 152, tilt: -4, torso: -50, head: -46, arm: 47.1, farm: -9.6, armB: 50.1, farmB: -6.6, thigh: 2, shin: 0, foot: -78, thighB: -18, shinB: 166, footB: 150 },
    wrong: { x: 116, y: 152, tilt: -30, torso: -30, head: 40, arm: 67.1, farm: 10.4, armB: 70.1, farmB: 13.4, thigh: 2, shin: 0, foot: -78, thighB: -18, shinB: 166, footB: 150 },
    wrongNote: "Rounding the spine to touch the toes \u2014 less range with a flat back is the better stretch",
    parts: [{ x: 226, y: 160, t: "straight leg" }]
  },
  figure4: {
    machine: "mat",
    hold: true,
    caption: "Pull the knee in \u2022 lower back stays flat \u2022 45s",
    a: { x: 150, y: 154, tilt: -2, torso: 180, head: 178, arm: -28.2, farm: -24.2, armB: -25.2, farmB: -21.2, thigh: -66, shin: 28, foot: 70, thighB: -36, shinB: 16, footB: 10 },
    b: { x: 150, y: 154, tilt: -8, torso: 179, head: 177, arm: -34.1, farm: -30, armB: -31.1, farmB: -27, thigh: -80, shin: 18, foot: 70, thighB: -44, shinB: 8, footB: 10 },
    wrong: { x: 150, y: 150, tilt: 24, torso: 184, head: 182, arm: -30.6, farm: -26.3, armB: -27.6, farmB: -23.3, thigh: -80, shin: 18, foot: 70, thighB: -44, shinB: 8, footB: 10 },
    wrongNote: "Hips rolling and the back lifting off the mat as you pull the knee in",
    parts: [{ x: 94, y: 140, t: "back flat on mat" }]
  },
  childPose: {
    prone: true,
    faultPic: false,
    machine: "mat", caption: "Sink the hips back • breathe into the lower back • 60s",
    hold: true,
    a: { x: 168, y: 142, tilt: 0, torso: 170, head: 166, arm: 172, farm: 176, armB: 176, farmB: 178, thigh: 74, shin: 170, foot: 100, thighB: 78, shinB: 172 },
    b: { x: 172, y: 146, tilt: -4, torso: 172, head: 170, arm: 174, farm: 178, armB: 178, farmB: 179, thigh: 72, shin: 172, foot: 100, thighB: 76, shinB: 174 },
    wrongNote: "Holding your breath — the decompression comes from the exhale",
    parts: [{ x: 70, y: 132, t: "arms reach long" }]
  },
  pecStretch: {
    machine: "doorway",
    hold: true,
    caption: "Forearm on the frame \u2022 step through gently \u2022 ribs down \u2022 30s",
    a: { x: 88, y: 106, tilt: 0, torso: -90, head: -88, arm: -85.8, farm: 175.4, armB: 94, farmB: 92, thigh: 82, shin: 96, foot: 0, thighB: 100, shinB: 86 },
    b: { x: 92, y: 106, tilt: -4, torso: -88, head: -86, arm: -98.6, farm: 175.9, armB: 94, farmB: 92, thigh: 82, shin: 96, foot: 0, thighB: 100, shinB: 86 },
    wrong: { x: 94, y: 106, tilt: 28, torso: -96, head: -94, arm: -87, farm: 175.3, armB: 94, farmB: 92, thigh: 82, shin: 96, foot: 0, thighB: 100, shinB: 86 },
    wrongNote: "Arching the back to feel a bigger stretch \u2014 that stretches your spine, not your chest",
    parts: [{ x: 66, y: 20, t: "forearm on the frame" }]
  },
  latStretch: {
    machine: "rackUpright",
    hold: true,
    caption: "Hold at waist height \u2022 sit the hips back and away \u2022 30s",
    a: { x: 170, y: 106, tilt: 0, torso: -62, head: -56, arm: 48.2, farm: 69.9, armB: 51.2, farmB: 72.9, thigh: 52.6, shin: 102.7, foot: 0, thighB: 51.4, shinB: 98.4 },
    b: { x: 158, y: 116, tilt: -6, torso: -34, head: -28, arm: -18.4, farm: 103.9, armB: -15.4, farmB: 106.9, thigh: 29.6, shin: 97.7, foot: 0, thighB: 29.1, shinB: 92.7 },
    wrong: { x: 160, y: 114, tilt: 28, torso: -40, head: -34, arm: -4.1, farm: 103.9, armB: -1.1, farmB: 106.9, thigh: 33.7, shin: 98.9, foot: 0, thighB: 33, shinB: 94.1 },
    wrongNote: "Hollowing the lower back to deepen it instead of sitting the hips back",
    parts: [{ x: 226, y: 92, t: "hold at waist height" }]
  },
  thoracicOpener: {
    machine: "rollerBack",
    faultPic: false,
    caption: "Extend over the roller \u2022 MID-back only \u2022 10 reps + 30s hold",
    a: { x: 210, y: 156, tilt: 0, torso: 190, head: 192, arm: 204, farm: -24, armB: 208, farmB: -20, thigh: -52, shin: 72, foot: 0, thighB: -48, shinB: 76 },
    b: { x: 210, y: 156, tilt: -4, torso: 198, head: 214, arm: 204, farm: -24, armB: 208, farmB: -20, thigh: -52, shin: 72, foot: 0, thighB: -48, shinB: 76 },
    wrongNote: "Letting the roller slide down to the lower back and cranking there",
    parts: [{ x: 180, y: 186, t: "roller under mid-back" }]
  },
  foamRollQuad: {
    prone: true,
    faultPic: false,
    machine: "roller", caption: "Slow • pause and breathe out on the tender spots",
    a: { x: 118, y: 130, tilt: 0, torso: 158, head: 150, arm: 70, farm: 88, armB: 74, farmB: 90, thigh: 12, shin: 6, foot: 60, thighB: 16, shinB: 10 },
    b: { x: 142, y: 130, tilt: 0, torso: 158, head: 150, arm: 70, farm: 88, armB: 74, farmB: 90, thigh: 12, shin: 6, foot: 60, thighB: 16, shinB: 10 },
    wrongNote: "Rolling fast like a rolling pin instead of pausing where it bites",
    parts: [{ x: 206, y: 176, t: "roller under front of thigh" }]
  },
  foamRollGlute: {
    faultPic: false,
    machine: "roller", caption: "Sit on the roller, ankle crossed over the knee • 90s per side",
    a: { x: 174, y: 136, tilt: 0, torso: -108, head: -104, arm: 58, farm: 70, armB: 62, farmB: 74, thigh: 150, shin: 120, foot: 60, thighB: 120, shinB: 150 },
    b: { x: 182, y: 138, tilt: 0, torso: -108, head: -104, arm: 58, farm: 70, armB: 62, farmB: 74, thigh: 150, shin: 120, foot: 60, thighB: 120, shinB: 150 },
    wrongNote: "Rolling directly on the lower spine — in APT those erectors guard harder, not softer",
    parts: [{ x: 196, y: 178, t: "never roll the lumbar spine" }]
  },

  /* ---------------- cardio & misc ---------------- */
  treadmillWalk: {
    faultPic: false,
    machine: "treadmill", caption: "Tall posture • ribs over pelvis • hands OFF the rails",
    a: { x: 150, y: 110, tilt: 0, torso: -88, head: -86, arm: 62, farm: 40, armB: 118, farmB: 140, thigh: 62, shin: 100, foot: 10, thighB: 112, shinB: 86, footB: -10 },
    b: { x: 150, y: 108, tilt: 0, torso: -88, head: -86, arm: 118, farm: 140, armB: 62, farmB: 40, thigh: 112, shin: 86, foot: -10, thighB: 62, shinB: 100, footB: 10 },
    wrongNote: "Gripping the rails and leaning back, which cuts the real effort roughly in half",
    hold: false
  },
  crossTrainer: {
    faultPic: false,
    machine: "bike", caption: "Upright, conversational pace • do not hang off the handles",
    a: { x: 150, y: 104, tilt: 0, torso: -88, head: -86, arm: 40, farm: 20, armB: 110, farmB: 130, thigh: 66, shin: 104, foot: 0, thighB: 114, shinB: 82 },
    b: { x: 150, y: 104, tilt: 0, torso: -88, head: -86, arm: 110, farm: 130, armB: 40, farmB: 20, thigh: 114, shin: 82, foot: 0, thighB: 66, shinB: 104 },
    wrongNote: "Slumping forward on the handles — rehearsing desk posture with your heart rate up",
    hold: false
  },
  bikeCycle: {
    faultAt: "a",
    wrong: { x: 156, y: 114, tilt: -26, torso: -108, head: -82, arm: -16, farm: -20, armB: -12, farmB: -16, thigh: 20, shin: 96, foot: 10, thighB: 60, shinB: 40 },
    machine: "bike", caption: "Sit on the sit bones • easy 5 minutes",
    a: { x: 156, y: 112, tilt: 0, torso: -96, head: -88, arm: -16, farm: -20, armB: -12, farmB: -16, thigh: 20, shin: 96, foot: 10, thighB: 60, shinB: 40 },
    b: { x: 156, y: 112, tilt: 0, torso: -96, head: -88, arm: -16, farm: -20, armB: -12, farmB: -16, thigh: 60, shin: 40, foot: 10, thighB: 20, shinB: 96 },
    wrongNote: "Slumping back onto the tailbone, which rounds the lumbar spine",
    hold: false
  },
  rower: {
    faultAt: "a",
    wrong: { x: 132, y: 126, tilt: -28, torso: -60, head: -30, arm: -6, farm: -2, armB: -2, farmB: 2, thigh: 10, shin: 160, foot: 10 },
    machine: "rower", caption: "Hinge from the hips with a neutral spine • legs, then back, then arms",
    a: { x: 132, y: 126, tilt: 0, torso: -76, head: -72, arm: -6, farm: -2, armB: -2, farmB: 2, thigh: 10, shin: 160, foot: 10 },
    b: { x: 160, y: 126, tilt: 0, torso: -104, head: -98, arm: 150, farm: 10, armB: 154, farmB: 14, thigh: 2, shin: 4, foot: -40 },
    wrongNote: "Yanking with the arms and rounding the lower back",
    hold: false
  },
  walk: {
    machine: "floor", caption: "Ribs down • tailbone slightly tucked • glutes lightly on",
    a: { x: 150, y: 110, tilt: 0, torso: -90, head: -88, arm: 60, farm: 40, armB: 120, farmB: 140, thigh: 60, shin: 102, foot: 10, thighB: 114, shinB: 84, footB: -10 },
    b: { x: 150, y: 108, tilt: 0, torso: -90, head: -88, arm: 120, farm: 140, armB: 60, farmB: 40, thigh: 114, shin: 84, foot: -10, thighB: 60, shinB: 102, footB: 10 },
    wrongNote: "Walking with ribs flared and the pelvis tipped — thousands of steps rehearsing the fault",
    hold: false
  },
  checkIn: {
    faultPic: false,
    machine: "scale", caption: "Same day, same time, same conditions — then judge the 7-day average",
    hold: true,
    a: { x: 160, y: 106, tilt: 0, torso: -90, head: -88, arm: 86, farm: 88, armB: 92, farmB: 90, thigh: 90, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    b: { x: 160, y: 106, tilt: -4, torso: -90, head: -88, arm: 86, farm: 88, armB: 92, farmB: 90, thigh: 90, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    wrongNote: "Correcting your posture for the side photo, which destroys the only objective record you have",
    parts: [{ x: 160, y: 148, t: "before food or water" }]
  },
  prep: {
    faultPic: false,
    machine: "floor", caption: "The half hour that makes the other six days possible",
    hold: true,
    a: { x: 150, y: 108, tilt: 0, torso: -88, head: -84, arm: 50, farm: 20, armB: 92, farmB: 90, thigh: 90, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    b: { x: 150, y: 108, tilt: -4, torso: -88, head: -84, arm: 46, farm: 14, armB: 92, farmB: 90, thigh: 90, shin: 90, foot: 0, thighB: 92, shinB: 90 },
    wrongNote: "Skipping prep and relying on willpower at 11 PM",
    parts: [{ x: 150, y: 150, t: "portion 6 days at once" }]
  }
};

/* ==========================================================================
   Rendering
   ========================================================================== */

const LERP_KEYS = ["x", "y", "tilt", "torso", "head", "arm", "farm", "armB", "farmB",
  "thigh", "shin", "foot", "thighB", "shinB", "footB"];

function lerpPose(a, b, t) {
  const out = {};
  for (const k of LERP_KEYS) {
    const va = a[k], vb = b[k] ?? a[k];
    if (va === undefined && vb === undefined) continue;
    const s = va === undefined ? vb : va;
    const e = vb === undefined ? va : vb;
    out[k] = s + (e - s) * t;
  }
  return out;
}

const easeInOut = t => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);

/* A faulty pose when a template does not define one: the lower back arched. */
function deriveWrong(pose) {
  return { ...pose, tilt: (pose.tilt || 0) + 26, torso: pose.torso + (pose.torso < 0 ? -5 : 5) };
}

/* The pose the fault is shown at, and the faulty version of it. */
function faultPoses(tpl) {
  const good = tpl.faultAt === "a" ? tpl.a : tpl.b;
  return { good, bad: tpl.wrong || deriveWrong(good) };
}

/* Read the fault off the pelvis so the label always matches the picture. */
function faultKind(good, bad) {
  return (bad.tilt || 0) >= (good.tilt || 0) ? "arched" : "rounded";
}

function partLabels(parts) {
  if (!parts) return "";
  return parts.map(p =>
    `<g><circle cx="${p.x}" cy="${p.y}" r="3" fill="${C.accent}"/>
     <text x="${p.x < 160 ? p.x + 7 : p.x - 7}" y="${p.y + 3.5}" fill="${C.accent}" font-size="9"
       text-anchor="${p.x < 160 ? "start" : "end"}">${p.t}</text></g>`
  ).join("");
}

/* A viewBox that frames the body rather than the whole 320x200 scene, so
   the figure is large enough to read in a half-width panel. */
function frameFor(poses) {
  let x0 = Infinity, y0 = Infinity, x1 = -Infinity, y1 = -Infinity;
  for (const p of poses) {
    for (const q of Object.values(joints(p))) {
      x0 = Math.min(x0, q.x); y0 = Math.min(y0, q.y);
      x1 = Math.max(x1, q.x); y1 = Math.max(y1, q.y);
    }
  }
  const pad = 26;
  let w = Math.max(150, x1 - x0 + pad * 2), h = Math.max(112, y1 - y0 + pad * 2);
  if (w / h > 4 / 3) h = w * 3 / 4; else w = h * 4 / 3;
  let x = (x0 + x1) / 2 - w / 2, y = (y0 + y1) / 2 - h / 2;
  x = Math.max(0, Math.min(320 - w, x));
  y = Math.max(0, Math.min(200 - h, y));
  return `${x.toFixed(1)} ${y.toFixed(1)} ${Math.min(320, w).toFixed(1)} ${Math.min(200, h).toFixed(1)}`;
}

/* Dumbbells, cables, bars and the sled plate attached to the figure's hands/feet. */
function kitFor(tpl, pose) {
  return tpl.kit ? tpl.kit(joints(pose)) : "";
}

/* Dashed ring around the lumbar spine — where to look. */
function lumbarRing(p, color) {
  const j = joints(p);
  const cx = j.pelvis.x + (j.shoulder.x - j.pelvis.x) * 0.38;
  const cy = j.pelvis.y + (j.shoulder.y - j.pelvis.y) * 0.38;
  return `<circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="22" fill="none"
    stroke="${color}" stroke-width="2.5" stroke-dasharray="5 3"/>`;
}

/**
 * Correct vs wrong as two SEPARATE panels, each with its own machine, the
 * same framing, and the lower back circled. Static on purpose: two figures
 * moving at once is hard to compare; one frozen moment is not.
 * Returns false when the fault is not about posture (text-only then).
 */
function drawFormCheck(ex, host) {
  const tpl = ANIM[ex && ex.anim];
  if (!tpl || tpl.faultPic === false) { host.innerHTML = ""; return false; }
  const { good, bad } = faultPoses(tpl);
  const kind = faultKind(good, bad);
  const vb = frameFor([good, bad]);
  const machine = (MACHINES[tpl.machine] || MACHINES.none)();
  const panel = (pose, isBad) => `
    <svg viewBox="${vb}" class="w-full h-auto block" role="img"
      aria-label="${isBad ? "Wrong" : "Correct"} form: lower back ${isBad ? kind : "neutral"}">
      <rect x="-10" y="-10" width="340" height="220" fill="${isBad ? "#1c0b0b" : "#071a12"}"/>
      ${machine}
      ${figure(pose, { bad: isBad, prone: tpl.prone })}
      ${kitFor(tpl, pose)}
      ${lumbarRing(pose, isBad ? "#fca5a5" : "#6ee7b7")}
    </svg>`;
  host.innerHTML = `
    <div class="grid grid-cols-2 gap-2">
      <figure class="rounded-lg overflow-hidden border-2 border-emerald-500/70 bg-slate-950">
        ${panel(good, false)}
        <figcaption class="text-[10px] font-extrabold text-emerald-300 bg-emerald-500/15 px-2 py-1.5 leading-tight">
          ✓ CORRECT<span class="block font-semibold text-emerald-200/80">Lower back neutral</span></figcaption>
      </figure>
      <figure class="rounded-lg overflow-hidden border-2 border-red-500/70 bg-slate-950">
        ${panel(bad, true)}
        <figcaption class="text-[10px] font-extrabold text-red-300 bg-red-500/15 px-2 py-1.5 leading-tight">
          ✗ WRONG<span class="block font-semibold text-red-200/80">Lower back ${kind}</span></figcaption>
      </figure>
    </div>`;
  return true;
}

/* The tempo timeline. Holds breathe; reps move on a real 1-1-3 tempo. */
function phasesFor(tpl) {
  return tpl.hold
    ? [{ to: 1, ms: 2400 }, { to: 0, ms: 2400 }]
    : [{ to: 1, ms: 1000 }, { to: 1, ms: 800 }, { to: 0, ms: 2600 }, { to: 0, ms: 400 }];
}

/**
 * Animated diagram of the correct movement. Used for the drills that have
 * no faithful photo (bird dog, pelvic tilt, 90/90 breathing, wall drills...).
 */
function drawExercise(ex, host) {
  stopExercise(host);
  const tpl = ANIM[ex && ex.anim] || null;
  if (!tpl) {
    host.innerHTML = `<div class="text-[11px] text-slate-500 py-8 text-center">
      No diagram for this item — follow the numbered steps below.</div>`;
    return;
  }
  const machine = (MACHINES[tpl.machine] || MACHINES.none)();
  host.innerHTML = `
    <svg viewBox="${frameFor([tpl.a, tpl.b])}" class="w-full h-full" role="img" aria-label="${ex.name} diagram">
      <rect x="-10" y="-10" width="340" height="220" fill="#020617"/>
      <g>${machine}</g>
      <g class="fx-body"></g>
      <g>${partLabels(tpl.parts)}</g>
    </svg>`;
  const bodyG = host.querySelector(".fx-body");
  const phases = phasesFor(tpl);
  let pi = 0, t0 = performance.now(), from = 0;
  const step = now => {
    const ph = phases[pi];
    const k = Math.min(1, (now - t0) / ph.ms);
    const t = from + (ph.to - from) * easeInOut(k);
    const pose = lerpPose(tpl.a, tpl.b, t);
    bodyG.innerHTML = figure(pose, { showHands: true, prone: tpl.prone }) + kitFor(tpl, pose);
    if (k >= 1) { from = ph.to; pi = (pi + 1) % phases.length; t0 = now; }
    host._fxHandle = requestAnimationFrame(step);
  };
  host._fxHandle = requestAnimationFrame(step);
}

function stopExercise(host) {
  if (host && host._fxHandle) {
    cancelAnimationFrame(host._fxHandle);
    host._fxHandle = null;
  }
}

/* A small static thumbnail of a pose — used on exercise cards. */
function thumbExercise(ex) {
  const tpl = ANIM[ex && ex.anim];
  if (!tpl) return "";
  return `<svg viewBox="0 0 320 200" class="w-full h-full" aria-hidden="true">
    <g opacity="0.45">${(MACHINES[tpl.machine] || MACHINES.none)()}</g>
    ${figure(lerpPose(tpl.a, tpl.b, 0.65), { prone: tpl.prone })}${kitFor(tpl, lerpPose(tpl.a, tpl.b, 0.65))}
  </svg>`;
}
