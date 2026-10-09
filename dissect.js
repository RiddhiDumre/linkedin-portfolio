/**
 * Dissect: an isometric smartphone that separates into floating precision
 * layers (screen, frame, chassis) under the cursor, highlighting the active
 * layer. The slider is the maximum exploded separation gap.
 */
const {
  Cam, clamp, facing, fit, lerp, open, pointer, poly, prism, proj,
  put, register, reflect, rings, rrect, seg, solid, spring, stepS, disposer, mk,
} = HL;

const L = 140, W = 70, R = 12, CR_INSET = 1.4;
const REST_GAP = 5;

function mount({ stage, svg, read }, value) {
  const bag = disposer();
  let maxGap = value;

  const C = Cam(45, 0.5, 1.6);
  fit(C, [
    [0, 0, 0], [L, W, 0], [L, 0, 0], [0, W, 0],
    [0, 0, 78], [L, W, 78], [L, 0, 78], [0, W, 78],
  ], 200, 166);
  const P = proj(C), front = facing(C);

  const [rChas, iChas] = rings(0, 0, L, W, R, CR_INSET);
  const [rCam, iCam] = rings(7, 7, 45, 45, 7, 1.0);
  const [rMid, iMid] = rings(0, 0, L, W, 11.5, CR_INSET);
  const [rScr, iScr] = rings(0, 0, L, W, R, CR_INSET);

  const g = mk("g", {}, svg);
  reflect(svg, g, P, front, rChas, 0, 16);

  // Chassis (Layer 0, base)
  const gChas = mk("g", {}, g);
  const chasSolid = solid(gChas);
  put(chasSolid, prism(P, front, rChas, iChas, 0, 3.5));
  const camSolid = solid(gChas);
  put(camSolid, prism(P, front, rCam, iCam, 3.5, 5.5));

  // Camera lenses and chassis features
  const lens = (cx, cy, r) => open(rrect(cx - r, cy - r, cx + r, cy + r, r).map((q) => P(q.u, q.v, 5.5)));
  mk("path", { d: lens(18, 18, 5.5) + lens(18, 34, 5.5) + lens(33, 26, 5.5), class: "nf" }, gChas);
  mk("path", { d: lens(18, 18, 3.2) + lens(18, 34, 3.2) + lens(33, 26, 3.2), class: "nf lo" }, gChas);
  mk("circle", { cx: P(33, 13, 5.5)[0], cy: P(33, 13, 5.5)[1], r: 1.8, class: "dot m" }, gChas);
  mk("circle", { cx: P(33, 38, 5.5)[0], cy: P(33, 38, 5.5)[1], r: 1.4, class: "dot off" }, gChas);
  mk("path", { d: seg(P(L, 30, 1.8), P(L, 40, 1.8)), class: "nf lo" }, gChas);

  // Alignment guides from Chassis to Midframe
  const gGuide1 = mk("path", { class: "nf dash" }, g);

  // Midframe (Layer 1, middle)
  const gMid = mk("g", {}, g);
  const midSolid = solid(gMid);
  const midDetails = mk("path", { class: "nf lo" }, gMid);
  const midButtons = mk("path", { class: "nf" }, gMid);

  // Alignment guides from Midframe to Screen
  const gGuide2 = mk("path", { class: "nf dash" }, g);

  // Screen (Layer 2, top)
  const gScr = mk("g", {}, g);
  const scrSolid = solid(gScr);
  const scrBezel = mk("path", { class: "nf lo" }, gScr);
  const scrPill = mk("path", { class: "hi" }, gScr);
  const scrUI = mk("path", { class: "nf lo" }, gScr);

  const spGap = spring(REST_GAP, { k: 120, c: 20 });
  let act = -1, lastDrawn = -1;

  function updateGuides(gap) {
    const pts = [[R, R], [L - R, R], [L - R, W - R], [R, W - R]];
    let d1 = "", d2 = "";
    for (const [x, y] of pts) {
      d1 += seg(P(x, y, 3.5), P(x, y, 3.5 + gap));
      d2 += seg(P(x, y, 6.0 + gap), P(x, y, 6.0 + 2 * gap));
    }
    gGuide1.setAttribute("d", d1);
    gGuide2.setAttribute("d", d2);
  }

  function drawMidframe(gap) {
    const z0 = 3.5 + gap, z1 = z0 + 2.5;
    put(midSolid, prism(P, front, rMid, iMid, z0, z1));
    const onZ1 = (ring) => poly(ring.map((q) => P(q.u, q.v, z1)));
    const dRelief = onZ1(rrect(48, 8, 126, 36, 3.5)) +
      onZ1(rrect(10, 8, 44, 62, 3)) +
      onZ1(rrect(18, 28, 36, 46, 2)) +
      onZ1(rrect(68, 21, 96, 49, 14));
    midDetails.setAttribute("d", dRelief);
    const dBtns = seg(P(28, 0, z0 + 1.2), P(42, 0, z0 + 1.2)) +
      seg(P(48, 0, z0 + 1.2), P(62, 0, z0 + 1.2)) +
      seg(P(36, W, z0 + 1.2), P(54, W, z0 + 1.2));
    midButtons.setAttribute("d", dBtns);
  }

  function drawScreen(gap) {
    const z0 = 6.0 + 2 * gap, z1 = z0 + 2.0;
    put(scrSolid, prism(P, front, rScr, iScr, z0, z1));
    const onZ1 = (ring) => poly(ring.map((q) => P(q.u, q.v, z1)));
    scrBezel.setAttribute("d", onZ1(rrect(3.5, 3.5, L - 3.5, W - 3.5, 8.5)));
    scrPill.setAttribute("d", onZ1(rrect(9, 26, 15, 44, 3)));
    const dUI = seg(P(1.4, 28, z1), P(1.4, 42, z1)) +
      seg(P(L - 10, 26, z1), P(L - 10, 44, z1)) +
      onZ1(rrect(22, 8, 62, 62, 4)) +
      onZ1(rrect(68, 8, 120, 62, 4));
    scrUI.setAttribute("d", dUI);
  }

  function draw(gap) {
    updateGuides(gap);
    drawMidframe(gap);
    drawScreen(gap);
  }

  const reg = register(stage, (dt) => {
    const moving = stepS(spGap, dt);
    if (Math.abs(spGap.x - lastDrawn) > 0.04) {
      draw(spGap.x);
      lastDrawn = spGap.x;
    }
    return moving;
  });
  bag.add(reg.unregister);

  function hit(p) {
    if (p[0] < 75 || p[0] > 325 || p[1] < 50 || p[1] > 285) return -1;
    return p[1] < 186 ? 2 : p[1] < 232 ? 1 : 0;
  }

  function setActive(layer, p) {
    if (layer === act) return;
    act = layer;
    if (layer < 0) {
      spGap.t = REST_GAP;
      read.textContent = "rest";
    } else {
      const u = p ? clamp((p[0] - 80) / 240, 0, 1) : 0.6;
      spGap.t = lerp(12, maxGap, u);
      read.textContent = layer === 2 ? "screen" : layer === 1 ? "frame" : "chassis";
    }
    chasSolid.sil.classList.toggle("hi", act === 0);
    camSolid.sil.classList.toggle("hi", act === 0);
    midSolid.sil.classList.toggle("hi", act === 1);
    scrSolid.sil.classList.toggle("hi", act === 2);
    scrPill.classList.toggle("hi", act === -1 || act === 2);
    reg.wake();
  }

  bag.add(pointer(stage, {
    move: (p) => setActive(hit(p), p),
    leave: () => setActive(-1, null),
  }));
  bag.add(() => svg.replaceChildren());

  draw(REST_GAP);

  return {
    set: (v) => {
      maxGap = v;
      if (act >= 0) {
        spGap.t = maxGap;
        reg.wake();
      }
    },
    destroy: bag.dispose,
  };
}

hairline({
  name: "dissect",
  means: "An isometric smartphone separates into floating precision layers under the cursor, highlighting screen, frame, or chassis.",
  rules: [1, 3, 5, 9],
  range: [14, 26, 42],
  tour: [[160, 158], [200, 205], [228, 246], null],
  mount,
});
