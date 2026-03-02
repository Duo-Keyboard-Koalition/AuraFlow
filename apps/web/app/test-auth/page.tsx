"use client"

import "@/amplify" // Import Amplify configuration first
import { useState } from 'react'
import { signIn, signUp, getCurrentUser } from '@aws-amplify/auth'

export default function TestAuthPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { isSignUpComplete, userId, nextStep } = await signUp({
        username: email,
        password,
        options: {
          userAttributes: {
            email,
          },
        },
      });

      if (isSignUpComplete) {
        setMessage('Account created successfully! Please check your email to confirm your account.')
      } else if (nextStep.signUpStep === 'CONFIRM_SIGN_UP') {
        setMessage('Account created! Please check your email to confirm your account before signing in.')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const { isSignedIn, nextStep } = await signIn({ username: email, password });
      
      if (isSignedIn) {
        setMessage('Successfully signed in!')
      } else if (nextStep.signInStep === 'CONFIRM_SIGN_UP') {
        setMessage('Please check your email and confirm your account before signing in.')
      } else {
        setMessage('Invalid email or password.')
      }
    } catch (error: any) {
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const handleGetCurrentUser = async () => {
    setLoading(true)
    setMessage('')
    
    try {
      const user = await getCurrentUser()
      setMessage(`Current user: ${user.userId}`)
    } catch (error: any) {
      setMessage(`No authenticated user: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">AWS Cognito Auth Test</h1>
      
      <div className="max-w-md space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border rounded bg-background text-foreground"
            placeholder="Enter email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-2">Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-2 border rounded bg-background text-foreground"
            placeholder="Enter password (min 8 chars)"
          />
        </div>
        
        <div className="space-y-2">
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sign Up'}
          </button>
          
          <button
            onClick={handleSignIn}
            disabled={loading}
            className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Sign In'}
          </button>
          
          <button
            onClick={handleGetCurrentUser}
            disabled={loading}
            className="w-full p-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            {loading ? 'Processing...' : 'Get Current User'}
          </button>
        </div>
        
        {message && (
          <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <p className="text-sm">{message}</p>
          </div>
        )}
      </div>
    </div>
  )
} 