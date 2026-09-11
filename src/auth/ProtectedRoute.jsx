import React, { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { FaSpinner } from 'react-icons/fa'
import { supabase } from '../utils/supabase'

/**
 * Wraps a route that should only be reachable by a signed-in user.
 * Usage:
 *   <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
 */
const ProtectedRoute = ({ children }) => {
  const [session, setSession] = useState(undefined) // undefined = still checking, null = signed out

  useEffect(() => {
    // Check for an existing session on mount
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
    })

    // Keep in sync with sign-in/sign-out events (e.g. session expiring, or
    // signing in from the Login page without a full page reload)
    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession)
    })

    return () => listener.subscription.unsubscribe()
  }, [])

  // Still checking for a session — avoid a flash of the login redirect
  if (session === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-400">
        <FaSpinner className="animate-spin" size={20} />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  return children
}

export default ProtectedRoute