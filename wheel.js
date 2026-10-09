/**
 * Wheel: an F1 racing wheel resting on a plinth. The pointer turns the wheel
 * about its axle on a spring, its ten radiating spokes catching the light in
 * turn, and the central centerlock nut follows it.
 */
const {
  Cam, circ, clamp, disposer, facing, fit, mk, open, place, pointer, poly,
  prism, proj, put, rad, register, ringAt, rings, seg, solid, spring, stepS,
} = HL;

const SPOKES = 10, R_TIRE = 52, R_RIM = 40, R_HUB = 16, R_NUT = 7;
const Z_BASE = -6, Z_RIM_BASE = 12, Z_HUB = 20, Z_NUT = 26;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let coast = value;

  const C = Cam(45, 0.5, 1.85);
  fit(C, [
    [-68, -68, Z_BASE], [68, 68, Z_BASE], [68, -68, Z_BASE], [-68, 68, Z_BASE],
    [0, 0, Z_NUT + 6],
  ], 200, 166);

  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // 1. Plinth base
  const [bRing, bIn] = rings(-64, -64, 64, 64, 12, 2.2);
  put(solid(g), prism(P, front, bRing, bIn, Z_BASE, 0));

  // 2. Outer tire cylinder (Z: 0 to 28)
  const tireRing = circ(R_TIRE, 64), tireIn = circ(R_TIRE - 2.5, 64);
  const tireSolid = solid(g);
  put(tireSolid, prism(P, front, tireRing, tireIn, 0, 28));

  // 3. Inset Rim well drop (Z: 28 down to Z_RIM_BASE)
  const rimTop = circ(R_RIM, 48), rimBase = circ(R_RIM, 48);
  mk("path", { d: poly(ringAt(P, rimTop, 28)), class: "sil" }, g);
  mk("path", { d: poly(ringAt(P, rimBase, Z_RIM_BASE)), class: "lo" }, g);

  // 4. Center hub solid (Z_RIM_BASE to Z_HUB)
  const hubRing = circ(R_HUB, 32), hubIn = circ(R_HUB - 1.8, 32);
  const hubSolid = solid(g);
  put(hubSolid, prism(P, front, hubRing, hubIn, Z_RIM_BASE, Z_HUB));

  // 5. Spokes group (radiate from R_HUB to R_RIM at Z = 16)
  const spokeGrp = mk("g", {}, g);
  const spokeLines = [];
  for (let i = 0; i < SPOKES; i++) {
    const p1 = mk("path", { class: "lo" }, spokeGrp);
    const p2 = mk("path", { class: "lo" }, spokeGrp);
    spokeLines.push({ p1, p2 });
  }

  // 6. Centerlock nut solid (Z_HUB to Z_NUT)
  const nutRing = circ(R_NUT, 16), nutIn = circ(R_NUT - 1.2, 16);
  const nutSolid = solid(g);
  put(nutSolid, prism(P, front, nutRing, nutIn, Z_HUB, Z_NUT));

  // Center lock pin dot
  const pinDot = mk("circle", { r: 1.8, class: "dot" }, g);
  place(pinDot, P(0, 0, Z_NUT));

  // Rotation physics
  const REST_ANG = rad(24);
  const rotSp = spring(REST_ANG, { k: 120, c: 16 });
  let active = false;

  function drawSpokes(ang) {
    for (let i = 0; i < SPOKES; i++) {
      const a = ang + (i * 2 * Math.PI) / SPOKES;
      const ca = Math.cos(a), sa = Math.sin(a);
      const r1 = P(R_HUB * ca, R_HUB * sa, 16);
      const r2 = P(R_RIM * ca, R_RIM * sa, 16);
      // Small rib thickness offset
      const perpA = a + Math.PI / 2;
      const offX = 1.2 * Math.cos(perpA), offY = 1.2 * Math.sin(perpA);
      const r1b = P(R_HUB * ca + offX, R_HUB * sa + offY, 16);
      const r2b = P(R_RIM * ca + offX, R_RIM * sa + offY, 16);

      spokeLines[i].p1.setAttribute("d", seg(r1, r2));
      spokeLines[i].p2.setAttribute("d", seg(r1b, r2b));
    }
  }

  const B = register(stage, (dt) => {
    const moving = stepS(rotSp, dt);
    drawSpokes(rotSp.x);

    // Find spoke nearest the front-right viewpoint
    const curA = ((rotSp.x % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI);
    const step = (2 * Math.PI) / SPOKES;
    const bestI = Math.round(curA / step) % SPOKES;

    spokeLines.forEach((sp, idx) => {
      const isLit = active && idx === bestI;
      sp.p1.classList.toggle("hi", isLit);
      sp.p2.classList.toggle("hi", isLit);
    });

    if (active) {
      read.textContent = `spoke ${(bestI + 1).toString().padStart(2, "0")}`;
    } else {
      read.textContent = "rest";
    }

    return moving;
  });
  bag.add(B.unregister);

  // Pointer interaction: pointer position relative to center turns wheel
  bag.add(pointer(stage, {
    move: ([px, py]) => {
      active = true;
      const dx = px - 200, dy = py - 166;
      const target = Math.atan2(dy, dx) * coast;
      rotSp.t = target;
      B.wake();
    },
    leave: () => {
      active = false;
      rotSp.t = REST_ANG;
      B.wake();
    },
  }));

  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { coast = v; },
    destroy: bag.dispose,
  };
}

hairline({
  name: "wheel",
  means: "An F1 wheel on a plinth: moving the pointer turns the wheel about its axle on a spring, each spoke catching the light in turn.",
  rules: [1, 4, 8, 9],
  range: [0.5, 1.0, 2.0],
  tour: [[160, 130], [260, 170], [200, 150], null],
  mount,
});
