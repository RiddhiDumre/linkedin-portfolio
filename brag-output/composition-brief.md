# Hyperframes Composition Brief: F1 Pit Lane Telemetry & Speed Challenge

## Objective
Create a short launch-style brag video for F1 Pit Lane Telemetry & Speed Challenge.

## Output
- Composition directory: `brag-output/composition/`
- Rendered video: `brag-output/brag.mp4`
- Format: landscape — 1920x1080
- Duration: 19.0s (570 frames @ 30fps)

## Source Material
- Project root: `c:/Riddhi/portfio/Linkedin`
- Primary files read: `lego-f1-pitstop.html`, `hairline-pitstop.html`, `screen_modal_reveal.png`, `BG.png`
- Product name: F1 Pit Lane Telemetry & Speed Challenge
- Tagline / strongest claim: "OFFICIAL STATIONARY DURATION: 1.98 S // WE ARE CHECKING... STAY OUT! NO WAIT, BOX BOX BOX!"
- Key UI or visual moment to recreate:
  - Top F1 Broadcast Strip with live timer, brand chevron, and session category
  - Compound Rack with Soft / Medium / Hard tyre buttons and active glow
  - 3D / Isometric wheel detachment badges (`[FL]`, `[FR]`, `[RL]`, `[RR]`)
  - Broadcast Telemetry Results Modal with Scuderia Ferrari team radio roast
- Copy that must appear verbatim:
  - "F1 PIT LANE TELEMETRY"
  - "OFFICIAL STATIONARY DURATION"
  - "WE ARE CHECKING... STAY OUT! NO WAIT, BOX BOX BOX!"
  - "SCUDERIA FERRARI // TEAM RADIO"

## Creative Direction
- Tone preset: yc-parody / polished
- Creative direction: High-stakes F1 broadcast realism meets Ferrari pit wall comedy
- Interpretation: Serious high-tech telemetry and timing aesthetics coupled with the hilarious, self-deprecating reality of pit stop chaos.
- Angle: Formula 1 races are won and lost in sub-2-second pit stops. This simulator challenges your precision reflexes while the Ferrari pit wall delivers legendary team radio commentary in real-time.
- Hook: 0-3.5s — Crimson telemetry alert: "BOX BOX BOX! PIT STOP INITIATED", timer clock spins up.
- Outro / punchline: 16.5-19.0s — "ELITE EXECUTION // CAN YOU BEAT 1.98 SECONDS?"
- Avoid:
  - Generic SaaS language
  - Abstract filler visuals
  - Unrelated visual redesign

## Visual Identity
- Background: `#08090d` with carbon radial gradient and `BG.png` track texture
- Text: `#ffffff` primary, `#8c93a3` muted, `#ffb800` record gold
- Accent: `#e10600` (F1 racing red), `#00d26a` (telemetry green)
- Display font: "Barlow Condensed", sans-serif
- Body font: "Inter", -apple-system, sans-serif
- Monospace font: "JetBrains Mono", monospace
- Visual references from the project: Top broadcast bar, Tyre compound rack, Wheel badges, Scuderia Ferrari broadcast modal.

## Storyboard
Scene summary:
1. Scene 1: The Call (0.0s - 3.5s) — Red broadcast ribbon drops, radio call flashes: "BOX BOX BOX", official timer begins ticking.
2. Scene 2: Pit Box & Compound Arming (3.5s - 8.0s) — Car in pit box, interactive compound selector switches HARD -> MED -> SOFT, wheel target badges lock on.
3. Scene 3: The Sub-2s Swap (8.0s - 12.5s) — High-speed tyre exchange sequence, wheel nuts torqued, clock freezes at 1.98s record time.
4. Scene 4: Ferrari Radio Roast (12.5s - 16.5s) — Glassmorphic Results Modal slams in, official duration displayed, Ferrari radio quote illuminates: "WE ARE CHECKING... STAY OUT! NO WAIT, BOX BOX BOX!".
5. Scene 5: Launch Outro (16.5s - 19.0s) — "F1 PIT LANE TELEMETRY", Scuderia Ferrari badge, CTA: "CAN YOU BEAT 1.98 SECONDS?".

## Audio
- Audio role: High-energy electronic sports broadcast bed with tactile telemetry clicks and impact drops
- Audio arc: Fast intro buildup, steady rhythmic drive during pit stop mechanics, pause on radio roast punchline, confident final chord
- Music: `assets/music/happy-beats-business-moves-vol-12-by-ende-dot-app.mp3`
- Music treatment: Starts at full presence, dips slightly at 12.5s to let the Ferrari radio roast land, fades smoothly after 18.0s
- Music cue guidance: Strong beat cue at 8.74s (tyre lock) and 13.11s (modal drop)
- Audio-reactive treatment: Subtle ambient crimson halo around broadcast containers breathing with music energy
- SFX selection guidance:
  - `click_003.ogg` for compound buttons and UI interactions
  - `impactSoft_medium_001.ogg` for wheel gun lock and modal slam
  - `impactBell_heavy_000.ogg` for record stop celebration chime
- Audio files: Copied into `brag-output/composition/assets/`

## Hyperframes Instructions
Build a self-contained Hyperframes composition in `brag-output/composition/` using HTML, CSS, and GSAP timeline.
- Adhere strictly to the 1920x1080 resolution and 19.0s duration.
- Ensure all text passes WCAG contrast checks against dark backgrounds.
- Ensure `npx hyperframes check` passes with zero errors.
