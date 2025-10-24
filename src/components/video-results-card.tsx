import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Youtube } from 'lucide-react'
import { VideoCard } from './video-card'
import type { Video } from './chat-types'

export function VideoResultsCard({ videos }: { videos: Video[] }) {
  return (
    <Card className='relative overflow-hidden bg-gradient-to-br from-background via-background to-purple-500/12 border-purple-500/20'>
      <div className='absolute inset-0 bg-gradient-to-br from-transparent via-purple-500/8 to-purple-500/15]' />
      <CardHeader className='relative z-10'>
        <div className='flex items-center justify-between'>
          <CardTitle className='flex items-center gap-2 text-purple-400'>
            <Youtube className='w-5 h-5' />
            Sponsored Videos ({videos.length} results)
          </CardTitle>
        </div>
      </CardHeader>
      <CardContent className='relative z-10 space-y-4'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
          {videos.map((video, idx) => (
            <VideoCard key={idx} video={video} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
