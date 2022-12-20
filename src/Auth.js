import { useState } from 'react'
import { supabase } from './supabaseClient'
import Account from './Account'

export default function Auth() {
  const [loading, setLoading] = useState(false)
  const [email, setEmail] = useState('')
  const [email2, setEmail2] = useState('')
  const [password, setPassword] = useState('')
  const [session, setSession] = useState(null)
  const [loggedIn, setLoggedIn] = useState(false)

  const handleLogin = async (email) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOtp({ email })
      if (error) throw error
      alert('Check your email for the login link!')
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMailLogin = async (em, pw) => {
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({ email: em, password: pw })
      console.log(data)
      const {session, user} = data
      if (session != null) {
        setSession(session)
        setLoggedIn(true)
      }
    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleMailRegister = async (em, pw) => {
    console.log('em: '+em+' pw: '+pw)
    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({ email: em, password: pw })
      const {session, user} = data
      console.log(data)
      console.log(error)
      if (session != null) {
        setSession(session)
        setLoggedIn(true)
      }

    } catch (error) {
      alert(error.error_description || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ padding: '50px 0 100px 0' }}>
      {!loggedIn ? 
      <div className="row flex flex-center">
      <div className="col-6 form-widget">
        <h1 className="header">Supabase + React</h1>
        <p className="description">Sign in and register via magic link with your email below</p>
        <div key="email1">
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            key="mailfield1"
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleLogin(email)
            }}
            className={'button block'}
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Send magic link</span>}
          </button>
        </div>
        <p className="description">Sign in with email and Password</p>
        <div key="email2">
          <input
            className="inputField"
            type="email"
            placeholder="Your email"
            value={email2}
            onChange={(e) => setEmail2(e.target.value)}
            key="mailfield2"
          />
        </div>
        <div key="password">
          <input
            className="inputField"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            key="passworfield"
          />
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleMailLogin(email2, password)
            }}
            className={'button block'}
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Login</span>}
          </button>
        </div>
        <div>
          <button
            onClick={(e) => {
              e.preventDefault()
              handleMailRegister(email2, password)
            }}
            className={'button block'}
            disabled={loading}
          >
            {loading ? <span>Loading</span> : <span>Register</span>}
          </button>
        </div>
      </div>
    </div>
      : <Account key={session.user.id} session={session} />}
    </div>    
  )
}
