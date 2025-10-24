'use client'

import { Button } from '@/components/ui/button'
import {
  getVideoDetailsAction,
  readVideoData,
  searchYouTubeAction,
} from '@/actions'

export default function Page() {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold tracking-tight'>
        Demo page for Tuit
      </h1>
      <div className='flex flex-col gap-2 w-fit'>
        <Button onClick={() => searchYouTubeAction('day in the life')}>
          Search YouTube
        </Button>
        <Button onClick={() => getVideoDetailsAction('kurAo_N6tCQ')}>
          Get Video Details
        </Button>
        <Button onClick={() => readVideoData('5kAfUbpEPbU')}>
          Read Video Data
        </Button>
      </div>
    </div>
  )
}
