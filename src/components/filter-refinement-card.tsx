import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Label } from '@/components/ui/label'
import { Filter, Clock, ThumbsUp } from 'lucide-react'

export function FilterRefinementCard() {
  return (
    <Card className='relative overflow-hidden bg-gradient-to-br from-background via-background to-emerald-500/12 border-emerald-500/20'>
      <div className='absolute inset-0 bg-gradient-to-br from-transparent via-emerald-500/8 to-emerald-500/15]' />
      <CardHeader className='relative z-10'>
        <CardTitle className='flex items-center gap-2 text-emerald-400'>
          <Filter className='w-5 h-5' />
          Filter & Refinement
        </CardTitle>
      </CardHeader>
      <CardContent className='relative z-10 space-y-4'>
        <p className='text-sm text-muted-foreground'>
          Refine your search by brand, benefit type, or content:
        </p>
        <div className='space-y-3'>
          <div>
            <Label className='text-xs text-muted-foreground mb-2 block'>
              Benefit Type
            </Label>
            <div className='flex flex-wrap gap-2'>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Discount codes
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Giveaways
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Affiliate links
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Free trials
              </Badge>
            </div>
          </div>
          <div>
            <Label className='text-xs text-muted-foreground mb-2 block'>
              Brand
            </Label>
            <div className='flex flex-wrap gap-2'>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Insta360
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                GoPro
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Adobe
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Notion
              </Badge>
            </div>
          </div>
          <div>
            <Label className='text-xs text-muted-foreground mb-2 block'>
              Content Type
            </Label>
            <div className='flex flex-wrap gap-2'>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Reviews
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Tutorials
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Unboxings
              </Badge>
              <Badge
                variant='outline'
                className='cursor-pointer hover:bg-emerald-500/10'
              >
                Vlogs
              </Badge>
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 gap-3 pt-2'>
          <Button
            variant='outline'
            size='sm'
            className='justify-start bg-transparent border-emerald-500/30 hover:bg-emerald-500/10'
          >
            <Clock className='w-3 h-3 mr-2' />
            Recent (last week)
          </Button>
          <Button
            variant='outline'
            size='sm'
            className='justify-start bg-transparent border-emerald-500/30 hover:bg-emerald-500/10'
          >
            <ThumbsUp className='w-3 h-3 mr-2' />
            Highly rated
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
