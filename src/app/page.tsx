'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function TuitHome() {
  const router = useRouter()

  useEffect(() => {
    const hasCompletedOnboarding = localStorage.getItem(
      'tuit_onboarding_complete'
    )

    if (hasCompletedOnboarding) {
      router.push('/chat')
    } else {
      router.push('/onboarding')
    }
  }, [router])

  return (
    <div className='min-h-screen bg-background flex items-center justify-center'>
      <div className='text-center'>
        <div className='w-12 h-12 rounded-lg bg-blue/[0.1] flex items-center justify-center mx-auto mb-4 animate-pulse'>
          <svg
            className='w-6 h-6 text-blue'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M13 10V3L4 14h7v7l9-11h-7z'
            />
          </svg>
        </div>
        <p className='text-muted-foreground'>Loading tuit...</p>
      </div>
    </div>
  )
}
