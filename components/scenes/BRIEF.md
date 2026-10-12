# Brief: one 3D scene for one portfolio case study

Repo: `~/projects/new-portfolio-next` (Next.js 16, React, Tailwind v4). Omar's portfolio, omardev.xyz.
Each case-study page (`/projects/<slug>`) shows a hero scene above the metrics. You build the scene for ONE slug.

## What to build

Replace the stub at `components/scenes/<slug>.tsx` with an animated isometric CSS-3D scene that explains THIS project as a real physical machine or place. The object is the explanation: no boxes-and-arrows diagram. Example: the invoice-fraud project is a conveyor where invoices pass a risk scanner, get a score chip, and high-risk ones drop to a second belt and split into micro-invoices.

1. Read the project in `data/projects.ts` (search `slug: "<slug>"`): description, technologies, cover (tone, subject, flow), showcase metrics if any.
2. In one sentence decide: what moves, and what that motion means for this project. Make it specific to the project, not generic "AI".
3. Build it with the kit. Aim for 30 to 80 parts: bases, rails, posts, screens, cables, small detail. Every part sits on something.
4. Calm, looping, time-based motion (6 to 12 s loop) via `useFrame`. Set `stillAt` to a good-looking moment for reduced motion.

## Hard rules

- Only create/edit `components/scenes/<slug>.tsx`. Do NOT touch `kit.tsx`, `index.tsx`, other scenes, data, or any other file. No git commands.
- Default export: `export default function XScene({ project, className }: { project: Project; className?: string })` returning a `<Stage ...>` with `tone={project.cover.tone}`, `className={className}`, `subject={project.cover.subject}`, `flow={project.cover.flow}`, and a real `label` (alt text describing the scene).
- Numbers shown in the scene must come from the project data (description or metrics). Never invent figures, client names or results. Labels: short, mono `Chip`s, at most 4.
- No WebGL, no new packages, no images. Inline SVG inside a `Bill` is fine but give it explicit width/height and `style={{maxWidth:'none'}}`.
- Use the palette `P` and `shade()` from the kit. Tone `ink` = dark scene (base plate `P.ink2`), `signal` = orange background (use ink/paper parts, signal only as small accents won't show, so lean on ink + paper), `paper` = light grey (paper/steel parts, signal accents).
- Must read well at 390 px wide (phone) and 1440 desktop. Keep the floor around 600x360 world px and labels away from the bottom-left where the caption sits.

## The kit (`components/scenes/kit.tsx`), read it first

- `Stage({w,d,tone,label,subject,flow,stillAt,zoom,offset,children})`: frame + camera + fit + parallax + pause offscreen + reduced motion. Start with `zoom={0.9}`; tweak `offset={[x%,y%]}`.
- `Box({x,y,w,d,h,z,c,r,front,top})`: solid on the floor at (x,y), size w×d, height h, lifted by z. `c` is a colour string (auto-shaded) or `{top,s,w}`. `front` paints the south face (faces the viewer, reads upright: screens, labels). `top` paints the top face. Accepts a ref.
- `Slab({x,y,w,d,z,bg,r})`: flat painted area (roads, belts, mats, screens lying flat). Ref-able.
- `Group`: wrap parts and move them by setting `ref.current.style.transform = translate3d(x,y,z)` in `useFrame`.
- `Bill({x,y,z})`: billboard that always faces the viewer (labels, icons, people, trees, pins). Ref-able (ref is the inner element; animate opacity or add `translateY` carefully).
- `Chip({tone:'light'|'dark'|'signal'})`: mono label pill.
- `useFrame((t)=>{...})`: called every frame with seconds. Mutate refs here, never setState per frame.
- `ease, lerp, span(t,a,b), clamp01`.
- Coordinates: x right, y down toward the viewer, z up. Visible faces are top, south (y+d) and west (x=0). Something lying ON a box of height h at base z needs z = base + h (+0.5 to avoid flicker), otherwise it hides inside.

## Reference

Read `components/scenes/invoice-fraud-prevention-platform.tsx` fully before starting. Match or beat its craft.

## Verify (required)

A dev server runs on http://localhost:3990 (do not start/stop it). After writing your file:
1. `cd ~/projects/new-portfolio-next && npx tsc --noEmit -p . 2>&1 | grep "scenes/<slug>"` must print nothing.
2. `cd ~/projects/motion-lab-test && node pf-scene.mjs <slug> /tmp/scene-<slug>` then READ `/tmp/scene-<slug>-desk.png`, `/tmp/scene-<slug>-desk-b.png` (3 s later) and `/tmp/scene-<slug>-phone.png`. Fix anything hidden inside another part, clipped by the frame, overlapping labels, or empty. Iterate until it looks like a crafted object. At most 4 iterations.
3. Final answer (short): the one-sentence concept, the file path, and the three screenshot paths. Say plainly if anything still looks off.
