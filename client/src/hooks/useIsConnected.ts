import { useState, useEffect } from 'react'

export function useIsConnected() {
  const [isConnected, setIsConnected] = useState(true)

  useEffect(() => {
    // Simple credential check - if we have the required env vars, assume connected
    const checkConnection = () => {
      const apiKey = import.meta.env.VITE_LETTA_API_KEY
      const agentId = import.meta.env.VITE_LETTA_AGENT_ID
      
      // If we have both credentials, assume connected
      setIsConnected(!!apiKey && !!agentId)
    }

    checkConnection()
    // Check every 30 seconds in case env vars change
    const interval = setInterval(checkConnection, 30000)

    return () => clearInterval(interval)
  }, [])

  return isConnected
}