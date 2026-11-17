# Self-Review — Rollpix_ProductGallery v1.10.1

**Builder:** Nehuen Berni
**Date:** 2026-11-17
**Branch:** fix/we-15768-zoom-video-listing-controls (PR #12)

Release de arreglos sobre 1.10.0, a partir de lo que encontró Ximena Gomez probando en prod de Quiksilver el 2026-11-12 ([WE-15768](https://we.rollpix.app/tickets/WE-15768)). La revisión de 1.10.0 está en el historial de git de este archivo.

---

## 1. Verificación de build
Probado en el stage efímero de Quiksilver `quiksilver-we15768.stage.rollpix.dev` (ishop16, 2.4.7-p10, production mode), con el árbol de la rama copiado sobre `vendor/rollpix/module-product-gallery`. Al 2026-11-17 el código de ese vendor es idéntico al tip de la rama (sólo difieren CHANGELOG y docs).

- [x] `bin/magento setup:upgrade` — **N/A**: el diff no toca `etc/`, `Setup/` ni schema.
- [x] `bin/magento setup:di:compile` — **N/A**: el único cambio PHP es un argumento (`true` → `false`) dentro de `ImagePlugin::buildExternalVideoHtml()`; no cambian plugins, preferences ni constructores.
- [x] Estáticos — sólo cambian `gallery-carousel-zoom.js`, `gallery-listing.css` y `gallery-vertical.css`.
- [x] `php -l` OK en `ImagePlugin.php`; `node --check` OK en `gallery-carousel-zoom.js`.
- [ ] `vendor/bin/phpstan analyse` — no corrido (deuda previa, ver `docs/TASKS.md`).

## 2. Verificación funcional
Detalle en `docs/TEST-DEPLOYMENTS.md` (entrada del 2026-11-13).
- [x] A — Zoom con video de Vimeo/YouTube: iframe 16:9 en vez de `<video>` vacío.
- [x] B — Listado: iframe con `controls=0`; el play/pausa propio sigue andando por postMessage.
- [x] C/D — Botones del módulo (play/pausa, flechas del zoom y del carrusel, puntitos) no se deforman con el `button:focus/:active/:hover` del tema.
- [x] E — Zoom en mobile ocupa toda la pantalla sobre el header.
- [x] `prefers-reduced-motion`: un solo botón de play en la tarjeta.
- [x] QA (Ximena Gomez, WE-15768, 2026-11-13): OK de A, B, D y E. C se corrigió después de su comentario y se verificó con Chromium; **sin confirmación de QA**.

## 3. Verificación de cache
- [x] Stage en production mode con FPC; las pruebas se hicieron con la página cacheada.

## 4. Documentación
- [x] CHANGELOG.md con la entrada 1.10.1
- [ ] manual.md / i18n — deuda previa, sin cambios

## 5. Calidad de código
- [x] Sin var_dump/print_r/die ni TODO nuevos
- [x] La URL del iframe del zoom se pone como atributo con jQuery (no se concatena en markup) y en el template ya sale con `escapeHtmlAttr`
- [x] Sin ObjectManager nuevo

## 6. Lo que NO testeé
- Safari/iOS real (Chromium con emulación mobile).
- Videos de YouTube en el zoom (el caso real de Quiksilver es Vimeo; el camino de código es el mismo).
- phpstan.

## 7. Sign-off del builder

Confirmo que verifiqué personalmente todos los ítems marcados arriba.

**Firmado:** Nehuen Berni — 2026-11-17

---

## Peer review

**No hubo peer review.** Nehuen Berni pidió publicar 1.10.1 el 2026-11-17 para pasar los arreglos a prod de Quiksilver (WE-15768).
