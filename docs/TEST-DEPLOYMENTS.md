# TEST Deployments — Rollpix_ProductGallery

Log de deployments al servidor TEST para validación previa al review/ship.
Cada entrada documenta qué se deployó, cuándo, quién, y el resultado de la validación.

---

## 2026-11-13 11:00 — Nehuen Antu Berni

**Commit:** `4744053`
**Branch:** `fix/we-15768-zoom-video-listing-controls`
**Mensaje:** fix: zoom de videos externos, controles de Vimeo en listado y estados de foco (WE-15768)
**Ambiente:** stage efímero de Quiksilver (Shield, ishop16, `quiksilver-we15768.stage.rollpix.dev`, clon de prod del 2026-11-13 con datos anónimos), árbol de la rama copiado sobre `vendor/rollpix/module-product-gallery`. Backup del 1.10.0 en `~/bkp_WE15768_20261113_105747/`. Se sacaron del `custom.css` del tema `Rollpix/base` los parches WE-15768 de flechas del carrusel, overlay del zoom mobile, flechas del zoom y puntitos, para probar el módulo solo. Estáticos frontend + adminhtml `--jobs 1`.
**Config:** la de prod (`zoom/type=carousel`, `video/listing_controls=1`, `video/listing_autoplay=1`, `video/controls=0`).

**Qué se está probando:**
Los hallazgos de Ximena en prod del 2026-11-12 (WE-15768): A zoom con Vimeo, B controles de Vimeo en el listado, C play/pausa del listado, D flechas del zoom y puntitos, E zoom mobile.

**Estado:** ✅ OK (builder) — falta QA

**Resultado:** navegador real (Chromium).
- A: `dcshoes …/zapatillas-manteca-4-s-bw6-dc`, item 2/11 (Vimeo): el zoom muestra el iframe reproduciendo, 1206×678 a 1366×800 y 360×203 a 390 px. Antes: `<video>` vacío, negro.
- B: `dcshoes …/hombres/calzado/skate` (10 videos Vimeo): iframe con `controls=0`, sin chrome de Vimeo. El play/pausa propio sigue andando (Vimeo `getPaused`: false → true → false).
- C: `.rp-listing-playstop` con foco: 32×32, `padding 0`, redondo. Un `button` cualquiera del tema con foco: `7px 32px`, fondo negro.
- D: clic real en mobile: flecha del carrusel 36×36 y flecha del zoom 36×36 con foco; puntito con foco 10×10, `padding 0`.
- E: zoom abierto en mobile con la página scrolleada: overlay `fixed` 0,0 390×900, z-index 10000 sobre el header (100). La galería sigue `sticky` en mobile.
- Fichas de Quiksilver, Roxy, Ala Moana y RVCA sirven el CSS nuevo; consola sin errores; sin excepciones nuevas.

## 2026-09-28 15:55 — Lautaro Martinez

**Commit:** `9633448` (963344859d1f7892faf4731516986c7c7d6840f9)
**Branch:** `feat/WE-57003-sticky-gallery-target`
**Mensaje:** feat: sticky gallery option (Sticky Element = Image gallery) (WE-57003)
**Ambiente:** stage Marcovecchio ishop16-100926 (https://marcovecchio-100926.stage16.rollpix.com/), árbol de la rama copiado sobre `vendor/rollpix/module-product-gallery` (PR [#11](https://github.com/ROLLPIX/M2-ProductGalleryStyle/pull/11)). Backup del 1.9.2 original en `~/bkp-we57003-20260928-185448`.
**Config:** `rollpix_gallery/sticky/enabled=1`, `target=gallery`, `offset=161` (default scope).

**Qué se está probando:**
Galería fija en la PDP mientras scrollea la descripción (WE-57003), incluida una galería más alta que la pantalla.

**Estado:** ✅ OK — aprobado por el cliente (Lisandro Badie, WE-57003, 2026-09-29: "Excelente! vamos con esta opción")

**Resultado:** verificación del builder en `fox-non-stop-fleece-n31676`. A 1280×900 la galería queda fija a 161 px y se suelta al final de `.rp-product-wrapper`. A 1366×657, al bajar queda `top=-53` (bottom 637, miniaturas visibles) y al subir vuelve a 161. A 390×844 sigue el carrusel sticky de siempre, sin `top` inline. Info panel `static`. Consola sin errores nuevos (sólo One Tap y el pixel de Meta, igual que en prod).
