/**
 * Pitstop: an isometric Formula 1 race car viewed at three-quarter angle.
 * Hovering triggers a pit stop: all four wheels detach and fly outward along
 * their axle trajectories on springs. Pointing at an individual wheel highlights
 * it and exposes its hub details. The slider controls the axle explosion distance.
 */
const {
  Cam, circ, facing, fit, hull, mk, open, poly, proj, put, register,
  rings, rrect, run, seg, solid, spring, stepS, unproj, disposer, pointer,
} = HL;

const TRACK = 42, WB_F = 50, WB_R = -48, WR = 14, WT = 11;
const WHEELS = [
  { id: "fl", name: "wheel fl", x: WB_F, y: -TRACK, z: 12, dir: [0.35, -1] },
  { id: "fr", name: "wheel fr", x: WB_F, y: TRACK, z: 12, dir: [0.35, 1] },
  { id: "rl", name: "wheel rl", x: WB_R, y: -TRACK, z: 13, dir: [-0.35, -1] },
  { id: "rr", name: "wheel rr", x: WB_R, y: TRACK, z: 13, dir: [-0.35, 1] },
];

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxExplode = value;

  const C = Cam(45, 0.5, 1.44);
  fit(C, [[-95, -TRACK - 50, 0], [105, TRACK + 50, 0], [-95, -TRACK - 50, 38], [105, TRACK + 50, 38]], 200, 160);
  const P = proj(C), front = facing(C);
  const g = mk("g", {}, svg);

  // 1. Rear Wing assembly (z: 16 -> 32)
  const [rwR, rwI] = rings(-84, -28, -66, 28, 2.5, 1.2), rwSolid = solid(g);
  put(rwSolid, {
    sil: poly(hull(rwR.map((q) => P(q.u, q.v, 32)).concat(rwR.map((q) => P(q.u, q.v, 16))))),
    crease: open(rwI.map((q) => P(q.u, q.v, 32))),
  });
  const epL1 = P(-86, -28, 12), epL2 = P(-64, -28, 34), epR1 = P(-86, 28, 12), epR2 = P(-64, 28, 34);
  mk("path", { d: `${seg(epL1, epL2)} ${seg([epL1[0], epL2[1]], [epL2[0], epL1[1]])}`, class: "nf lo" }, g);
  mk("path", { d: `${seg(epR1, epR2)} ${seg([epR1[0], epR2[1]], [epR2[0], epR1[1]])}`, class: "nf lo" }, g);

  // 2. Underfloor & Diffuser (z: 0 -> 4)
  const [flR, flI] = rings(-78, -30, 65, 30, 5, 1.5), floorSolid = solid(g);
  put(floorSolid, {
    sil: poly(hull(flR.map((q) => P(q.u, q.v, 4)).concat(flR.map((q) => P(q.u, q.v, 0))))),
    crease: open(run(flI, front).map((q) => P(q.u, q.v, 4))),
  });

  // 3. Engine Cowling & Air Intake (z: 4 -> 30)
  const [engR, engI] = rings(-60, -11, 10, 11, 4.5, 1.2), engSolid = solid(g);
  put(engSolid, {
    sil: poly(hull(engR.map((q) => P(q.u, q.v, 30)).concat(engR.map((q) => P(q.u, q.v, 4))))),
    crease: open(run(engI, front).map((q) => P(q.u, q.v, 30))),
  });
  // Airbox roll-hoop intake
  mk("path", { d: poly(rrect(-6, -6, 2, 6, 2.5).map((q) => P(q.u, q.v, 29))), class: "nf lo" }, g);

  // 4. Cockpit surround & Halo (z: 14 -> 24)
  const [haloR, haloI] = rings(-12, -9, 18, 9, 4, 1.1), haloSolid = solid(g);
  put(haloSolid, {
    sil: poly(hull(haloR.map((q) => P(q.u, q.v, 24)).concat(haloR.map((q) => P(q.u, q.v, 14))))),
    crease: open(run(haloI, front).map((q) => P(q.u, q.v, 24))),
  });
  // Cockpit opening recess
  mk("path", { d: poly(rrect(-7, -5.5, 12, 5.5, 3).map((q) => P(q.u, q.v, 23.5))), class: "nf lo" }, g);

  // 5. Sculpted Sidepods (z: 4 -> 17)
  const [podR, podI] = rings(-44, -25, 22, 25, 6, 1.8), podSolid = solid(g);
  put(podSolid, {
    sil: poly(hull(podR.map((q) => P(q.u, q.v, 17)).concat(podR.map((q) => P(q.u, q.v, 4))))),
    crease: open(run(podI, front).map((q) => P(q.u, q.v, 17))),
  });
  // Sidepod radiator inlet slats
  mk("path", { d: `${seg(P(20, -23, 7), P(20, -23, 15))} ${seg(P(20, 23, 7), P(20, 23, 15))}`, class: "nf lo" }, g);

  // 6. Slender Nosecone (z: 2 -> 13)
  const [noseR, noseI] = rings(18, -9, 88, 9, 3.5, 1.1), noseSolid = solid(g);
  put(noseSolid, {
    sil: poly(hull(noseR.map((q) => P(q.u, q.v, 13)).concat(noseR.map((q) => P(q.u, q.v, 2))))),
    crease: open(run(noseI, front).map((q) => P(q.u, q.v, 13))),
  });

  // 7. Multi-tier Front Wing (z: 1 -> 8)
  const [fwR, fwI] = rings(80, -38, 100, 38, 3, 1.2), fwSolid = solid(g);
  put(fwSolid, {
    sil: poly(hull(fwR.map((q) => P(q.u, q.v, 7)).concat(fwR.map((q) => P(q.u, q.v, 1))))),
    crease: open(run(fwI, front).map((q) => P(q.u, q.v, 7))),
  });
  // Front wing cascading tier elements
  mk("path", { d: `${seg(P(82, -37, 5), P(98, -37, 5))} ${seg(P(82, 37, 5), P(98, 37, 5))}`, class: "nf lo" }, g);
  mk("path", { d: `${seg(P(85, -35, 7), P(95, -35, 7))} ${seg(P(85, 35, 7), P(95, 35, 7))}`, class: "nf lo" }, g);

  // Wheel assemblies with suspension arms & brake hub
  const baseCirc = circ(WR, 28), inCirc = circ(WR - 2.4, 28), hubCirc = circ(4.5, 16);
  const wheelNodes = WHEELS.map((spec) => ({
    spec,
    suspension: mk("path", { class: "nf lo" }, g),
    axleGuide: mk("path", { class: "nf dash" }, g),
    brakeDisc: mk("path", { class: "nf lo" }, g),
    sld: solid(g),
    rimRing: mk("path", { class: "nf lo" }, g),
    spDist: spring(0, { k: 110, c: 16 }),
    hi: false,
  }));

  fwSolid.sil.classList.add("hi");

  function drawWheel(item) {
    const { spec, suspension, axleGuide, brakeDisc, sld, rimRing, spDist, hi } = item;
    const d = spDist.x, wx = spec.x + spec.dir[0] * d, wy = spec.y + spec.dir[1] * d, wz = spec.z;

    // Wishbone suspension arms connecting chassis to axle hub
    const inY = spec.y > 0 ? 19 : -19;
    suspension.setAttribute("d", `${seg(P(spec.x - 12, inY, wz + 2), P(spec.x, spec.y, wz))} ${seg(P(spec.x + 12, inY, wz + 2), P(spec.x, spec.y, wz))} ${seg(P(spec.x, inY, 5), P(spec.x, spec.y, wz - 3))}`);

    // Axle trajectory guide
    axleGuide.setAttribute("d", d > 1.5 ? seg(P(spec.x, spec.y, wz), P(wx, wy, wz)) : "");

    // Brake rotor at chassis upright
    brakeDisc.setAttribute("d", poly(hubCirc.map((q) => P(spec.x + q.u, spec.y, wz + q.v))));

    // Circular tyre cylinders
    const yIn = wy - WT / 2, yOut = wy + WT / 2;
    const rIn = baseCirc.map((q) => P(wx + q.u, yIn, wz + q.v));
    const rOut = baseCirc.map((q) => P(wx + q.u, yOut, wz + q.v));
    const rRim = inCirc.map((q) => P(wx + q.u, spec.y > 0 ? yOut : yIn, wz + q.v));

    put(sld, {
      sil: poly(hull(rIn.concat(rOut))),
      crease: open(rRim),
    });

    // Center-lock nut & wheel rim spokes
    const rHub = hubCirc.map((q) => P(wx + q.u, spec.y > 0 ? yOut : yIn, wz + q.v));
    rimRing.setAttribute("d", poly(rHub));

    sld.sil.classList.toggle("hi", hi);
    rimRing.classList.toggle("hi", hi);
  }

  const loop = register(stage, (dt) => {
    let moving = false;
    for (const w of wheelNodes) {
      if (stepS(w.spDist, dt)) moving = true;
      drawWheel(w);
    }
    return moving;
  });
  bag.add(loop.unregister);

  function updatePointer(pt) {
    if (!pt) {
      wheelNodes.forEach((w) => { w.spDist.t = 0; w.hi = false; });
      fwSolid.sil.classList.add("hi");
      read.textContent = "rest";
      loop.wake();
      return;
    }

    const [gx, gy] = unproj(C, pt[0], pt[1], 0);
    const inPitZone = Math.hypot(gx - 5, gy) < 130;
    let nearestWheel = null, minDist = 48;
    for (const w of wheelNodes) {
      const dw = Math.hypot(gx - w.spec.x, gy - w.spec.y);
      if (dw < minDist) { minDist = dw; nearestWheel = w; }
    }

    fwSolid.sil.classList.remove("hi");
    if (inPitZone) {
      wheelNodes.forEach((w) => {
        w.spDist.t = maxExplode + (w === nearestWheel ? 12 : 0);
        w.hi = (w === nearestWheel);
      });
      read.textContent = nearestWheel ? nearestWheel.spec.name : "pit stop";
    } else {
      wheelNodes.forEach((w) => { w.spDist.t = 0; w.hi = false; });
      fwSolid.sil.classList.add("hi");
      read.textContent = "rest";
    }
    loop.wake();
  }

  bag.add(pointer(stage, { move: (p) => updatePointer(p), leave: () => updatePointer(null) }));
  bag.add(() => svg.replaceChildren());

  return {
    set: (v) => { maxExplode = v; loop.wake(); },
    destroy: bag.dispose,
  };
}

hairline({
  name: "pitstop",
  means: "An isometric Formula 1 car in the pit lane: pointing detaches the wheels outward from their axles in an exploded mechanical view.",
  rules: [1, 3, 4, 5, 8],
  range: [15, 32, 50],
  tour: [[203, 209], [283, 169], [109, 161], null],
  mount,
});
