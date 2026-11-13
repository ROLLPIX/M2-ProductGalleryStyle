# Changelog

Todos los cambios notables de este módulo están documentados en este archivo.

El formato sigue [Keep a Changelog](https://keepachangelog.com/es-ES/1.1.0/) y el módulo adhiere a [Semantic Versioning](https://semver.org/lang/es/).

> Nota: este archivo se creó el 2026-07-28 como parte de la normalización al baseline Rollpix. Las versiones anteriores a la entrada de abajo no están documentadas acá — ver el historial de git y los releases de GitHub.

---

## [Unreleased]

Hallazgos de Ximena Gomez probando 1.10.0 en prod de Quiksilver el 2026-11-12 ([WE-15768](https://we.rollpix.app/tickets/WE-15768)).

### Fixed

- **`fix(zoom)`**: el zoom del carrusel (`gallery-carousel-zoom.js`) mostraba en negro los videos de **YouTube / Vimeo**: sólo leía `video source` (MP4 local) y armaba un `<video>` sin fuente. Ahora toma el `data-video-embed-url` del item y muestra un iframe 16:9 que entra en el escenario.
- **`fix(listing)`**: en grillas y categorías, el video de Vimeo/YouTube mostraba un instante **el reproductor del proveedor** antes de arrancar: `ImagePlugin::buildExternalVideoHtml()` pedía `controls=1` fijo. Ahora siempre `controls=0`; el único control del listado es el botón play/pausa propio (`rollpix_gallery/video/listing_controls`), que va por postMessage y no depende de esos controles. Ojo: Vimeo sólo respeta `controls=0` en videos de cuentas pagas.
- **`fix(css)`**: los botones del módulo se deformaban al tocarlos porque el `button:focus` / `button:active` genérico del tema (Rollpix/base: `padding 7px 32px`, fondo negro; especificidad 0,1,1) le gana a una clase sola. Se agregan estados `:focus` / `:active` a: play/pausa del listado (`.rp-listing-playstop`), flechas del zoom (`.rp-carousel-zoom-prev/next`, 36→66×36 en mobile), puntitos del carrusel (`.rp-carousel-dot`, 10→79×19) y flechas del carrusel mobile (`.rp-carousel-prev/next`).
- **`fix(mobile)`**: el zoom en el celular quedaba a mitad de pantalla y debajo del header: la regla `sticky !important` del carrusel mobile apuntaba a `.rp-carousel-active`, y el overlay del zoom también lleva esa clase mientras está abierto. Se acota a `.rp-product-gallery.rp-carousel-active`.

## [1.10.0] — 2026-09-29

### Added

- **`feat(sticky)`**: nueva opción **Elemento fijo** (`rollpix_gallery/sticky/target`: `info` | `gallery`, por defecto `info`) en *Sticky Panel Settings*. Con **Galería de imágenes**, en desktop (≥ 768 px) la galería queda fija mientras se scrollea la descripción y el panel de info deja de ser sticky. La galería se suelta al final de `.rp-product-wrapper`, así que no se monta sobre lo que viene abajo ([WE-57003](https://we.rollpix.app/tickets/WE-57003), Marcovecchio: layout `slider` con tabs inline, galería de 683 px contra una ficha de 2443 px).
  - Si la galería es **más alta que la pantalla**, `js/gallery-sticky.js` reescribe el `top` según la dirección del scroll: al bajar se pega por abajo (miniaturas visibles) y al subir vuelve al offset. Con una regla CSS sola, a 1366×657 la galería de 690 px quedaba cortada a la altura de las miniaturas durante todo el scroll.
  - `js/gallery-sticky.js` estaba mapeado como `rpStickyScroll` pero no lo inicializaba nadie. Ahora recibe la columna a fijar por config, no hace nada en mobile y escucha con `ResizeObserver` en vez de `MutationObserver`, que con el slider se disparaba en cada transform. Sólo se inicializa con **Galería de imágenes**: el comportamiento del panel de info no cambia.
  - *Modo Sticky* (Frame / Scroll natural) queda visible sólo con **Panel de info**, que es el único al que aplica.

## [1.9.3] — 2026-08-13

### Fixed

- **`fix(configurable)`**: en un configurable de **un solo eje** cuyo atributo tiene `Update Product Preview Image = **No**`, cada click en el talle **reconstruía la galería igual**: se veían los rectángulos grises del shimmer y se volvían a pedir todas las imágenes, en un catálogo que había pedido explícitamente lo contrario ([WE-56006](https://we.rollpix.app/tickets/WE-56006), Popper). Medido en `SALOMON ZAPATILLA OUTWAY CSWP`: **5 placeholders grises y 10 requests / 364 KB por cada talle** (las mismas 5 fotos en dos presets de caché), ~1 s con caché tibia y varios segundos en frío.
  - Causa: `_rpMatchedProducts()` decidía con un booleano — `hasOptIn ? optIn[attrId] : attrId === attrIds[0]`. Ese `hasOptIn === false` mezclaba dos situaciones que no son lo mismo: **"nadie tocó el flag"** (catálogo legacy, donde el fallback al primer atributo por posición es deseable) y **"el merchant dijo No"**. Con un único eje, el fallback lo elegía a él, así que el opt-out explícito quedaba pisado. El flag de `talle` viaja como `"update_product_preview_image":"0"` dentro de `additional_data` — presente y en cero, no ausente — de modo que la premisa de 1.9.2 ("el checkbox se omite cuando está en No") no se cumple en este catálogo.
  - Fix: la lectura del flag pasa a ser **tri-estado** (`true` / `false` / `null` cuando no viaja) en `_rpAttrPreviewFlag()` y `_rpMetaPreviewFlag()`; `_rpAttrUpdatesPreview()` y `_rpMetaUpdatesPreview()` quedan como envoltorios booleanos para no cambiar sus llamadores. El fallback legacy ya no toma "el primer atributo" sino **el primero que no se declaró en No**, así que un configurable de un solo eje que optó por No se queda sin eje de preview y la galería no se toca.
  - Verificado en el dev de Popper: en el producto del ticket, cuatro cambios de talle seguidos dan **0 grises, 0 requests, 0 KB** y la galería queda intacta; en `ANSILTA CAMPERA CICLON 2` (color + talle, color con el flag en Sí) cambiar **color sí** reconstruye (3 items, 6 requests) y cambiar **talle no** (0 y 0). Harness aislado de la lógica de decisión: **11/11**, incluidos los caminos de 1.9.2 y el fallback legacy.

  La matriz de comportamiento gana una fila:

  | Config del admin | 1.9.2 | Ahora (1.9.3) |
  |---|---|---|
  | Ningún atributo con el flag (legacy) | Sólo el primero por posición | Sin cambios |
  | Color con el flag en Sí, talle en No | Color solo cambia; talle ignorado | Sin cambios |
  | Todos los atributos con el flag en Sí | Cambia con lo que haya elegido | Sin cambios |
  | **Único eje con el flag en No** | **Cambiaba en cada click** | **No cambia** |
  | **Todos los ejes en No** | Cambiaba con el primero | No cambia |

## [1.9.2] — 2026-08-10

### Fixed

- **`fix(configurable)`**: en un configurable con **dos ejes (ej. color + talle)**, cambiar el **talle nunca cambiaba las imágenes** aunque cada hijo tuviera su propia foto y ambos atributos tuvieran `Update Product Preview Image = Sí` en el admin ([WE-55961](https://we.rollpix.app/tickets/WE-55961), Bordoli). Con un solo eje funcionaba bien, lo que hacía parecer un problema de carga de imágenes del catálogo.
  - Causa: `swatch-gallery-bridge.js` leía el flag `update_product_preview_image` desde `jsonConfig.attributes[<id>]`, donde **nunca está**. Magento lo serializa en `additional_data` y lo emite en **`jsonSwatchConfig`**; encima, para cuando corre el mixin el swatch-renderer nativo ya reindexó `jsonConfig.attributes` como array por posición (`{0: …, 1: …}`), así que el acceso por id de atributo devuelve `undefined` de todas formas. Resultado: `hasOptIn` daba `false` en **todos** los catálogos y siempre se aplicaba el fallback legacy de 1.8.6 — sólo el primer atributo por posición (típicamente color) movía la galería, y el talle quedaba ignorado por diseño.
  - Fix: nuevo `_rpAttrMetas()` que resuelve la metadata del atributo por id contra **ambas** fuentes (`jsonSwatchConfig` y `jsonConfig.attributes`, esta última recorrida por la propiedad `id` para sobrevivir al reindexado). `_rpAttrUpdatesPreview()` pasa a recibir un id y hace OR entre las fuentes; la lectura del flag sobre un objeto suelto queda en `_rpMetaUpdatesPreview()`.
  - Verificado en producción sobre `PP-TSVTSLBRI` (34 colores × 5 tamaños): cada talle ahora trae su propia foto y su strip de thumbnails, y cambiar el color con el talle ya elegido resuelve la combinación correcta.

### Changed

- **`change(configurable)`**: una selección **parcial** de los atributos preview-relevantes ahora también cambia la galería, resolviendo al primer hijo que matchea, en vez de esperar a que estén todos los ejes elegidos. Antes esto sólo pasaba por el fallback legacy; con el flag ya legible (ver arriba), mantenerlo estricto habría sido una regresión visible — elegir el color habría dejado de mostrar la foto de ese color hasta elegir también el talle. La matriz de comportamiento documentada en 1.8.6 cambia en su última fila:

  | Config del admin | Antes (≤ 1.9.1, según la doc) | Ahora (1.9.2) |
  |---|---|---|
  | Ningún atributo con el flag (legacy) | Sólo el primero (típicamente color) | Sin cambios |
  | Color con el flag, talle sin él | Color solo cambia; talle ignorado | Sin cambios |
  | Todos los atributos con el flag | Había que elegirlos todos | Cambia con lo que haya elegido; cada eje afina el match |

  En la práctica la última fila nunca se ejecutaba: el flag no se podía leer, así que todo caía en la primera.

---

## [1.9.1] — 2026-07-28

### Fixed

- **`fix(listing)`**: el **shimmer de las cards del listado quedaba visible aunque la imagen ya estuviera pintada**, y volvía a aparecer completo en cada visita a la misma categoría — el merchant lo reportó como "es como que la imagen nunca queda cacheada". Medido en producción (Marcovecchio): en la segunda visita **28 de 28 imágenes venían de disk-cache** (`transferSize = 0`, `complete = true`, listas a los 810 ms) y aun así había **24 shimmers activos**; el destape recién ocurría a los ~2.2 s.
  - Causa: la clase `rp-loaded` que apaga el shimmer sólo la aplicaba `gallery-listing-effects.js`, un módulo RequireJS con `domReady!`. Eso ata el destape a que RequireJS resuelva **toda** la cadena de módulos de la página (~190 archivos en este parque con módulos de terceros), no a que la imagen esté lista. La cache del browser funcionaba perfecto; lo que llegaba tarde era el JS.
  - Fix: nuevo `product/listing/shimmer-critical.phtml`, inyectado en el `<head>` vía `head.additional`. Es un script inline sin dependencias (ni jQuery, ni RequireJS, ni `domReady`) que registra un listener de `load`/`error` **en fase de captura** sobre `document` — los eventos `load` de `<img>` no burbujean pero sí se capturan — antes de que el parser llegue a las imágenes del listado. Suma un barrido inicial en rAF acotado, más `DOMContentLoaded` y `load`, para las imágenes que ya estaban `complete`.
  - `gallery-listing-effects.js` queda como responsable **sólo del contenido que entra por AJAX** (paginación de Amasty Shopby, swatches, widgets lazy). Ambos comparten la clase `rp-loaded`.
  - Los bloques de shimmer ahora respetan `ifconfig="rollpix_gallery/effects/shimmer_enabled"`: con el efecto apagado ya no se emite ningún script.

- **`fix(listing)`**: **N+1 de queries en el listado**. `AddVideoDataPlugin` cargaba los datos de video en batch pero seteaba `rp_listing_video` **sólo en los productos que tenían video**. Un producto sin video quedaba indistinguible de "el batch nunca corrió", así que `ImagePlugin::getVideoHtml()` caía al fallback `loadVideoDataDirect()` y ejecutaba **una query con 4 JOINs por cada card sin video** — en un listado de 24 productos sin video, 24 queries extra por request. Ahora el batch marca los misses con `false` e `ImagePlugin` corta ahí.

- **`fix(listing)`**: `gallery-listing-effects.js` **acumulaba handlers y timers**. El `MutationObserver` sobre `document.body` re-inicializaba cualquier card sin `rp-loaded` en cada mutación del DOM (constante en Luma), apilando un handler `load` y un `setTimeout` de 4 s por disparo. Ahora hay un guard de re-entrada por nodo y las ráfagas de mutaciones se agrupan en un solo scan por frame.

- **`fix(listing)`**: `ImagePlugin::injectVideoHtml()` usaba `preg_replace` con el HTML del video como string de reemplazo, donde `$1`, `$0` y `\1` se interpretan como backreferences — una URL de video con `$` en el querystring rompía el markup en silencio. Reemplazado por `preg_replace_callback`.

- **`fix(listing)`**: el wrapper `.rp-listing-shimmer` se agregaba incluso sobre HTML vacío, dejando un contenedor animando para siempre (sin `<img>` adentro nunca llega un evento `load` que lo destape). Ahora se omite si no hay contenido y no se anida si ya está aplicado.

### Changed

- **`refactor(di)`**: `ImagePlugin` ya no usa `ObjectManager::getInstance()` como fallback de `ResourceConnection`; la dependencia pasa a ser obligatoria por constructor, según el estándar Rollpix.
- **`refactor(sql)`**: `loadVideoDataDirect()` pasa `store_id` con `quoteInto()` en vez de concatenarlo en las condiciones de JOIN. No era explotable (el valor venía casteado a `int`), pero deja de depender de eso.
