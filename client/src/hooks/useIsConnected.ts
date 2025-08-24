import { useState, useEffect } from 'react'

export function useIsConnected() {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Mock connection check - replace with actual Letta server ping
    const checkConnection = async () => {
      try {
        const baseUrl = import.meta.env.VITE_LETTA_BASE_URL || 'https://api.letta.com'
        const apiBase = `${baseUrl.replace(/\/$/, '')}/v1`
        const apiKey = import.meta.env.VITE_LETTA_API_KEY
        const response = await fetch(`${apiBase}/health`, { method: 'GET', headers: apiKey ? { Authorization: `Bearer ${apiKey}` } : undefined })
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