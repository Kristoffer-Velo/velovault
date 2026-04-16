import { useRef, useCallback } from 'react'

export interface Position { x: number; y: number }

export function useNodePositions() {
  const positions = useRef(new Map<string, Position>())
  const listeners = useRef(new Set<() => void>())
  const frameRef = useRef<number>(0)

  const update = useCallback((id: string, pos: Position) => {
    positions.current.set(id, pos)
    if (!frameRef.current) {
      frameRef.current = requestAnimationFrame(() => {
        frameRef.current = 0
        listeners.current.forEach(fn => fn())
      })
    }
  }, [])

  const get = useCallback((id: string) => positions.current.get(id), [])

  const subscribe = useCallback((fn: () => void) => {
    listeners.current.add(fn)
    return () => { listeners.current.delete(fn) }
  }, [])

  return { update, get, subscribe, positions }
}

export type NodePositions = ReturnType<typeof useNodePositions>
