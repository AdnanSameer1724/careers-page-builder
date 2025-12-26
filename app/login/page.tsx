'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [isSignUp, setIsSignUp] = useState(false)

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [message, setMessage] = useState('')

  const images = [
    '/slide1.jpg',
    '/slide2.jpg',
    '/slide3.jpg',
  ]

  const [currentImage, setCurrentImage] = useState(0)

   useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length)
    }, 3500)
    return () => clearInterval(interval)
  }, [])

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const supabase = createClient()

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })
        if (error) throw error
        alert('Account created! Please log in.')
        setIsSignUp(false)
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/demo-company/edit')
        router.refresh()
      }
    } catch (error: any) {
      alert(`${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#1f1f2b] text-white">

      {/* ================= LEFT IMAGE SECTION ================= */}
      <div className="relative hidden md:block m-8">
        <Image
          src={images[currentImage]}
          alt="Auth image"
          fill
          priority
          className="object-cover transition-opacity duration-700 rounded-2xl"
        />

        <div className="absolute bottom-10 left-10 max-w-md">
          <h2 className="text-3xl font-semibold leading-snug">
            Capturing Moments,<br />Creating Memories
          </h2>

          <div className="flex gap-2 mt-4">
            {images.map((_, index) => (
              <span
                key={index}
                className={`h-1.5 w-8 rounded-full transition-all ${
                  index === currentImage ? 'bg-white' : 'bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* ================= RIGHT FORM SECTION ================= */}
      <div className="flex px-6 m-12">
        <div className="w-full max-w-md space-y-6">

          {/* Header */}
          <div className='my-12'>
            <h1 className="text-6xl font-bold mb-4">
              {isSignUp ? 'Create an account' : 'Log in'}
            </h1>
            <p className="text-sm text-gray-400 mt-1">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                type="button"
                className="ml-1 underline cursor-pointer"
                onClick={() => {
                  setIsSignUp(!isSignUp)
                  setMessage('')
                }}
              >
                {isSignUp ? 'Log in' : 'Sign up'}
              </button>
            </p>
          </div>

          {/* Form */}
<form onSubmit={handleAuth} className="space-y-4">

  {isSignUp && (
    <div className="grid grid-cols-2 gap-3 text-black">
      <input
        type="text"
        placeholder="First name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        required
        className="auth-input my-4 w-full h-10 bg-white p-4 rounded-lg"
      />
      <input
        type="text"
        placeholder="Last name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        required
        className="auth-input my-4 w-full h-10 bg-white p-4 rounded-lg"
      />
    </div>
  )}

  {/* Email */}
  <div className="w-full text-black">
    <input
      type="email"
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="auth-input my-4 w-full h-10 bg-white p-4 rounded-lg"
    />
  </div>

  {/* Password */}
  <div className="w-full text-black">
    <input
      type="password"
      placeholder="Password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      minLength={6}
      className="auth-input my-4 w-full h-10 bg-white p-4 rounded-lg"
    />
  </div>

  {message && (
    <p className="text-sm text-center">{message}</p>
  )}

  <button
    type="submit"
    disabled={loading}
    className="w-full bg-[#6b5cff] hover:bg-[#5a4be0] transition py-3 rounded-lg font-medium disabled:opacity-60 cursor-pointer"
  >
    {loading
      ? 'Please wait...'
      : isSignUp
      ? 'Create account'
      : 'Log in'}
  </button>
</form>

        </div>
      </div>
    </div>
  )
}