/**
 * Pieza del secreto post-footer: una A del monograma girando despacio,
 * misma estética (blanco roto + lima) que el logo 3D del hero. Decorativa:
 * el texto y la puerta a /casa son HTML y existen siempre debajo.
 */
import type {SceneModule} from '../lib/three-island'
import {makeMonogramGroup} from './monogram'

const postFooterScene: SceneModule = {
  init({scene, camera}) {
    let built: ReturnType<typeof makeMonogramGroup> | null = null
    let disposed = false
    camera.position.z = 4

    const build = async () => {
      const THREE = await import('three')
      if (disposed) return
      built = makeMonogramGroup(THREE)
      built.group.scale.setScalar(1.3)
      scene.add(built.group)
      const key = new THREE.DirectionalLight('#ffffff', 1.6)
      key.position.set(2, 3, 4)
      const rim = new THREE.DirectionalLight('#D4FF3F', 2.2)
      rim.position.set(-3, -0.5, -2.5)
      scene.add(key, rim, new THREE.AmbientLight('#404040', 1.2))
    }
    void build()

    return {
      update(t) {
        if (!built) return
        built.group.rotation.y = t * 0.35
        built.group.rotation.x = Math.sin(t * 0.3) * 0.18
      },
      dispose() {
        disposed = true
        built?.dispose()
      },
    }
  },
}

export default postFooterScene
