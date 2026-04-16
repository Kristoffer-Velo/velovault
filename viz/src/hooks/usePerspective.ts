import { useCallback, useRef } from 'react'

export function usePerspective(maxDeg = 2) {
  const ref = useRef<HTMLDivElement>(null)

  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    ref.current.style.transform =
      `rotateY(${x * maxDeg}deg) rotateX(${-y * maxDeg}deg)`
  }, [maxDeg])

  const onMouseLeave = useCallback(() => {
    if (ref.current) {
      ref.current.style.transform = 'rotateY(0deg) rotateX(0deg)'
    }
  }, [])

  return { ref, onMouseMove, onMouseLeave }
}
