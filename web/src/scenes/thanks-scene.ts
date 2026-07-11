/**
 * Premio de /gracias (sesión 3 §3.3): el monograma celebra el mensaje.
 * Reutiliza la pieza del post-footer (misma marca, mismo material) con una
 * coreografía de celebración: entra con un settle desde escala 0 y se queda
 * girando contento con un bob vertical. Nada nuevo pesado: three + monograma
 * ya existen como chunks lazy.
 */
import type {SceneModule} from '../lib/three-island'
import {makeMonogramGroup} from './monogram'

const thanksScene: SceneModule = {
  init({scene, camera}) {
    let built: ReturnType<typeof makeMonogramGroup> | null = null
    let disposed = false
    camera.position.z = 4

    const build = async () => {
      const THREE = await import('three')
      if (disposed) return
      built = makeMonogramGroup(THREE)
      built.group.scale.setScalar(0.001)
      built.group.position.set(0, 0, 0)
      scene.add(built.group)
      const key = new THREE.DirectionalLight('#ffffff', 1.6)
      key.position.set(2, 3, 4)
      const rim = new THREE.DirectionalLight('#D4FF3F', 2.4)
      rim.position.set(-3, -0.5, -2.5)
      scene.add(key, rim, new THREE.AmbientLight('#404040', 1.2))
    }
    void build()

    let born = -1
    return {
      update(t) {
        if (!built) return
        if (born < 0) born = t
        const age = t - born
        // Entrada: settle expo-out (mismo carácter que EASE.out) hasta escala 1.
        const settle = 1 - Math.pow(2, -8 * Math.min(age, 1))
        built.group.scale.setScalar(1.15 * settle)
        // Celebración: giro alegre + bob suave.
        built.group.rotation.y = t * 0.9
        built.group.position.y = Math.sin(t * 2.2) * 0.14
        built.group.rotation.z = Math.sin(t * 1.1) * 0.08
      },
      dispose() {
        disposed = true
        built?.dispose()
      },
    }
  },
}

export default thanksScene
