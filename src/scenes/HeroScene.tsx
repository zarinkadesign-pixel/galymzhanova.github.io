import { Suspense, lazy, useEffect } from 'react'

const Spline = lazy(() => import('@splinetool/react-spline'))

const SCENE_URL = 'https://prod.spline.design/sO8rVeULNZixj6Ai/scene.splinecode'

export default function HeroScene({ onLoaded }: { onLoaded: () => void }) {
  useEffect(() => {
    const t = setTimeout(onLoaded, 3500)
    return () => clearTimeout(t)
  }, [onLoaded])

  return (
    <Suspense fallback={null}>
      <div style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
        <Spline scene={SCENE_URL} onLoad={onLoaded} />
      </div>
    </Suspense>
  )
}
