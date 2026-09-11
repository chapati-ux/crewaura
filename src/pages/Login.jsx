import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaRing, FaSpinner, FaExclamationCircle } from 'react-icons/fa'
import { supabase } from '../utils/supabase'

const PURPLE = '#2D1C3E'
const GOLD = '#C8A96A'
const IVORY = '#FBF7EF'
const LINE = 'rgba(45,28,62,0.12)'

const Login = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState('idle') // idle | signing-in | error
  const [errorMsg, setErrorMsg] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('signing-in')
    setErrorMsg('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setStatus('error')
      // Supabase returns a generic "Invalid login credentials" for both wrong
      // email and wrong password, by design, so it doesn't leak which one is wrong.
      setErrorMsg(error.message || 'Something went wrong. Please try again.')
      return
    }

    // onAuthStateChange in ProtectedRoute will pick up the new session, but
    // navigating explicitly avoids any flash of the login form.
    navigate('/admin', { replace: true })
  }

  const fieldClass =
    'w-full border px-4 py-3 text-sm focus:outline-none focus:ring-1 transition-colors bg-white'
  const fieldStyle = {
    fontFamily: "'Poppins', sans-serif",
    color: PURPLE,
    borderColor: LINE,
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-6"
      style={{ backgroundColor: IVORY }}
    >
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center text-center mb-8">
          <FaRing size={28} style={{ color: GOLD }} className="mb-4" />
          <h1
            className="text-2xl"
            style={{ color: PURPLE, fontFamily: "'Playfair Display', serif" }}
          >
            Admin Login
          </h1>
          <p
            className="text-sm mt-2"
            style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
          >
            Sign in to view enquiries.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-8 space-y-5"
          style={{ backgroundColor: '#fff', border: `1px solid ${LINE}` }}
        >
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs uppercase tracking-widest mb-2"
              style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs uppercase tracking-widest mb-2"
              style={{ color: PURPLE, opacity: 0.6, fontFamily: "'Poppins', sans-serif" }}
            >
              Password
            </label>
            <input
              id="login-password"
              type="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={fieldClass}
              style={fieldStyle}
            />
          </div>

          {status === 'error' && (
            <p
              className="text-sm flex items-center gap-2"
              style={{ color: '#a3403f', fontFamily: "'Poppins', sans-serif" }}
            >
              <FaExclamationCircle /> {errorMsg}
            </p>
          )}

          <button
            type="submit"
            disabled={status === 'signing-in'}
            className="w-full inline-flex items-center justify-center rounded-full px-8 py-3 text-sm font-semibold transition-transform duration-300 hover:scale-105 disabled:opacity-60 disabled:hover:scale-100"
            style={{ backgroundColor: GOLD, color: PURPLE, fontFamily: "'Poppins', sans-serif" }}
          >
            {status === 'signing-in' ? (
              <span className="inline-flex items-center gap-2">
                <FaSpinner className="animate-spin" size={14} />
                Signing in...
              </span>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-sm"
            style={{ color: PURPLE, opacity: 0.5, fontFamily: "'Poppins', sans-serif" }}
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </main>
  )
}

export default Login