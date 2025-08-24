import { useState, useEffect } from 'react'

export function useIsConnected() {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Mock connection check - replace with actual Letta server ping
    const checkConnection = async () => {
      try {
        const baseUrl = import.meta.env.VITE_LETTA_BASE_URL || 'http://localhost:8283'
        const response = await fetch(`${baseUrl}/health`, { method: 'GET' })
        setIsConnected(response.ok)
      } catch (error) {
        console.warn('Connection check failed:', error)
        setIsConnected(false)
      }
    }

    checkConnection()
    const interval = setInterval(checkConnection, 30000) // Check every 30 seconds

    return () => clearInterval(interval)
  }, [])

  return isConnected
}