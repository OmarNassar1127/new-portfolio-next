# Simulators

Source for the three.js simulator pages in `public/sims/`. The pages are built with the teardown skill kit (`~/.claude/skills/teardown`), not by Next.js.

## qa-rig

The QA rig on `/projects/ai-qa-agents`.

- `qa-rig-shared/model.js`: the model. One input: the run position, 0 to 52. All totals come from here.
- `qa-rig-shared/rig.js`, `stage.js`, `screens.js`: the geometry, the renderer and the canvas screens.
- `qa-rig-shared/console.js`: the panels. Two layouts: wide (1600 x 900) and tall (900 x 1500, phones).
- `qa-rig-shared/film.js`: the tour script and `render(t)`.
- `qa-rig-shared/live.js`: the interactive page.

Build and publish:

```
TEARDOWN_OUT=/tmp/qa node ~/.claude/skills/teardown/sims/build.mjs ./sims/qa-rig-live
cp /tmp/qa/dist/qa-rig-live.html public/sims/qa-rig.html
```

Check stills of the film:

```
TEARDOWN_OUT=/tmp/qa node ~/.claude/skills/teardown/sims/build.mjs ./sims/qa-rig-film
TEARDOWN_OUT=/tmp/qa node ~/.claude/skills/teardown/sims/capture.mjs qa-rig-film --size 1600x900 --stills every:3 --cols 3 --out /tmp/qa/sheet.png
```
