import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tag, Eye, Calendar, Ticket, ExternalLink, Clock } from 'lucide-react'
import type { Video } from './chat-types'

export function VideoCard({ video }: { video: Video }) {
  return (
    <Card className='group cursor-pointer hover:shadow-lg hover:shadow-blue/10 hover:border-blue/30 transition-all duration-300 overflow-hidden bg-card/50 backdrop-blur-sm'>
      <div className='relative'>
        <img
          src={video.thumbnail || '/placeholder.svg'}
          alt={video.title}
          className='w-full aspect-video object-cover'
        />
        <div className='absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded'>
          {video.duration}
        </div>
        <div className='absolute top-2 left-2 bg-blue/90 text-white text-xs px-2 py-1 rounded font-medium flex items-center gap-1'>
          <Tag className='w-3 h-3' />
          {video.sponsor}
        </div>
        <div className='absolute top-2 right-2 bg-emerald-500/90 text-white text-xs px-2 py-1 rounded font-medium'>
          {video.offerLabel}
        </div>
      </div>
      <CardContent className='p-3'>
        <h3 className='font-semibold text-sm mb-2 line-clamp-2 leading-snug group-hover:text-blue transition-colors'>
          <a href={video.videoUrl} target='_blank' rel='noopener noreferrer'>
            {video.title}
          </a>
        </h3>
        <p className='text-xs text-muted-foreground mb-2'>{video.channel}</p>
        <Badge variant='secondary' className='mb-2 text-xs'>
          {video.offerType}
        </Badge>
        <p className='text-xs text-muted-foreground mb-2 line-clamp-2'>
          {video.offerDescription}
        </p>
        {video.discountCodeFromDescription && (
          <div className='mb-2 p-2 bg-gradient-to-r from-blue/10 to-emerald-500/10 border border-blue/20 rounded-md'>
            <div className='flex items-center gap-1.5 mb-1'>
              <Ticket className='w-3.5 h-3.5 text-blue' />
              <span className='text-xs font-semibold text-blue'>
                Discount Code
              </span>
            </div>
            <code className='text-sm font-bold text-foreground bg-background/80 px-2 py-1 rounded border border-border select-all'>
              {video.discountCodeFromDescription}
            </code>
          </div>
        )}
        {video.discountCodes && video.discountCodes.length > 0 && (
          <div className='mb-2 space-y-2'>
            {video.discountCodesRevealTimeframe && (
              <div className='flex items-center gap-1.5 text-xs text-muted-foreground'>
                <Clock className='w-3 h-3' />
                <span>{video.discountCodesRevealTimeframe}</span>
              </div>
            )}
            {video.discountCodes.map((discountCode, index) => (
              <div
                key={index}
                className='p-2 bg-gradient-to-r from-blue/10 to-emerald-500/10 border border-blue/20 rounded-md'
              >
                <div className='flex items-center justify-between gap-1.5 mb-1'>
                  <div className='flex items-center gap-1.5'>
                    <Ticket className='w-3.5 h-3.5 text-blue' />
                    <span className='text-xs font-semibold text-blue'>
                      Discount Code
                    </span>
                  </div>
                  {discountCode.sponsorUrl && (
                    <a
                      href={discountCode.sponsorUrl}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex items-center gap-1 text-xs text-blue hover:text-blue/80 transition-colors'
                    >
                      <ExternalLink className='w-3 h-3' />
                      <span>Visit</span>
                    </a>
                  )}
                </div>
                <code className='text-sm font-bold text-foreground bg-background/80 px-2 py-1 rounded border border-border select-all block mb-1'>
                  {discountCode.code}
                </code>
                {discountCode.description && (
                  <p className='text-xs text-muted-foreground'>
                    {discountCode.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
        <div className='flex items-center gap-2 text-xs text-muted-foreground'>
          <div className='flex items-center gap-1'>
            <Eye className='w-3 h-3' />
            {video.views}
          </div>
          <div className='flex items-center gap-1'>
            <Calendar className='w-3 h-3' />
            {video.publishedAt}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
