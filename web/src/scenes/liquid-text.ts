/**
 * CTA líquido (remediación B1, patrón noth.in real):
 *
 * - REPOSO = texto perfectamente legible: solo una ondulación lenta de
 *   ≤2px de amplitud.
 * - La distorsión responde SOLO a la proximidad del cursor: radial y local
 *   (radio ~150px alrededor del puntero), amplitud máxima ~8% del cuerpo
 *   de letra. Al salir el cursor, vuelve a reposo en ~500ms
 *   (DURATION.element).
 * - Móvil (sin cursor): micro-ondulación alimentada por la velocidad de
 *   scroll — siempre legible.
 *
 * El <a> real queda debajo (cubierto visualmente) y sigue siendo el
 * destino del clic.
 */
import type {SceneModule} from '../lib/three-island'
import {DURATION} from '../lib/motion-tokens'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uMousePx;     // cursor en píxeles del band
  uniform vec2 uResolution;  // tamaño del band en píxeles
  uniform float uTime;
  uniform float uHover;      // 0-1, con decay de ~500ms al salir
  uniform float uScroll;     // micro-intensidad por scroll (móvil)
  uniform float uAmpPx;      // amplitud máxima de la distorsión, en px (~8% del cuerpo)
  varying vec2 vUv;

  // Ruido simplex 2D compacto (Ashima)
  vec3 permute(vec3 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz; x12.xy -= i1;
    i = mod(i, 289.0);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  void main() {
    vec2 fragPx = vUv * uResolution;

    // Influencia radial y local: 1 en el cursor, 0 a 150px.
    float dist = distance(fragPx, uMousePx);
    float local = smoothstep(150.0, 0.0, dist) * uHover;

    // Reposo: ondulación lenta de ≤2px. Scroll móvil: micro-extra (≤3px).
    float idlePx = 2.0 + uScroll * 3.0;

    float n1 = snoise(vUv * 5.0 + uTime * 0.35);
    float n2 = snoise(vUv * 9.0 - uTime * 0.25);

    // Desplazamiento total en píxeles → uv.
    vec2 ampPx = vec2(idlePx + uAmpPx * local);
    vec2 displaced = vUv + vec2(n1, n2) * (ampPx / uResolution);

    gl_FragColor = texture2D(uMap, displaced);
  }
`

const liquidText: SceneModule = {
  init({scene, camera, el}) {
    let disposed = false
    let mesh: import('three').Mesh | null = null
    let uniforms: Record<string, {value: unknown}> | null = null
    const mouse = {x: -9999, y: -9999, tx: -9999, ty: -9999}
    let hover = 0
    let hoverTarget = 0
    let lastScroll = window.scrollY
    let scrollIntensity = 0
    let fontPx = 150 // se ajusta al pintar la textura

    const text = el.querySelector('a')?.textContent?.trim() || '¿Trabajamos juntos?'

    const build = async () => {
      const THREE = await import('three')
      try {
        await document.fonts.load('600 150px "Clash Display"')
      } catch {
        /* fuente del sistema */
      }
      if (disposed) return

      // Textura: el texto pintado a resolución generosa
      const canvas = document.createElement('canvas')
      canvas.width = 2048
      canvas.height = 512
      const ctx = canvas.getContext('2d')!
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const style = getComputedStyle(document.documentElement)
      ctx.fillStyle = style.getPropertyValue('--text').trim() || '#F4F4F0'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      let fontSize = 190
      ctx.font = `600 ${fontSize}px "Clash Display", sans-serif`
      while (ctx.measureText(text).width > canvas.width * 0.94 && fontSize > 60) {
        fontSize -= 8
        ctx.font = `600 ${fontSize}px "Clash Display", sans-serif`
      }
      ctx.fillText(text, canvas.width / 2, canvas.height / 2)

      const texture = new THREE.CanvasTexture(canvas)
      texture.colorSpace = THREE.SRGBColorSpace

      // Plano que cubre el elemento manteniendo la proporción de la textura
      const worldH = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360)
      const worldW = worldH * camera.aspect
      const planeW = worldW * 0.96
      const planeH = planeW * (canvas.height / canvas.width)

      // Cuerpo de letra en píxeles de pantalla: la textura se estira al ancho
      // del band, así que el font px real ≈ fontSize · (bandW/canvasW).
      const rect = el.getBoundingClientRect()
      fontPx = fontSize * ((rect.width * 0.96) / canvas.width)

      uniforms = {
        uMap: {value: texture},
        uMousePx: {value: new THREE.Vector2(-9999, -9999)},
        uResolution: {value: new THREE.Vector2(rect.width, rect.height)},
        uTime: {value: 0},
        uHover: {value: 0},
        uScroll: {value: 0},
        uAmpPx: {value: fontPx * 0.08},
      }
      const material = new THREE.ShaderMaterial({
        uniforms: uniforms as never,
        vertexShader: VERT,
        fragmentShader: FRAG,
        transparent: true,
      })
      mesh = new THREE.Mesh(new THREE.PlaneGeometry(planeW, planeH, 1, 1), material)
      scene.add(mesh)
    }
    void build()

    const onPointerMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect()
      mouse.tx = e.clientX - rect.left
      mouse.ty = rect.height - (e.clientY - rect.top) // uv y crece hacia arriba
      hoverTarget = 1
    }
    const onPointerLeave = () => {
      hoverTarget = 0
    }
    el.addEventListener('pointermove', onPointerMove, {passive: true})
    el.addEventListener('pointerleave', onPointerLeave)

    return {
      update(t, dt) {
        if (!uniforms) return
        // Primer movimiento: el cursor aparece donde está, sin barrido
        if (mouse.x < -999 && mouse.tx > -999) {
          mouse.x = mouse.tx
          mouse.y = mouse.ty
        }
        mouse.x += (mouse.tx - mouse.x) * 0.18
        mouse.y += (mouse.ty - mouse.y) * 0.18

        // Vuelta a reposo en ~DURATION.element (500ms): aproximación
        // exponencial con constante de tiempo ~ element/4.
        const k = Math.min(1, (dt || 0.016) / (DURATION.element / 4))
        hover += (hoverTarget - hover) * k

        // Móvil/scroll: la velocidad de scroll alimenta la micro-ondulación
        const delta = Math.abs(window.scrollY - lastScroll)
        lastScroll = window.scrollY
        scrollIntensity = Math.min(1, scrollIntensity * 0.9 + delta * 0.008)

        const rect = el.getBoundingClientRect()
        ;(uniforms.uResolution.value as import('three').Vector2).set(rect.width, rect.height)
        ;(uniforms.uMousePx.value as import('three').Vector2).set(mouse.x, mouse.y)
        uniforms.uTime.value = t
        uniforms.uHover.value = hover
        uniforms.uScroll.value = scrollIntensity
      },
      dispose() {
        disposed = true
        el.removeEventListener('pointermove', onPointerMove)
        el.removeEventListener('pointerleave', onPointerLeave)
        if (mesh) {
          mesh.geometry.dispose()
          const material = mesh.material as import('three').ShaderMaterial
          ;(material.uniforms.uMap.value as import('three').Texture)?.dispose()
          material.dispose()
        }
      },
    }
  },
}

export default liquidText
