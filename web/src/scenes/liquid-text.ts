/**
 * CTA líquido (efecto noth.in): un plano con la textura del texto
 * "¿Trabajamos juntos?" cuya UV se desplaza con ruido alrededor del cursor.
 * En móvil reacciona a la velocidad de scroll. El <a> real queda debajo
 * (cubierto visualmente) y sigue siendo el destino del clic.
 */
import type {SceneModule} from '../lib/three-island'

const VERT = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const FRAG = /* glsl */ `
  uniform sampler2D uMap;
  uniform vec2 uMouse;
  uniform float uTime;
  uniform float uIntensity;
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
    float dist = distance(vUv, uMouse);
    float influence = smoothstep(0.45, 0.0, dist) + uIntensity;
    float n1 = snoise(vUv * 6.0 + uTime * 0.6);
    float n2 = snoise(vUv * 11.0 - uTime * 0.4);
    vec2 displaced = vUv + vec2(n1, n2) * 0.035 * influence;
    vec4 color = texture2D(uMap, displaced);
    gl_FragColor = color;
  }
`

const liquidText: SceneModule = {
  init({scene, camera, el}) {
    let disposed = false
    let mesh: import('three').Mesh | null = null
    let uniforms: Record<string, {value: unknown}> | null = null
    const mouse = {x: 0.5, y: 0.5, tx: 0.5, ty: 0.5}
    let lastScroll = window.scrollY
    let scrollIntensity = 0

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
      ctx.fillStyle = 'rgba(0,0,0,0)'
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

      uniforms = {
        uMap: {value: texture},
        uMouse: {value: new THREE.Vector2(0.5, 0.5)},
        uTime: {value: 0},
        uIntensity: {value: 0},
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
      mouse.tx = (e.clientX - rect.left) / rect.width
      mouse.ty = 1 - (e.clientY - rect.top) / rect.height
    }
    el.addEventListener('pointermove', onPointerMove, {passive: true})

    return {
      update(t) {
        if (!uniforms) return
        mouse.x += (mouse.tx - mouse.x) * 0.1
        mouse.y += (mouse.ty - mouse.y) * 0.1

        // Móvil/scroll: la velocidad de scroll alimenta la intensidad global
        const delta = Math.abs(window.scrollY - lastScroll)
        lastScroll = window.scrollY
        scrollIntensity = Math.min(1.2, scrollIntensity * 0.92 + delta * 0.01)

        ;(uniforms.uMouse.value as import('three').Vector2).set(mouse.x, mouse.y)
        uniforms.uTime.value = t
        uniforms.uIntensity.value = scrollIntensity * 0.5
      },
      dispose() {
        disposed = true
        el.removeEventListener('pointermove', onPointerMove)
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
