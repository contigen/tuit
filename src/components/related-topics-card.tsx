import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Sparkles, Tag, Gift, Percent, ChevronRight } from 'lucide-react'

export function RelatedTopicsCard() {
  return (
    <Card className='relative overflow-hidden bg-gradient-to-br from-background via-background to-orange-500/12 border-orange-500/20'>
      <div className='absolute inset-0 bg-gradient-to-br from-transparent via-orange-500/8 to-orange-500/15]' />
      <CardHeader className='relative z-10'>
        <CardTitle className='flex items-center gap-2 text-orange-400'>
          <Sparkles className='w-5 h-5' />
          Related Sponsorship Topics
        </CardTitle>
      </CardHeader>
      <CardContent className='relative z-10 space-y-3'>
        <div className='space-y-2'>
          <div className='flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 cursor-pointer hover:bg-orange-500/15 transition-colors'>
            <div className='flex items-center gap-2'>
              <Tag className='w-4 h-4 text-orange-400' />
              <span className='text-sm font-medium'>
                Camera equipment deals
              </span>
            </div>
            <ChevronRight className='w-4 h-4 text-muted-foreground' />
          </div>
          <div className='flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 cursor-pointer hover:bg-orange-500/15 transition-colors'>
            <div className='flex items-center gap-2'>
              <Gift className='w-4 h-4 text-orange-400' />
              <span className='text-sm font-medium'>
                Software subscription offers
              </span>
            </div>
            <ChevronRight className='w-4 h-4 text-muted-foreground' />
          </div>
          <div className='flex items-center justify-between p-3 rounded-lg bg-orange-500/10 border border-orange-500/20 cursor-pointer hover:bg-orange-500/15 transition-colors'>
            <div className='flex items-center gap-2'>
              <Percent className='w-4 h-4 text-orange-400' />
              <span className='text-sm font-medium'>
                Creator affiliate programs
              </span>
            </div>
            <ChevronRight className='w-4 h-4 text-muted-foreground' />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
