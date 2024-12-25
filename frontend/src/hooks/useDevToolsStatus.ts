import { useEffect, useState } from 'react'

import devtoolsDetect from 'devtools-detect'

interface DevToolsEvent extends Event {
  detail: { isOpen: boolean }
}

export function useDevToolsStatus() {
  const [isDevToolsOpen, setIsDevToolsOpen] = useState(devtoolsDetect.isOpen)

  useEffect(() => {
    const handleChange = (event: DevToolsEvent) => {
      setIsDevToolsOpen(event.detail.isOpen)
    }

    window.addEventListener('devtoolschange', handleChange)

    return () => {
      window.removeEventListener('devtoolschange', handleChange)
    }
  }, [])

  return isDevToolsOpen
}
