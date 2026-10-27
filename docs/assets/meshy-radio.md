# Meshy radio asset trial

Generated through the signed-in Meshy web workspace using Text to 3D, Meshy 6 Lite, on 27 October 2026. Generation completed and the untextured GLB was downloaded successfully. Binary header inspection confirms a glTF container, one mesh, no textures, 1,847,740 bytes. Meshy reports 102,622 triangle faces and 51,291 vertices. The asset is not yet integrated into the live app. The cloud viewer canvas appeared blank, so the generation thumbnail is the only visual reference verified so far.

## Prompt
A single vintage 1950s tabletop radio for a quiet abandoned reading room. Rounded rectangular walnut wood cabinet, dark woven speaker grille on the left, recessed horizontal amber tuning dial on the right, two small ivory tuning knobs, four short feet. Carefully worn edges, subtle scratches, restrained warm brown and charcoal palette. Stylized low-poly game prop, clean solid geometry, flat bottom, separate standalone object, all sides complete. No people, characters, faces, hands, silhouettes, text, logos, room, floor, pedestal or background scenery.

## Export constraints
Use the untextured Lite model export to stay within the free plan. Meshy's help centre states textured exports and Agent models require a paid subscription. Prefer GLB for a self-contained web asset. Keep generated geometry under a separate CC BY 4.0 asset notice with Meshy credit, source URL and any modifications; do not imply this asset is covered solely by the repository MIT code license.

## Integration gate
Inspect geometry and file size, simplify if needed, then trial in an optional 3D object detail viewer. The existing SVG room remains usable without WebGL. No private memory text or personal photographs are sent to Meshy. No runtime Meshy API key is needed to serve an exported static asset.

References: https://help.meshy.ai/en/articles/10421033-why-can-t-i-download-my-model and https://help.meshy.ai/en/articles/15696428-what-is-included-on-the-free-plan

## Web preview
The simplified asset is `web/assets/vintage-radio.glb`: 99,080 bytes, 8,206 triangles, down from 1,847,740 bytes and 102,622 triangles. Reproduction: `gltf-transform weld original.glb welded.glb`, then `gltf-transform simplify welded.glb vintage-radio.glb --ratio 0.08 --error 0.005`. Original download remains in the Meshy account.

The demo radio detail panel offers an opt-in, lazy-loaded Three.js viewer with OrbitControls, manual keyboard-accessible rotation/zoom/reset controls, no automatic animation, and a static illustration/source fallback. Model is served from this site; no runtime Meshy API call or memory transmission. GPU geometry/materials/controls/renderer are disposed when the panel closes. Meshy attribution and separate CC BY license ship with the model.
